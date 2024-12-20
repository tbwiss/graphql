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

import { Neo4jGraphQL } from "../../../../src";
import { createBearerToken } from "../../../utils/create-bearer-token";
import { formatCypher, formatParams, translateQuery } from "../../utils/tck-test-utils";

describe("Cypher Auth Projection On Connections", () => {
    const secret = "secret";
    let typeDefs: string;
    let neoSchema: Neo4jGraphQL;

    beforeAll(() => {
        typeDefs = /* GraphQL */ `
            type Post @node(labels: ["Comment"]) {
                content: String
                creator: User! @relationship(type: "HAS_POST", direction: IN)
            }

            type User @node(labels: ["Person"]) {
                id: ID
                name: String
                posts: [Post!]! @relationship(type: "HAS_POST", direction: OUT)
            }

            extend type User @authorization(validate: [{ when: [BEFORE], where: { node: { id_EQ: "$jwt.sub" } } }])
            extend type Post
                @authorization(validate: [{ when: [BEFORE], where: { node: { creator: { id_EQ: "$jwt.sub" } } } }])
        `;

        neoSchema = new Neo4jGraphQL({
            typeDefs,
            features: { authorization: { key: secret } },
        });
    });

    test("One connection", async () => {
        const query = /* GraphQL */ `
            {
                users {
                    name
                    postsConnection {
                        edges {
                            node {
                                content
                            }
                        }
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "super_admin" });
        const result = await translateQuery(neoSchema, query, {
            token,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Person)
            WITH *
            WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0])
            CALL {
                WITH this
                MATCH (this)-[this0:HAS_POST]->(this1:Comment)
                OPTIONAL MATCH (this1)<-[:HAS_POST]-(this2:Person)
                WITH *, count(this2) AS var3
                WITH *
                WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND (var3 <> 0 AND ($jwt.sub IS NOT NULL AND this2.id = $jwt.sub))), \\"@neo4j/graphql/FORBIDDEN\\", [0])
                WITH collect({ node: this1, relationship: this0 }) AS edges
                WITH edges, size(edges) AS totalCount
                CALL {
                    WITH edges
                    UNWIND edges AS edge
                    WITH edge.node AS this1, edge.relationship AS this0
                    RETURN collect({ node: { content: this1.content, __resolveType: \\"Post\\" } }) AS var4
                }
                RETURN { edges: var4, totalCount: totalCount } AS var5
            }
            RETURN this { .name, postsConnection: var5 } AS this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"isAuthenticated\\": true,
                \\"jwt\\": {
                    \\"roles\\": [],
                    \\"sub\\": \\"super_admin\\"
                }
            }"
        `);
    });
});
