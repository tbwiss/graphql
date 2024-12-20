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

import { Neo4jGraphQL } from "../../../src";
import { formatCypher, formatParams, translateQuery } from "../utils/tck-test-utils";

describe("https://github.com/neo4j/graphql/issues/505", () => {
    let typeDefs: string;
    let neoSchema: Neo4jGraphQL;

    beforeAll(() => {
        typeDefs = /* GraphQL */ `
            type User @node {
                id: ID!
                authId: String
                workspaces: [Workspace!]! @relationship(type: "MEMBER_OF", direction: OUT)
                adminOf: [Workspace!]! @relationship(type: "HAS_ADMIN", direction: IN)
                createdPages: [Page!]! @relationship(type: "CREATED_PAGE", direction: OUT)
            }

            type Workspace
                @node
                @authorization(
                    filter: [
                        {
                            operations: [READ]
                            where: {
                                OR: [
                                    { node: { members_SOME: { authId_EQ: "$jwt.sub" } } }
                                    { node: { admins_SOME: { authId_EQ: "$jwt.sub" } } }
                                ]
                            }
                        }
                    ]
                )
                @mutation(operations: [DELETE]) {
                id: ID!
                name: String!
                members: [User!]! @relationship(type: "MEMBER_OF", direction: IN)
                admins: [User!]! @relationship(type: "HAS_ADMIN", direction: OUT)
                pages: [Page!]! @relationship(type: "HAS_PAGE", direction: OUT)
            }

            type Page
                @node
                @authorization(
                    filter: [
                        {
                            operations: [READ]
                            where: {
                                node: {
                                    OR: [
                                        { owner: { authId_EQ: "$jwt.sub" } }
                                        {
                                            AND: [
                                                { shared_EQ: true }
                                                {
                                                    workspace: {
                                                        OR: [
                                                            { members_SOME: { authId_EQ: "$jwt.sub" } }
                                                            { admins_SOME: { authId_EQ: "$jwt.sub" } }
                                                        ]
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                ) {
                id: ID!

                shared: Boolean! @default(value: false)

                owner: User! @relationship(type: "CREATED_PAGE", direction: IN)

                workspace: Workspace! @relationship(type: "HAS_PAGE", direction: IN)
            }
        `;

        neoSchema = new Neo4jGraphQL({
            typeDefs,
            features: { authorization: { key: "secret" } },
        });
    });

    test("Users query", async () => {
        const query = /* GraphQL */ `
            query Users {
                users(where: { id_EQ: "my-user-id" }) {
                    id
                    authId
                    createdPages {
                        id
                    }
                }
            }
        `;

        const result = await translateQuery(neoSchema, query);

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:User)
            WHERE this.id = $param0
            CALL {
                WITH this
                MATCH (this)-[this0:CREATED_PAGE]->(this1:Page)
                OPTIONAL MATCH (this1)<-[:CREATED_PAGE]-(this2:User)
                WITH *, count(this2) AS var3
                OPTIONAL MATCH (this1)<-[:HAS_PAGE]-(this4:Workspace)
                WITH *, count(this4) AS var5
                WITH *
                WHERE ($isAuthenticated = true AND ((var3 <> 0 AND ($jwt.sub IS NOT NULL AND this2.authId = $jwt.sub)) OR (($param3 IS NOT NULL AND this1.shared = $param3) AND (var5 <> 0 AND (size([(this4)<-[:MEMBER_OF]-(this6:User) WHERE ($jwt.sub IS NOT NULL AND this6.authId = $jwt.sub) | 1]) > 0 OR size([(this4)-[:HAS_ADMIN]->(this7:User) WHERE ($jwt.sub IS NOT NULL AND this7.authId = $jwt.sub) | 1]) > 0)))))
                WITH this1 { .id } AS this1
                RETURN collect(this1) AS var8
            }
            RETURN this { .id, .authId, createdPages: var8 } AS this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"param0\\": \\"my-user-id\\",
                \\"isAuthenticated\\": false,
                \\"jwt\\": {},
                \\"param3\\": true
            }"
        `);
    });

    test("Workspaces query", async () => {
        const query = /* GraphQL */ `
            query Workspaces {
                workspaces(where: { id_EQ: "my-workspace-id" }) {
                    id
                    pages {
                        id
                    }
                }
            }
        `;

        const result = await translateQuery(neoSchema, query);

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Workspace)
            WITH *
            WHERE (this.id = $param0 AND ($isAuthenticated = true AND (size([(this)<-[:MEMBER_OF]-(this0:User) WHERE ($jwt.sub IS NOT NULL AND this0.authId = $jwt.sub) | 1]) > 0 OR size([(this)-[:HAS_ADMIN]->(this1:User) WHERE ($jwt.sub IS NOT NULL AND this1.authId = $jwt.sub) | 1]) > 0)))
            CALL {
                WITH this
                MATCH (this)-[this2:HAS_PAGE]->(this3:Page)
                OPTIONAL MATCH (this3)<-[:CREATED_PAGE]-(this4:User)
                WITH *, count(this4) AS var5
                OPTIONAL MATCH (this3)<-[:HAS_PAGE]-(this6:Workspace)
                WITH *, count(this6) AS var7
                WITH *
                WHERE ($isAuthenticated = true AND ((var5 <> 0 AND ($jwt.sub IS NOT NULL AND this4.authId = $jwt.sub)) OR (($param3 IS NOT NULL AND this3.shared = $param3) AND (var7 <> 0 AND (size([(this6)<-[:MEMBER_OF]-(this8:User) WHERE ($jwt.sub IS NOT NULL AND this8.authId = $jwt.sub) | 1]) > 0 OR size([(this6)-[:HAS_ADMIN]->(this9:User) WHERE ($jwt.sub IS NOT NULL AND this9.authId = $jwt.sub) | 1]) > 0)))))
                WITH this3 { .id } AS this3
                RETURN collect(this3) AS var10
            }
            RETURN this { .id, pages: var10 } AS this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"param0\\": \\"my-workspace-id\\",
                \\"isAuthenticated\\": false,
                \\"jwt\\": {},
                \\"param3\\": true
            }"
        `);
    });

    test("Pages query", async () => {
        const query = /* GraphQL */ `
            query Pages {
                pages(where: { workspace: { id_EQ: "my-workspace-id" } }) {
                    id
                }
            }
        `;

        const result = await translateQuery(neoSchema, query);

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Page)
            OPTIONAL MATCH (this)<-[:HAS_PAGE]-(this0:Workspace)
            WITH *, count(this0) AS var1
            OPTIONAL MATCH (this)<-[:CREATED_PAGE]-(this2:User)
            WITH *, count(this2) AS var3
            OPTIONAL MATCH (this)<-[:HAS_PAGE]-(this4:Workspace)
            WITH *, count(this4) AS var5
            WITH *
            WHERE ((var1 <> 0 AND this0.id = $param0) AND ($isAuthenticated = true AND ((var3 <> 0 AND ($jwt.sub IS NOT NULL AND this2.authId = $jwt.sub)) OR (($param3 IS NOT NULL AND this.shared = $param3) AND (var5 <> 0 AND (size([(this4)<-[:MEMBER_OF]-(this6:User) WHERE ($jwt.sub IS NOT NULL AND this6.authId = $jwt.sub) | 1]) > 0 OR size([(this4)-[:HAS_ADMIN]->(this7:User) WHERE ($jwt.sub IS NOT NULL AND this7.authId = $jwt.sub) | 1]) > 0))))))
            RETURN this { .id } AS this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"param0\\": \\"my-workspace-id\\",
                \\"isAuthenticated\\": false,
                \\"jwt\\": {},
                \\"param3\\": true
            }"
        `);
    });

    test("All pages query", async () => {
        const query = /* GraphQL */ `
            query allPages {
                pages {
                    id
                }
            }
        `;

        const result = await translateQuery(neoSchema, query);

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Page)
            OPTIONAL MATCH (this)<-[:CREATED_PAGE]-(this0:User)
            WITH *, count(this0) AS var1
            OPTIONAL MATCH (this)<-[:HAS_PAGE]-(this2:Workspace)
            WITH *, count(this2) AS var3
            WITH *
            WHERE ($isAuthenticated = true AND ((var1 <> 0 AND ($jwt.sub IS NOT NULL AND this0.authId = $jwt.sub)) OR (($param2 IS NOT NULL AND this.shared = $param2) AND (var3 <> 0 AND (size([(this2)<-[:MEMBER_OF]-(this4:User) WHERE ($jwt.sub IS NOT NULL AND this4.authId = $jwt.sub) | 1]) > 0 OR size([(this2)-[:HAS_ADMIN]->(this5:User) WHERE ($jwt.sub IS NOT NULL AND this5.authId = $jwt.sub) | 1]) > 0)))))
            RETURN this { .id } AS this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"isAuthenticated\\": false,
                \\"jwt\\": {},
                \\"param2\\": true
            }"
        `);
    });
});
