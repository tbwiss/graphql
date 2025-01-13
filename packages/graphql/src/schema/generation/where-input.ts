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
import { GraphQLID } from "graphql";
import type {
    Directive,
    InputTypeComposer,
    InputTypeComposerFieldConfigMapDefinition,
    SchemaComposer,
} from "graphql-compose";
import type { EntityAdapter } from "../../schema-model/entity/EntityAdapter";
import { ConcreteEntityAdapter } from "../../schema-model/entity/model-adapters/ConcreteEntityAdapter";
import { InterfaceEntityAdapter } from "../../schema-model/entity/model-adapters/InterfaceEntityAdapter";
import { UnionEntityAdapter } from "../../schema-model/entity/model-adapters/UnionEntityAdapter";
import { RelationshipAdapter } from "../../schema-model/relationship/model-adapters/RelationshipAdapter";
import type { RelationshipDeclarationAdapter } from "../../schema-model/relationship/model-adapters/RelationshipDeclarationAdapter";
import type { Neo4jFeaturesSettings } from "../../types";
import { DEPRECATE_IMPLICIT_EQUAL_FILTERS, DEPRECATE_TYPENAME_IN } from "../constants";
import { getWhereFieldsForAttributes } from "../get-where-fields";
import { withAggregateInputType } from "./aggregate-types";
import {
    augmentWhereInputTypeWithConnectionFields,
    augmentWhereInputTypeWithRelationshipFields,
} from "./augment-where-input";
import { shouldAddDeprecatedFields } from "./utils";

function isEmptyObject(obj: Record<string, unknown>): boolean {
    return !Object.keys(obj).length;
}

export function withUniqueWhereInputType({
    concreteEntityAdapter,
    composer,
    features,
}: {
    concreteEntityAdapter: ConcreteEntityAdapter;
    composer: SchemaComposer;
    features?: Neo4jFeaturesSettings;
}): InputTypeComposer {
    const uniqueWhereFields: InputTypeComposerFieldConfigMapDefinition = {};
    for (const attribute of concreteEntityAdapter.uniqueFields) {
        if (shouldAddDeprecatedFields(features, "implicitEqualFilters")) {
            uniqueWhereFields[attribute.name] = {
                type: attribute.getFieldTypeName(),
                directives: [DEPRECATE_IMPLICIT_EQUAL_FILTERS],
            };
        }
        uniqueWhereFields[`${attribute.name}_EQ`] = {
            type: attribute.getFieldTypeName(),
        };
    }

    const uniqueWhereInputType = composer.createInputTC({
        name: concreteEntityAdapter.operations.uniqueWhereInputTypeName,
        fields: uniqueWhereFields,
    });
    return uniqueWhereInputType;
}

export function addLogicalOperatorsToWhereInputType(type: InputTypeComposer): void {
    type.addFields({
        OR: type.NonNull.List,
        AND: type.NonNull.List,
        NOT: type,
    });
}

export function withWhereInputType({
    entityAdapter,
    userDefinedFieldDirectives,
    features,
    composer,
    typeName = entityAdapter.operations.whereInputTypeName,
    returnUndefinedIfEmpty = false,
    alwaysAllowNesting,
    ignoreCypherFieldFilters = false,
}: {
    entityAdapter: EntityAdapter | RelationshipAdapter;
    typeName?: string;
    userDefinedFieldDirectives?: Map<string, DirectiveNode[]>;
    features: Neo4jFeaturesSettings | undefined;
    composer: SchemaComposer;
    interfaceOnTypeName?: string;
    returnUndefinedIfEmpty?: boolean;
    alwaysAllowNesting?: boolean;
    ignoreCypherFieldFilters?: boolean;
}): InputTypeComposer | undefined {
    if (composer.has(typeName)) {
        return composer.getITC(typeName);
    }
    const whereFields = makeWhereFields({
        entityAdapter,
        userDefinedFieldDirectives,
        features,
        ignoreCypherFieldFilters,
    });
    if (returnUndefinedIfEmpty && isEmptyObject(whereFields)) {
        return undefined;
    }
    const whereInputType = composer.createInputTC({
        name: typeName,
        fields: whereFields,
    });

    const allowNesting =
        alwaysAllowNesting ||
        entityAdapter instanceof ConcreteEntityAdapter ||
        entityAdapter instanceof RelationshipAdapter ||
        entityAdapter instanceof InterfaceEntityAdapter;

    if (allowNesting) {
        addLogicalOperatorsToWhereInputType(whereInputType);
    }
    if (entityAdapter instanceof ConcreteEntityAdapter && entityAdapter.isGlobalNode()) {
        whereInputType.addFields({ id: GraphQLID });
    }
    if (entityAdapter instanceof InterfaceEntityAdapter) {
        const enumValues = Object.fromEntries(
            entityAdapter.concreteEntities.map((concreteEntity) => [
                concreteEntity.name,
                { value: concreteEntity.name },
            ])
        );
        if (entityAdapter.concreteEntities.length > 0) {
            const interfaceImplementation = composer.createEnumTC({
                name: entityAdapter.operations.implementationEnumTypename,
                values: enumValues,
            });
            if (shouldAddDeprecatedFields(features, "typename_IN")) {
                whereInputType.addFields({
                    typename_IN: { type: interfaceImplementation.NonNull.List, directives: [DEPRECATE_TYPENAME_IN] },
                });
            }

            whereInputType.addFields({ typename: { type: interfaceImplementation.NonNull.List } });
        }
    }
    return whereInputType;
}

function makeWhereFields({
    entityAdapter,
    userDefinedFieldDirectives,
    features,
    ignoreCypherFieldFilters,
}: {
    entityAdapter: EntityAdapter | RelationshipAdapter;
    userDefinedFieldDirectives?: Map<string, DirectiveNode[]>;
    features: Neo4jFeaturesSettings | undefined;
    ignoreCypherFieldFilters: boolean;
}): InputTypeComposerFieldConfigMapDefinition {
    if (entityAdapter instanceof UnionEntityAdapter) {
        const fields: InputTypeComposerFieldConfigMapDefinition = {};
        for (const concreteEntity of entityAdapter.concreteEntities) {
            fields[concreteEntity.name] = concreteEntity.operations.whereInputTypeName;
        }
        return fields;
    }

    return getWhereFieldsForAttributes({
        attributes: entityAdapter.whereFields,
        userDefinedFieldDirectives,
        features,
        ignoreCypherFieldFilters,
    });
}

export function withSourceWhereInputType({
    relationshipAdapter,
    composer,
    deprecatedDirectives,
    userDefinedDirectivesOnTargetFields,
    features,
}: {
    relationshipAdapter: RelationshipAdapter | RelationshipDeclarationAdapter;
    composer: SchemaComposer;
    deprecatedDirectives: Directive[];
    userDefinedDirectivesOnTargetFields: Map<string, DirectiveNode[]> | undefined;
    features: Neo4jFeaturesSettings | undefined;
}): InputTypeComposer | undefined {
    const relationshipTarget = relationshipAdapter.target;
    const relationshipSource = relationshipAdapter.source;
    const whereInput = composer.getITC(relationshipSource.operations.whereInputTypeName);
    const fields = augmentWhereInputTypeWithRelationshipFields(relationshipAdapter, deprecatedDirectives);
    whereInput.addFields(fields);

    const connectionFields = augmentWhereInputTypeWithConnectionFields(relationshipAdapter, deprecatedDirectives);
    whereInput.addFields(connectionFields);

    // TODO: Current unions are not supported as relationship targets beyond the above fields
    if (relationshipTarget instanceof UnionEntityAdapter) {
        return;
    }

    const whereAggregateInput = withAggregateInputType({
        relationshipAdapter,
        entityAdapter: relationshipTarget,
        composer: composer,
        userDefinedDirectivesOnTargetFields,
        features,
    });

    if (relationshipAdapter.isFilterableByAggregate()) {
        whereInput.addFields({
            [relationshipAdapter.operations.aggregateTypeName]: {
                type: whereAggregateInput,
                directives: deprecatedDirectives,
            },
        });
    }

    return whereInput;
}

export function withConnectWhereFieldInputType(
    relationshipTarget: ConcreteEntityAdapter | InterfaceEntityAdapter,
    composer: SchemaComposer
): InputTypeComposer {
    const connectWhereName = relationshipTarget.operations.connectWhereInputTypeName;
    if (composer.has(connectWhereName)) {
        return composer.getITC(connectWhereName);
    }
    const connectWhereType = composer.createInputTC({
        name: connectWhereName,
        fields: { node: `${relationshipTarget.operations.whereInputTypeName}!` },
    });

    return connectWhereType;
}
