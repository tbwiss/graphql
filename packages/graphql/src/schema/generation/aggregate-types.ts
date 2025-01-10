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
import type { DirectiveNode } from "graphql";
import { GraphQLFloat, GraphQLInt, GraphQLNonNull } from "graphql";
import type {
    InputTypeComposer,
    InputTypeComposerFieldConfigMapDefinition,
    ObjectTypeComposer,
    ObjectTypeComposerFieldConfigMapDefinition,
    SchemaComposer,
} from "graphql-compose";
import { AGGREGATION_COMPARISON_OPERATORS, DEPRECATED } from "../../constants";
import type { AttributeAdapter } from "../../schema-model/attribute/model-adapters/AttributeAdapter";
import { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { InterfaceEntityAdapter } from "../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import type { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
import { RelationshipDeclarationAdapter } from "../../schema-model/relationship/model-adapters/RelationshipDeclarationAdapter";
import type { Neo4jFeaturesSettings } from "../../types";
import type { AggregationTypesMapper } from "../aggregations/aggregation-types-mapper";
import { DEPRECATE_ID_AGGREGATION, DEPRECATE_IMPLICIT_EQUAL_FILTERS } from "../constants";
import { numericalResolver } from "../resolvers/field/numerical";
import { graphqlDirectivesToCompose } from "../to-compose";
import { shouldAddDeprecatedFields } from "./utils";

export function withAggregateSelectionType({
    entityAdapter,
    aggregationTypesMapper,
    propagatedDirectives,
    composer,
}: {
    entityAdapter: ConcreteEntityAdapter | InterfaceEntityAdapter;
    aggregationTypesMapper: AggregationTypesMapper;
    propagatedDirectives: DirectiveNode[];
    composer: SchemaComposer;
}): ObjectTypeComposer {
    const aggregateSelection = composer.createObjectTC({
        name: entityAdapter.operations.aggregateTypeNames.selection,
        fields: {
            count: {
                type: new GraphQLNonNull(GraphQLInt),
                resolve: numericalResolver,
                args: {},
            },
        },
        directives: graphqlDirectivesToCompose(propagatedDirectives),
    });
    aggregateSelection.addFields(makeAggregableFields({ entityAdapter, aggregationTypesMapper }));
    return aggregateSelection;
}

function makeAggregableFields({
    entityAdapter,
    aggregationTypesMapper,
}: {
    entityAdapter: ConcreteEntityAdapter | InterfaceEntityAdapter;
    aggregationTypesMapper: AggregationTypesMapper;
}): ObjectTypeComposerFieldConfigMapDefinition<any, any> {
    const aggregableFields: ObjectTypeComposerFieldConfigMapDefinition<any, any> = {};
    const aggregableAttributes = entityAdapter.aggregableFields;
    for (const attribute of aggregableAttributes) {
        const objectTypeComposer = aggregationTypesMapper.getAggregationType(attribute.getTypeName());
        if (objectTypeComposer) {
            // TODO: REMOVE ID FIELD ON 7.x
            if (attribute.typeHelper.isID()) {
                aggregableFields[attribute.name] = {
                    type: objectTypeComposer.NonNull,
                    directives: [DEPRECATE_ID_AGGREGATION],
                };
                continue;
            }
            aggregableFields[attribute.name] = { type: objectTypeComposer.NonNull };
        }
    }
    return aggregableFields;
}

export function withAggregateInputType({
    relationshipAdapter,
    entityAdapter, // TODO: this is relationshipAdapter.target but from the context above it is known to be ConcreteEntity and we don't know this yet!!!
    composer,
    userDefinedDirectivesOnTargetFields,
    features,
}: {
    relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter;
    entityAdapter: ConcreteEntityAdapter | InterfaceEntityAdapter;
    composer: SchemaComposer;
    userDefinedDirectivesOnTargetFields: Map<string, DirectiveNode[]> | undefined;
    features: Neo4jFeaturesSettings | undefined;
}): InputTypeComposer {
    const aggregateInputTypeName = relationshipAdapter.operations.aggregateInputTypeName;
    if (composer.has(aggregateInputTypeName)) {
        return composer.getITC(aggregateInputTypeName);
    }

    const aggregateWhereInput = composer.createInputTC({
        name: aggregateInputTypeName,
        fields: {
            count_EQ: GraphQLInt,
            count_LT: GraphQLInt,
            count_LTE: GraphQLInt,
            count_GT: GraphQLInt,
            count_GTE: GraphQLInt,
        },
    });

    if (shouldAddDeprecatedFields(features, "implicitEqualFilters")) {
        aggregateWhereInput.addFields({
            count: { type: GraphQLInt, directives: [DEPRECATE_IMPLICIT_EQUAL_FILTERS] },
        });
    }

    aggregateWhereInput.addFields({
        AND: aggregateWhereInput.NonNull.List,
        OR: aggregateWhereInput.NonNull.List,
        NOT: aggregateWhereInput,
    });

    const nodeWhereInputType = withAggregationWhereInputType({
        relationshipAdapter,
        entityAdapter,
        composer,
        userDefinedDirectivesOnTargetFields,
        features,
    });
    if (nodeWhereInputType) {
        aggregateWhereInput.addFields({ node: nodeWhereInputType });
    }
    const edgeWhereInputType = withAggregationWhereInputType({
        relationshipAdapter,
        entityAdapter: relationshipAdapter,
        composer,
        userDefinedDirectivesOnTargetFields,
        features,
    });
    if (edgeWhereInputType) {
        aggregateWhereInput.addFields({ edge: edgeWhereInputType });
    }
    return aggregateWhereInput;
}

function withAggregationWhereInputType({
    relationshipAdapter,
    entityAdapter,
    composer,
    userDefinedDirectivesOnTargetFields,
}: {
    relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter;
    entityAdapter:
        | ConcreteEntityAdapter
        | RelationshipAdapter
        | RelationshipDeclarationAdapter
        | InterfaceEntityAdapter;
    composer: SchemaComposer;
    userDefinedDirectivesOnTargetFields: Map<string, DirectiveNode[]> | undefined;
    features: Neo4jFeaturesSettings | undefined;
}): InputTypeComposer | undefined {
    const aggregationInputName =
        entityAdapter instanceof ConcreteEntityAdapter || entityAdapter instanceof InterfaceEntityAdapter
            ? relationshipAdapter.operations.nodeAggregationWhereInputTypeName
            : relationshipAdapter.operations.edgeAggregationWhereInputTypeName;
    if (composer.has(aggregationInputName)) {
        return composer.getITC(aggregationInputName);
    }
    if (entityAdapter instanceof RelationshipDeclarationAdapter) {
        return;
    }
    const aggregationFields = entityAdapter.aggregationWhereFields;
    if (!aggregationFields.length) {
        return;
    }
    const aggregationInput = composer.createInputTC({
        name: aggregationInputName,
        fields: {},
    });
    aggregationInput.addFields({
        AND: aggregationInput.NonNull.List,
        OR: aggregationInput.NonNull.List,
        NOT: aggregationInput,
    });

    const aggrFields = makeAggregationFields(aggregationFields, userDefinedDirectivesOnTargetFields);
    aggregationInput.addFields(aggrFields);
    return aggregationInput;
}

function makeAggregationFields(
    attributes: AttributeAdapter[],
    userDefinedDirectivesOnTargetFields: Map<string, DirectiveNode[]> | undefined
): InputTypeComposerFieldConfigMapDefinition {
    const fields: InputTypeComposerFieldConfigMapDefinition = {};
    for (const attribute of attributes) {
        addAggregationFieldsByType(attribute, userDefinedDirectivesOnTargetFields?.get(attribute.name), fields);
    }
    return fields;
}

// TODO: refactor this by introducing specialized Adapters
function addAggregationFieldsByType(
    attribute: AttributeAdapter,
    directivesOnField: DirectiveNode[] | undefined,
    fields: InputTypeComposerFieldConfigMapDefinition
): InputTypeComposerFieldConfigMapDefinition {
    const deprecatedDirectives = graphqlDirectivesToCompose(
        (directivesOnField || []).filter((d) => d.name.value === DEPRECATED)
    );

    if (attribute.typeHelper.isString()) {
        for (const operator of AGGREGATION_COMPARISON_OPERATORS) {
            fields[`${attribute.name}_AVERAGE_LENGTH_${operator}`] = {
                type: GraphQLFloat,
                directives: deprecatedDirectives,
            };
            fields[`${attribute.name}_LONGEST_LENGTH_${operator}`] = {
                type: GraphQLInt,
                directives: deprecatedDirectives,
            };
            fields[`${attribute.name}_SHORTEST_LENGTH_${operator}`] = {
                type: GraphQLInt,
                directives: deprecatedDirectives,
            };
        }
        return fields;
    }
    if (attribute.typeHelper.isNumeric() || attribute.typeHelper.isDuration()) {
        // Types that you can average
        // https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-avg
        // https://neo4j.com/docs/cypher-manual/current/functions/aggregating/#functions-avg-duration
        // String uses avg(size())
        for (const operator of AGGREGATION_COMPARISON_OPERATORS) {
            fields[`${attribute.name}_MIN_${operator}`] = {
                type: attribute.getTypeName(),
                directives: deprecatedDirectives,
            };
            fields[`${attribute.name}_MAX_${operator}`] = {
                type: attribute.getTypeName(),
                directives: deprecatedDirectives,
            };
            if (attribute.getTypeName() !== "Duration") {
                fields[`${attribute.name}_SUM_${operator}`] = {
                    type: attribute.getTypeName(),
                    directives: deprecatedDirectives,
                };
            }
            const averageType = attribute.typeHelper.isBigInt()
                ? "BigInt"
                : attribute.typeHelper.isDuration()
                  ? "Duration"
                  : GraphQLFloat;
            fields[`${attribute.name}_AVERAGE_${operator}`] = { type: averageType, directives: deprecatedDirectives };
        }
        return fields;
    }
    for (const operator of AGGREGATION_COMPARISON_OPERATORS) {
        // TODO: REMOVE ID FIELD ON 7.x
        if (attribute.typeHelper.isID()) {
            fields[`${attribute.name}_MIN_${operator}`] = {
                type: attribute.getTypeName(),
                directives: deprecatedDirectives.length ? deprecatedDirectives : [DEPRECATE_ID_AGGREGATION],
            };
            fields[`${attribute.name}_MAX_${operator}`] = {
                type: attribute.getTypeName(),
                directives: deprecatedDirectives.length ? deprecatedDirectives : [DEPRECATE_ID_AGGREGATION],
            };
            continue;
        }

        fields[`${attribute.name}_MIN_${operator}`] = {
            type: attribute.getTypeName(),
            directives: deprecatedDirectives,
        };
        fields[`${attribute.name}_MAX_${operator}`] = {
            type: attribute.getTypeName(),
            directives: deprecatedDirectives,
        };
    }
    return fields;
}
