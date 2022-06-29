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

import { Neo4jGraphQLAuthJWTPlugin } from "@neo4j/graphql-plugin-auth";
import { gql } from "apollo-server";
import { generate } from "randomstring";
import { Neo4jGraphQL } from "../../../../src";
import { formatCypher, translateQuery } from "../../utils/tck-test-utils";
import { createJwtRequest } from "../../../utils/create-jwt-request";

describe("Cypher -> fulltext -> Auth", () => {
    test("simple match with auth where", async () => {
        const typeDefs = gql`
            type Movie
                @fulltext(indexes: [{ name: "MovieTitle", fields: ["title"] }])
                @auth(rules: [{ where: { director: { id: "$jwt.sub" } } }]) {
                title: String
                director: [Person!]! @relationship(type: "DIRECTED", direction: IN)
            }

            type Person {
                id: ID
            }
        `;

        const secret = "shh-its-a-secret";

        const sub = generate({
            readable: true,
            charset: "alphabetic",
        });

        const neoSchema = new Neo4jGraphQL({
            typeDefs,
            plugins: {
                auth: new Neo4jGraphQLAuthJWTPlugin({
                    secret,
                }),
            },
        });

        const query = gql`
            query {
                movies(fulltext: { MovieTitle: { phrase: "something AND something" } }) {
                    title
                }
            }
        `;

        const req = createJwtRequest(secret, { sub });

        const result = await translateQuery(neoSchema, query, { req });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "CALL db.index.fulltext.queryNodes(
                \\"MovieTitle\\",
                $this_fulltext_MovieTitle_phrase
            ) YIELD node as this
            WHERE \\"Movie\\" IN labels(this) AND exists((this)<-[:DIRECTED]-(:Person)) AND all(director IN [(this)<-[:DIRECTED]-(director:Person) | director] WHERE director.id IS NOT NULL AND director.id = $this_auth_where0_director_id)
            RETURN this { .title } as this"
        `);

        expect(result.params).toMatchObject({
            this_fulltext_MovieTitle_phrase: "something AND something",
            this_auth_where0_director_id: sub,
        });
    });

    test("simple match with auth allow", async () => {
        const typeDefs = gql`
            type Movie
                @fulltext(indexes: [{ name: "MovieTitle", fields: ["title"] }])
                @auth(rules: [{ allow: { director: { id: "$jwt.sub" } } }]) {
                title: String
                director: [Person!]! @relationship(type: "DIRECTED", direction: IN)
            }

            type Person {
                id: ID
            }
        `;

        const secret = "shh-its-a-secret";

        const sub = generate({
            readable: true,
            charset: "alphabetic",
        });

        const neoSchema = new Neo4jGraphQL({
            typeDefs,
            plugins: {
                auth: new Neo4jGraphQLAuthJWTPlugin({
                    secret,
                }),
            },
        });

        const query = gql`
            query {
                movies(fulltext: { MovieTitle: { phrase: "something AND something" } }) {
                    title
                }
            }
        `;

        const req = createJwtRequest(secret, { sub });

        const result = await translateQuery(neoSchema, query, { req });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "CALL db.index.fulltext.queryNodes(
                \\"MovieTitle\\",
                $this_fulltext_MovieTitle_phrase
            ) YIELD node as this
            WHERE \\"Movie\\" IN labels(this)
            CALL apoc.util.validate(NOT (exists((this)<-[:DIRECTED]-(:Person)) AND any(director IN [(this)<-[:DIRECTED]-(director:Person) | director] WHERE director.id IS NOT NULL AND director.id = $this_auth_allow0_director_id)), \\"@neo4j/graphql/FORBIDDEN\\", [0])
            RETURN this { .title } as this"
        `);

        expect(result.params).toMatchObject({
            this_fulltext_MovieTitle_phrase: "something AND something",
            this_auth_allow0_director_id: sub,
        });
    });
});
