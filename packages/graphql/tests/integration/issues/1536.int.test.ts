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

import { graphql, GraphQLSchema } from "graphql";
import { Driver } from "neo4j-driver";
import neo4j from "../neo4j";
import { Neo4jGraphQL } from "../../../src";
import { generateUniqueType } from "../../utils/graphql-types";

describe("https://github.com/neo4j/graphql/issues/1536", () => {
    const testSomeNode = generateUniqueType("SomeNode");
    const testOtherNode = generateUniqueType("OtherNode");
    const testMyImplementation = generateUniqueType("MyImplementation");

    let schema: GraphQLSchema;
    let driver: Driver;

    async function graphqlQuery(query: string) {
        return graphql({
            schema,
            source: query,
            contextValue: {
                driver,
            },
        });
    }

    beforeAll(async () => {
        driver = await neo4j();

        const typeDefs = `
            type ${testSomeNode} {
                id: ID! @id
                other: ${testOtherNode}! @relationship(type: "HAS_OTHER_NODES", direction: OUT)
            }

            type ${testOtherNode} {
                id: ID! @id
                interfaceField: MyInterface! @relationship(type: "HAS_INTERFACE_NODES", direction: OUT)
            }

            interface MyInterface {
                id: ID! @id
            }

            type ${testMyImplementation} implements MyInterface {
                id: ID! @id
            }
        `;
        // const typeDefs = `
        // type  ${testSomeNode} {
        //     id: ID! @id
        //     other: OtherInterface! @relationship(type: "HAS_OTHER_NODES", direction: OUT)
        // }

        // interface OtherInterface {
        //     id: ID! @id
        //     interfaceField: MyInterface! @relationship(type: "HAS_INTERFACE_NODES", direction: OUT)
        // }

        // type ${testOtherNode} implements OtherInterface {
        //     id: ID! @id
        //     interfaceField: MyInterface! @relationship(type: "HAS_INTERFACE_NODES", direction: OUT)
        // }

        // interface MyInterface {
        //     id: ID! @id
        // }

        // type ${testMyImplementation} implements MyInterface {
        //     id: ID! @id
        // }
        // `;

        const session = driver.session();

        await session.run(`
            CREATE (:${testSomeNode} { id: "12" })-[:HAS_OTHER_NODES]->(:${testOtherNode} { id: "212" })-[:HAS_INTERFACE_NODES]->(:${testMyImplementation} { id: "3212" })
        `);

        const neoGraphql = new Neo4jGraphQL({ typeDefs, driver });
        schema = await neoGraphql.getSchema();
    });

    afterAll(async () => {
        await driver.close();
    });

    test("should not throw error when querying nested interface implementation", async () => {
        const query = `
            query {
                ${testSomeNode.plural} {
                    id
                    other {
                      id
                      interfaceField {
                        id
                      }
                    }
                  }
            }
        `;

        const queryResult = await graphqlQuery(query);
        expect(queryResult.errors).toBeUndefined();

        expect(queryResult.data as any).toEqual({
            [`${testSomeNode.plural}`]: [
                {
                    id: "12",
                    other: {
                        id: "212",
                        interfaceField: {
                            id: "3212",
                        },
                    },
                },
            ],
        });
    });
});
