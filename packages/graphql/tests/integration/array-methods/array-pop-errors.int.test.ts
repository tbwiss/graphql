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

import { GraphQLError } from "graphql";
import { gql } from "graphql-tag";
import { IncomingMessage } from "http";
import { Socket } from "net";
import { generate } from "randomstring";
import { TestHelper } from "../../utils/tests-helper";

describe("array-pop-errors", () => {
    const testHelper = new TestHelper();

    beforeEach(() => {});

    afterEach(async () => {
        await testHelper.close();
    });

    test("should throw an error when trying to pop an element from a non-existing array", async () => {
        const typeMovie = testHelper.createUniqueType("Movie");

        const typeDefs = gql`
            type ${typeMovie} @node {
                title: String
                tags: [String]
            }
        `;

        await testHelper.initNeo4jGraphQL({ typeDefs });

        const movieTitle = generate({
            charset: "alphabetic",
        });

        const update = `
            mutation {
                ${typeMovie.operations.update} (update: { tags_POP: 1 }) {
                    ${typeMovie.plural} {
                        title
                        tags
                    }
                }
            }
        `;

        // Created deliberately without the tags property.
        const cypher = `
            CREATE (m:${typeMovie} {title:$movieTitle})
        `;

        await testHelper.executeCypher(cypher, { movieTitle });

        const gqlResult = await testHelper.executeGraphQL(update);

        expect(gqlResult.errors).toBeDefined();
        expect(
            (gqlResult.errors as GraphQLError[]).some((el) => el.message.includes("Property tags cannot be NULL"))
        ).toBeTruthy();

        expect(gqlResult.data).toBeNull();
    });

    test("should throw an error when trying to pop an element from multiple non-existing arrays", async () => {
        const typeMovie = testHelper.createUniqueType("Movie");

        const typeDefs = gql`
            type ${typeMovie} @node {
                title: String
                tags: [String]
                otherTags: [String]
            }
        `;

        await testHelper.initNeo4jGraphQL({ typeDefs });

        const movieTitle = generate({
            charset: "alphabetic",
        });

        const update = `
            mutation {
                ${typeMovie.operations.update} (update: { tags_POP: 1, otherTags_POP: 1 }) {
                    ${typeMovie.plural} {
                        title
                        tags
                        otherTags
                    }
                }
            }
        `;

        // Created deliberately without the tags or otherTags properties.
        const cypher = `
            CREATE (m:${typeMovie} {title:$movieTitle})
        `;

        await testHelper.executeCypher(cypher, { movieTitle });

        const gqlResult = await testHelper.executeGraphQL(update);

        expect(gqlResult.errors).toBeDefined();
        expect(
            (gqlResult.errors as GraphQLError[]).some((el) =>
                el.message.includes("Properties tags, otherTags cannot be NULL")
            )
        ).toBeTruthy();

        expect(gqlResult.data).toBeNull();
    });

    test("should throw an error if not authenticated on field definition", async () => {
        const typeMovie = testHelper.createUniqueType("Movie");
        const typeDefs = `
            type ${typeMovie} @node {
                title: String
                tags: [String] @authentication(operations: [UPDATE])
            }
        `;

        await testHelper.initNeo4jGraphQL({
            typeDefs,
            features: { authorization: { key: "secret" } },
        });

        const movieTitle = generate({
            charset: "alphabetic",
        });

        const update = `
            mutation {
                ${typeMovie.operations.update} (update: { tags_POP: 1 }) {
                    ${typeMovie.plural} {
                        title
                        tags
                    }
                }
            }
        `;

        const cypher = `
            CREATE (m:${typeMovie} {title:$movieTitle, tags: ['a', 'b']})
        `;

        await testHelper.executeCypher(cypher, { movieTitle });

        const token = "not valid token";

        const socket = new Socket({ readable: true });
        const req = new IncomingMessage(socket);
        req.headers.authorization = `Bearer ${token}`;

        const gqlResult = await testHelper.executeGraphQL(update);

        expect(gqlResult.errors).toBeDefined();
        expect((gqlResult.errors as GraphQLError[]).some((el) => el.message.includes("Unauthenticated"))).toBeTruthy();
        expect(gqlResult.data).toBeNull();
    });

    test("should throw an error when input is invalid", async () => {
        const typeMovie = testHelper.createUniqueType("Movie");

        const typeDefs = gql`
            type ${typeMovie} @node {
                title: String
                tags: [String]
            }
        `;

        await testHelper.initNeo4jGraphQL({ typeDefs });

        const movieTitle = generate({
            charset: "alphabetic",
        });

        const update = `
            mutation {
                ${typeMovie.operations.update} (update: { tags_POP: a }) {
                    ${typeMovie.plural} {
                        title
                        tags
                    }
                }
            }
        `;

        const cypher = `
            CREATE (m:${typeMovie} {title:$movieTitle, tags: ["abc", "xyz"]})
        `;

        await testHelper.executeCypher(cypher, { movieTitle });

        const gqlResult = await testHelper.executeGraphQL(update);

        expect(gqlResult.errors).toBeDefined();
        expect(
            (gqlResult.errors as GraphQLError[]).some((el) =>
                el.message.includes("Int cannot represent non-integer value")
            )
        ).toBeTruthy();

        expect(gqlResult.data).toBeUndefined();
    });

    test("should throw an error when performing an ambiguous property update", async () => {
        const typeMovie = testHelper.createUniqueType("Movie");

        const typeDefs = gql`
            type ${typeMovie} @node {
                title: String
                tags: [String]
            }
        `;

        await testHelper.initNeo4jGraphQL({ typeDefs });

        const movieTitle = generate({
            charset: "alphabetic",
        });

        const update = /* GraphQL */ `
            mutation {
                ${typeMovie.operations.update} (update: { tags_POP: 1, tags_SET: [] }) {
                    ${typeMovie.plural} {
                        title
                        tags
                    }
                }
            }
        `;

        const cypher = `
            CREATE (m:${typeMovie} {title:$movieTitle, tags:["existing value"]})
        `;

        await testHelper.executeCypher(cypher, { movieTitle });

        const gqlResult = await testHelper.executeGraphQL(update);

        expect(gqlResult.errors).toEqual([
            new GraphQLError(`Conflicting modification of [[tags_SET]], [[tags_POP]] on type ${typeMovie}`),
        ]);

        expect(gqlResult.data).toBeNull();
    });

    test("should throw an error when performing an ambiguous property update on relationship properties", async () => {
        const initialPay = 100;
        const movie = testHelper.createUniqueType("Movie");
        const actor = testHelper.createUniqueType("Actor");
        const typeDefs = `
            type ${movie.name} @node {
                title: String
                actors: [${actor.name}!]! @relationship(type: "ACTED_IN", properties: "ActedIn", direction: IN)
            }
            
            type ${actor.name} @node {
                id: ID!
                name: String!
                actedIn: [${movie.name}!]! @relationship(type: "ACTED_IN", properties: "ActedIn", direction: OUT)
            }

            type ActedIn @relationshipProperties {
                pay: [Float]
            }
        `;

        await testHelper.initNeo4jGraphQL({ typeDefs });

        const id = generate({
            charset: "alphabetic",
        });

        const query = /* GraphQL */ `
            mutation Mutation($id: ID, $numberToPop: Int) {
                ${actor.operations.update}(where: { id_EQ: $id }, update: {
                    actedIn: [
                        {
                            update: {
                                edge: {
                                    pay_SET: [],
                                    pay_POP: $numberToPop
                                }
                            }
                        }
                    ]
                }) {
                    ${actor.plural} {
                        name
                        actedIn {
                            title
                        }
                        actedInConnection {
                            edges {
                               properties {
                                 pay
                                }
                            }
                        }
                    }
                }
            }
        `;

        // Create new movie
        await testHelper.executeCypher(
            `
                CREATE (a:${movie.name} {title: "The Matrix"}), (b:${actor.name} {id: $id, name: "Keanu"}) WITH a,b CREATE (a)<-[actedIn: ACTED_IN{ pay: $initialPay }]-(b) RETURN a, actedIn, b
                `,
            {
                id,
                initialPay: [initialPay],
            }
        );
        // Update movie
        const gqlResult = await testHelper.executeGraphQL(query, {
            variableValues: { id, numberToPop: 1 },
        });

        expect(gqlResult.errors).toBeDefined();

        const relationshipType = `${movie.name}ActorsRelationship`;
        expect(gqlResult.errors).toEqual([
            new GraphQLError(`Conflicting modification of [[pay_SET]], [[pay_POP]] on type ${relationshipType}`),
        ]);
        expect(gqlResult.data).toBeNull();
    });
});
