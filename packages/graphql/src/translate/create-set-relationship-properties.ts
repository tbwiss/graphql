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

import { CallbackBucket } from "../classes/CallbackBucket";
import { Relationship } from "../classes";
import mapToDbProperty from "../utils/map-to-db-property";
import { addCallbackAndSetParam } from "./utils/callback-utils";
import { matchMathField, mathDescriptorBuilder, buildMathStatements } from "./utils/math";

/*
    TODO - lets reuse this function for setting either node or rel properties.
           This was not reused due to the large differences between node fields
           - and relationship fields.
*/
function createSetRelationshipProperties({
    properties,
    varName,
    withVars,
    relationship,
    operation,
    callbackBucket,
    parameterPrefix,
}: {
    properties: Record<string, unknown>;
    varName: string;
    withVars: string[];
    relationship: Relationship;
    operation: "CREATE" | "UPDATE";
    callbackBucket: CallbackBucket;
    parameterPrefix: string;
}): string {
    const strs: string[] = [];

    relationship.primitiveFields.forEach((primitiveField) => {
        if (primitiveField?.autogenerate) {
            if (operation === "CREATE") {
                strs.push(`SET ${varName}.${primitiveField.dbPropertyName} = randomUUID()`);
            }
        }
    });

    relationship.temporalFields.forEach((temporalField) => {
        if (
            ["DateTime", "Time"].includes(temporalField.typeMeta.name) &&
            temporalField?.timestamps?.includes(operation)
        ) {
            // DateTime -> datetime(); Time -> time()
            strs.push(
                `SET ${varName}.${temporalField.dbPropertyName} = ${temporalField.typeMeta.name.toLowerCase()}()`
            );
        }
    });

    relationship.primitiveFields.forEach((field) =>
        addCallbackAndSetParam(field, varName, properties, callbackBucket, strs, operation)
    );

    Object.entries(properties).forEach(([key, value], _idx, propertiesEntries) => {
        const paramName = `${parameterPrefix}.${key}`;

        const pointField = relationship.pointFields.find((x) => x.fieldName === key);
        if (pointField) {
            if (pointField.typeMeta.array) {
                strs.push(`SET ${varName}.${pointField.dbPropertyName} = [p in $${paramName} | point(p)]`);
            } else {
                strs.push(`SET ${varName}.${pointField.dbPropertyName} = point($${paramName})`);
            }

            return;
        }

        const mathMatch = matchMathField(key);
        const { hasMatched } = mathMatch;
        if (hasMatched) {
            const mathDescriptor = mathDescriptorBuilder(value as number, relationship, mathMatch);
            if (propertiesEntries.find(([entryKey]) => entryKey === mathDescriptor.dbName)) {
                throw new Error(`Ambiguous property: ${mathDescriptor.dbName}`);
            }

            const mathStatements = buildMathStatements(mathDescriptor, varName, withVars, paramName);
            strs.push(...mathStatements);
            return;
        }

        const dbFieldName = mapToDbProperty(relationship, key);
        strs.push(`SET ${varName}.${dbFieldName} = $${paramName}`);
    });

    return strs.join("\n");
}

export default createSetRelationshipProperties;
