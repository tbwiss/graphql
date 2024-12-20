/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Cypher from "@neo4j/cypher-builder";
import type { Node, Relationship } from "../classes";
import type { Neo4jGraphQLTranslationContext } from "../types/neo4j-graphql-translation-context";
import { caseWhere } from "../utils/case-where";
import { checkAuthentication } from "./authorization/check-authentication";
import { createAuthorizationBeforeAndParams } from "./authorization/compatibility/create-authorization-before-and-params";
import createConnectionWhereAndParams from "./where/create-connection-where-and-params";

interface Res {
    strs: string[];
    params: any;
}

function createDeleteAndParams({
    deleteInput,
    varName,
    node,
    parentVar,
    chainStr,
    withVars,
    context,
    parameterPrefix,
    recursing,
}: {
    parentVar: string;
    deleteInput: any;
    varName: string;
    chainStr?: string;
    node: Node;
    withVars: string[];
    context: Neo4jGraphQLTranslationContext;
    parameterPrefix: string;
    recursing?: boolean;
}): [string, any] {
    checkAuthentication({ context, node, targetOperations: ["DELETE"] });

    function reducer(res: Res, [key, value]: [string, any]) {
        checkAuthentication({ context, node, targetOperations: ["DELETE"], field: key });

        const relationField = node.relationFields.find((x) => key === x.fieldName);

        if (relationField) {
            const refNodes: Node[] = [];

            const relationship = context.relationships.find(
                (x) => x.properties === relationField.properties
            ) as unknown as Relationship;

            if (relationField.union) {
                Object.keys(value).forEach((unionTypeName) => {
                    refNodes.push(context.nodes.find((x) => x.name === unionTypeName) as Node);
                });
            } else if (relationField.interface) {
                relationField.interface.implementations?.forEach((implementationName) => {
                    refNodes.push(context.nodes.find((x) => x.name === implementationName) as Node);
                });
            } else {
                refNodes.push(context.nodes.find((x) => x.name === relationField.typeMeta.name) as Node);
            }

            const inStr = relationField.direction === "IN" ? "<-" : "-";
            const outStr = relationField.direction === "OUT" ? "->" : "-";

            refNodes.forEach((refNode) => {
                checkAuthentication({ context, node: refNode, targetOperations: ["DELETE"] });

                const v = relationField.union ? value[refNode.name] : value;
                const deletes = relationField.typeMeta.array ? v : [v];

                deletes.forEach((d, index) => {
                    const innerStrs: string[] = [];

                    const variableName = chainStr
                        ? `${varName}${index}`
                        : `${varName}_${key}${
                              relationField.union || relationField.interface ? `_${refNode.name}` : ""
                          }${index}`;
                    const relationshipVariable = `${variableName}_relationship`;
                    const relTypeStr = `[${relationshipVariable}:${relationField.type}]`;
                    const nodeToDelete = `${variableName}_to_delete`;
                    const labels = refNode.getLabelString(context);

                    innerStrs.push("WITH *");
                    innerStrs.push("CALL {");
                    if (withVars) {
                        innerStrs.push(`WITH *`);
                    }
                    innerStrs.push(
                        `OPTIONAL MATCH (${parentVar})${inStr}${relTypeStr}${outStr}(${variableName}${labels})`
                    );

                    const whereStrs: string[] = [];
                    let aggregationWhere = false;
                    if (d.where) {
                        try {
                            const {
                                cypher: whereCypher,
                                subquery: preComputedSubqueries,
                                params: whereParams,
                            } = createConnectionWhereAndParams({
                                nodeVariable: variableName,
                                whereInput: d.where,
                                node: refNode,
                                context,
                                relationshipVariable,
                                relationship,
                                parameterPrefix: `${parameterPrefix}${!recursing ? `.${key}` : ""}${
                                    relationField.union ? `.${refNode.name}` : ""
                                }${relationField.typeMeta.array ? `[${index}]` : ""}.where`,
                            });
                            if (whereCypher) {
                                whereStrs.push(whereCypher);
                                res.params = { ...res.params, ...whereParams };
                                if (preComputedSubqueries) {
                                    innerStrs.push(preComputedSubqueries);
                                    aggregationWhere = true;
                                }
                            }
                        } catch (err) {
                            innerStrs.push(" \n}");
                            return;
                        }
                    }

                    const authorizationAndParams = createAuthorizationBeforeAndParams({
                        context,
                        nodes: [
                            {
                                variable: variableName,
                                node: refNode,
                            },
                        ],
                        operations: ["DELETE"],
                        indexPrefix: "delete",
                    });

                    if (authorizationAndParams) {
                        const { cypher, params, subqueries } = authorizationAndParams;

                        whereStrs.push(cypher);
                        res.params = { ...res.params, ...params };

                        if (subqueries) {
                            innerStrs.push(subqueries);
                            innerStrs.push("WITH *");
                        }
                    }

                    if (whereStrs.length) {
                        const predicate = `${whereStrs.join(" AND ")}`;
                        if (aggregationWhere) {
                            const columns = [
                                new Cypher.NamedVariable(relationshipVariable),
                                new Cypher.NamedVariable(variableName),
                            ];
                            const caseWhereClause = caseWhere(new Cypher.Raw(predicate), columns);
                            const { cypher } = caseWhereClause.build({ prefix: "aggregateWhereFilter" });
                            innerStrs.push(cypher);
                        } else {
                            innerStrs.push(`WHERE ${predicate}`);
                        }
                    }

                    if (d.delete) {
                        const nestedDeleteInput = Object.entries(d.delete).reduce(
                            (d1, [k1, v1]) => ({ ...d1, [k1]: v1 }),
                            {}
                        );
                        const importWithVars = [...withVars, variableName];

                        const deleteAndParams = createDeleteAndParams({
                            context,
                            node: refNode,
                            deleteInput: nestedDeleteInput,
                            varName: variableName,
                            withVars: importWithVars,
                            parentVar: variableName,
                            parameterPrefix: `${parameterPrefix}${!recursing ? `.${key}` : ""}${
                                relationField.union ? `.${refNode.name}` : ""
                            }${relationField.typeMeta.array ? `[${index}]` : ""}.delete`,
                            recursing: false,
                        });
                        innerStrs.push(deleteAndParams[0]);
                        res.params = { ...res.params, ...deleteAndParams[1] };
                    }

                    const statements = [
                        `WITH ${relationshipVariable}, collect(DISTINCT ${variableName}) AS ${nodeToDelete}`,
                        "CALL {",
                        `\tWITH ${nodeToDelete}`,
                        `\tUNWIND ${nodeToDelete} AS x`,
                        `\tDETACH DELETE x`,
                        `}`,
                        `}`,
                    ];
                    innerStrs.push(...statements);

                    res.strs.push(...innerStrs);
                });
            });

            return res;
        }

        return res;
    }

    const { strs, params } = Object.entries(deleteInput).reduce(reducer, {
        strs: [],
        params: {},
    });

    return [strs.join("\n"), params];
}

export default createDeleteAndParams;
