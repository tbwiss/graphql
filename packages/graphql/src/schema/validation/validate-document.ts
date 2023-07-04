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

import { GraphQLSchema, extendSchema, validateSchema, specifiedDirectives, Kind } from "graphql";
import type {
    DefinitionNode,
    DocumentNode,
    ObjectTypeDefinitionNode,
    InputValueDefinitionNode,
    FieldDefinitionNode,
    TypeNode,
    GraphQLDirective,
    GraphQLNamedType,
} from "graphql";
import pluralize from "pluralize";
import * as scalars from "../../graphql/scalars";
import * as directives from "../../graphql/directives";
import { SortDirection } from "../../graphql/enums/SortDirection";
import { Point } from "../../graphql/objects/Point";
import { CartesianPoint } from "../../graphql/objects/CartesianPoint";
import { PointInput } from "../../graphql/input-objects/PointInput";
import { CartesianPointInput } from "../../graphql/input-objects/CartesianPointInput";
import { PointDistance } from "../../graphql/input-objects/PointDistance";
import { CartesianPointDistance } from "../../graphql/input-objects/CartesianPointDistance";
import { RESERVED_TYPE_NAMES } from "../../constants";
import { isRootType } from "../../utils/is-root-type";
import { validateSchemaCustomizations } from "./validate-schema-customizations";
import type { ValidationConfig } from "../../classes/Neo4jGraphQL";
import { defaultValidationConfig } from "../../classes/Neo4jGraphQL";
import type { Neo4jFeaturesSettings } from "../../types";
import { validateSDL } from "./validate-sdl";
import { specifiedSDLRules } from "graphql/validation/specifiedRules";
import { DirectiveArgumentOfCorrectType } from "./custom-rules/directive-argument-of-correct-type";

function filterDocument(document: DocumentNode, features: Neo4jFeaturesSettings | undefined): DocumentNode {
    const nodeNames = document.definitions
        .filter((definition) => {
            if (
                definition.kind === "ObjectTypeDefinition" ||
                definition.kind === "ScalarTypeDefinition" ||
                definition.kind === "InterfaceTypeDefinition" ||
                definition.kind === "UnionTypeDefinition" ||
                definition.kind === "EnumTypeDefinition" ||
                definition.kind === "InputObjectTypeDefinition"
            ) {
                RESERVED_TYPE_NAMES.forEach((reservedName) => {
                    if (reservedName.regex.test(definition.name.value)) {
                        throw new Error(reservedName.error);
                    }
                });
            }

            if (definition.kind === "ObjectTypeDefinition") {
                if (!isRootType(definition)) {
                    return true;
                }
            }
            return false;
        })
        .map((definition) => (definition as ObjectTypeDefinitionNode).name.value);

    const getArgumentType = (type: TypeNode): string => {
        if (type.kind === Kind.LIST_TYPE) {
            return getArgumentType(type.type);
        }

        if (type.kind === Kind.NON_NULL_TYPE) {
            return getArgumentType(type.type);
        }

        return type.name.value;
    };

    const filterInputTypes = (
        fields: readonly InputValueDefinitionNode[] | undefined
    ): InputValueDefinitionNode[] | undefined => {
        return fields?.filter((f) => {
            const type = getArgumentType(f.type);

            const nodeMatch =
                /(?<nodeName>.+)(?:ConnectInput|ConnectWhere|CreateInput|DeleteInput|DisconnectInput|Options|RelationInput|Sort|UpdateInput|Where)/gm.exec(
                    type
                );
            if (nodeMatch?.groups?.nodeName) {
                if (nodeNames.includes(nodeMatch.groups.nodeName)) {
                    return false;
                }
            }

            return true;
        });
    };

    const filterFields = (
        fields: readonly FieldDefinitionNode[] | undefined,
        features: Neo4jFeaturesSettings | undefined
    ): FieldDefinitionNode[] | undefined => {
        return fields
            ?.filter((field) => {
                const type = getArgumentType(field.type);
                const match = /(?:Create|Update)(?<nodeName>.+)MutationResponse/gm.exec(type);
                if (match?.groups?.nodeName) {
                    if (nodeNames.map((nodeName) => pluralize(nodeName)).includes(match.groups.nodeName)) {
                        return false;
                    }
                }
                return true;
            })
            .map((field) => {
                if (
                    field.directives?.some((directive) =>
                        ["authentication", "authorization"].includes(directive.name.value)
                    ) &&
                    !features?.authorization
                ) {
                    console.warn(
                        "@authentication and/or @authorization detected - please ensure that you either specify authorization settings in features.authorization, or pass a decoded JWT into context.jwt on each request"
                    );
                }

                return {
                    ...field,
                    arguments: filterInputTypes(field.arguments),
                    directives: field.directives?.filter(
                        (directive) => !["auth", "authentication", "authorization"].includes(directive.name.value)
                    ),
                };
            });
    };

    return {
        ...document,
        definitions: document.definitions.reduce((res: DefinitionNode[], def) => {
            if (def.kind === "InputObjectTypeDefinition") {
                const fields = filterInputTypes(def.fields);

                if (!fields?.length) {
                    return res;
                }

                return [
                    ...res,
                    {
                        ...def,
                        fields,
                    },
                ];
            }

            if (def.kind === "ObjectTypeDefinition" || def.kind === "InterfaceTypeDefinition") {
                const fields = filterFields(def.fields, features);

                if (!fields?.length) {
                    return res;
                }

                if (
                    def.directives?.some((x) => ["authentication", "authorization"].includes(x.name.value)) &&
                    !features?.authorization
                ) {
                    console.warn(
                        "@authentication and/or @authorization detected - please ensure that you either specify authorization settings in features.authorization, or pass a decoded JWT into context.jwt on each request"
                    );
                }

                return [
                    ...res,
                    {
                        ...def,
                        directives: def.directives?.filter(
                            (x) => !["auth", "authentication", "authorization"].includes(x.name.value)
                        ),
                        fields,
                    },
                ];
            }

            if (def.kind === "SchemaExtension") {
                if (
                    def.directives?.some((x) => ["authentication"].includes(x.name.value)) &&
                    !features?.authorization
                ) {
                    console.warn(
                        "@authentication and/or @authorization detected - please ensure that you either specify authorization settings in features.authorization, or pass a decoded JWT into context.jwt on each request"
                    );
                }

                return [
                    ...res,
                    {
                        ...def,
                        directives: def.directives?.filter((x) => !["authentication"].includes(x.name.value)),
                    },
                ];
            }

            return [...res, def];
        }, []),
    };
}

function getBaseSchema({
    document,
    validateTypeDefs = true,
    features,
    additionalDirectives = [],
    additionalTypes = [],
}: {
    document: DocumentNode;
    validateTypeDefs: boolean;
    features: Neo4jFeaturesSettings | undefined;
    additionalDirectives: Array<GraphQLDirective>;
    additionalTypes: Array<GraphQLNamedType>;
}): GraphQLSchema {
    const doc = filterDocument(document, features);

    const schemaToExtend = new GraphQLSchema({
        directives: [...Object.values(directives), ...specifiedDirectives, ...additionalDirectives],
        types: [
            ...Object.values(scalars),
            Point,
            CartesianPoint,
            PointInput,
            PointDistance,
            CartesianPointInput,
            CartesianPointDistance,
            SortDirection,
            ...additionalTypes,
        ],
    });

    // ==================== for rules testing ====
    const errors = validateSDL(doc, [...specifiedSDLRules, DirectiveArgumentOfCorrectType], schemaToExtend);
    const filteredErrors = errors.filter((e) => e.message !== "Query root type must be provided.");
    if (filteredErrors.length) {
        console.log("Validate Document: END with ERRORS");
        throw new Error(filteredErrors.join("\n"));
    }
    // ===========================================
    return extendSchema(schemaToExtend, doc, { assumeValid: !validateTypeDefs });
}

function validateDocument({
    document,
    validationConfig = defaultValidationConfig,
    features,
    additionalDirectives = [],
    additionalTypes = [],
}: {
    document: DocumentNode;
    validationConfig?: ValidationConfig;
    features?: Neo4jFeaturesSettings | undefined;
    additionalDirectives?: Array<GraphQLDirective>;
    additionalTypes?: Array<GraphQLNamedType>;
}): void {
    const schema = getBaseSchema({
        document,
        features,
        validateTypeDefs: validationConfig.validateTypeDefs,
        additionalDirectives,
        additionalTypes,
    });
    if (validationConfig.validateTypeDefs) {
        const errors = validateSchema(schema);
        const filteredErrors = errors.filter((e) => e.message !== "Query root type must be provided.");
        if (filteredErrors.length) {
            throw new Error(filteredErrors.join("\n"));
        }
    }
    validateSchemaCustomizations({ document, schema, validationConfig });
}

export default validateDocument;
