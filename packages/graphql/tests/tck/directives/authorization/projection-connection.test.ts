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
            type Post @node {
                content: String
                creator: User! @relationship(type: "HAS_POST", direction: IN)
            }

            type User @node {
                id: ID
                name: String
                posts: [Post!]! @relationship(type: "HAS_POST", direction: OUT)
            }

            extend type User @authorization(validate: [{ when: BEFORE, where: { node: { id_EQ: "$jwt.sub" } } }])
            extend type Post
                @authorization(validate: [{ when: BEFORE, where: { node: { creator: { id_EQ: "$jwt.sub" } } } }])
        `;

        neoSchema = new Neo4jGraphQL({
            typeDefs,
            features: {
                authorization: {
                    key: secret,
                },
            },
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
            "MATCH (this:User)
            WITH *
            WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0])
            CALL {
                WITH this
                MATCH (this)-[this0:HAS_POST]->(this1:Post)
                OPTIONAL MATCH (this1)<-[:HAS_POST]-(this2:User)
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

    test("Two connection", async () => {
        const query = /* GraphQL */ `
            {
                users {
                    name
                    postsConnection {
                        edges {
                            node {
                                content
                                creatorConnection {
                                    edges {
                                        node {
                                            name
                                        }
                                    }
                                }
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
            "MATCH (this:User)
            WITH *
            WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0])
            CALL {
                WITH this
                MATCH (this)-[this0:HAS_POST]->(this1:Post)
                OPTIONAL MATCH (this1)<-[:HAS_POST]-(this2:User)
                WITH *, count(this2) AS var3
                WITH *
                WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND (var3 <> 0 AND ($jwt.sub IS NOT NULL AND this2.id = $jwt.sub))), \\"@neo4j/graphql/FORBIDDEN\\", [0])
                WITH collect({ node: this1, relationship: this0 }) AS edges
                WITH edges, size(edges) AS totalCount
                CALL {
                    WITH edges
                    UNWIND edges AS edge
                    WITH edge.node AS this1, edge.relationship AS this0
                    CALL {
                        WITH this1
                        MATCH (this1)<-[this4:HAS_POST]-(this5:User)
                        WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this5.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0])
                        WITH collect({ node: this5, relationship: this4 }) AS edges
                        WITH edges, size(edges) AS totalCount
                        CALL {
                            WITH edges
                            UNWIND edges AS edge
                            WITH edge.node AS this5, edge.relationship AS this4
                            RETURN collect({ node: { name: this5.name, __resolveType: \\"User\\" } }) AS var6
                        }
                        RETURN { edges: var6, totalCount: totalCount } AS var7
                    }
                    RETURN collect({ node: { content: this1.content, creatorConnection: var7, __resolveType: \\"Post\\" } }) AS var8
                }
                RETURN { edges: var8, totalCount: totalCount } AS var9
            }
            RETURN this { .name, postsConnection: var9 } AS this"
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

describe("Cypher Auth Projection On top-level connections", () => {
    const secret = "secret";
    let typeDefs: string;
    let neoSchema: Neo4jGraphQL;

    beforeAll(() => {
        typeDefs = /* GraphQL */ `
            type Post @node {
                content: String
                creator: User! @relationship(type: "HAS_POST", direction: IN)
            }

            type User @node {
                id: ID
                name: String
                posts: [Post!]! @relationship(type: "HAS_POST", direction: OUT)
            }

            extend type User @authorization(validate: [{ when: BEFORE, where: { node: { id_EQ: "$jwt.sub" } } }])
            extend type Post
                @authorization(validate: [{ when: BEFORE, where: { node: { creator: { id_EQ: "$jwt.sub" } } } }])
        `;

        neoSchema = new Neo4jGraphQL({
            typeDefs,
            features: {
                authorization: {
                    key: secret,
                },
            },
        });
    });

    test("One connection", async () => {
        const query = /* GraphQL */ `
            {
                usersConnection {
                    edges {
                        node {
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
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "super_admin" });
        const result = await translateQuery(neoSchema, query, {
            token,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this0:User)
            WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this0.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0])
            WITH collect({ node: this0 }) AS edges
            WITH edges, size(edges) AS totalCount
            CALL {
                WITH edges
                UNWIND edges AS edge
                WITH edge.node AS this0
                CALL {
                    WITH this0
                    MATCH (this0)-[this1:HAS_POST]->(this2:Post)
                    OPTIONAL MATCH (this2)<-[:HAS_POST]-(this3:User)
                    WITH *, count(this3) AS var4
                    WITH *
                    WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND (var4 <> 0 AND ($jwt.sub IS NOT NULL AND this3.id = $jwt.sub))), \\"@neo4j/graphql/FORBIDDEN\\", [0])
                    WITH collect({ node: this2, relationship: this1 }) AS edges
                    WITH edges, size(edges) AS totalCount
                    CALL {
                        WITH edges
                        UNWIND edges AS edge
                        WITH edge.node AS this2, edge.relationship AS this1
                        RETURN collect({ node: { content: this2.content, __resolveType: \\"Post\\" } }) AS var5
                    }
                    RETURN { edges: var5, totalCount: totalCount } AS var6
                }
                RETURN collect({ node: { name: this0.name, postsConnection: var6, __resolveType: \\"User\\" } }) AS var7
            }
            RETURN { edges: var7, totalCount: totalCount } AS this"
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

    test("Two connection", async () => {
        const query = /* GraphQL */ `
            {
                usersConnection {
                    edges {
                        node {
                            name
                            postsConnection {
                                edges {
                                    node {
                                        content
                                        creatorConnection {
                                            edges {
                                                node {
                                                    name
                                                }
                                            }
                                        }
                                    }
                                }
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
            "MATCH (this0:User)
            WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this0.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0])
            WITH collect({ node: this0 }) AS edges
            WITH edges, size(edges) AS totalCount
            CALL {
                WITH edges
                UNWIND edges AS edge
                WITH edge.node AS this0
                CALL {
                    WITH this0
                    MATCH (this0)-[this1:HAS_POST]->(this2:Post)
                    OPTIONAL MATCH (this2)<-[:HAS_POST]-(this3:User)
                    WITH *, count(this3) AS var4
                    WITH *
                    WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND (var4 <> 0 AND ($jwt.sub IS NOT NULL AND this3.id = $jwt.sub))), \\"@neo4j/graphql/FORBIDDEN\\", [0])
                    WITH collect({ node: this2, relationship: this1 }) AS edges
                    WITH edges, size(edges) AS totalCount
                    CALL {
                        WITH edges
                        UNWIND edges AS edge
                        WITH edge.node AS this2, edge.relationship AS this1
                        CALL {
                            WITH this2
                            MATCH (this2)<-[this5:HAS_POST]-(this6:User)
                            WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this6.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0])
                            WITH collect({ node: this6, relationship: this5 }) AS edges
                            WITH edges, size(edges) AS totalCount
                            CALL {
                                WITH edges
                                UNWIND edges AS edge
                                WITH edge.node AS this6, edge.relationship AS this5
                                RETURN collect({ node: { name: this6.name, __resolveType: \\"User\\" } }) AS var7
                            }
                            RETURN { edges: var7, totalCount: totalCount } AS var8
                        }
                        RETURN collect({ node: { content: this2.content, creatorConnection: var8, __resolveType: \\"Post\\" } }) AS var9
                    }
                    RETURN { edges: var9, totalCount: totalCount } AS var10
                }
                RETURN collect({ node: { name: this0.name, postsConnection: var10, __resolveType: \\"User\\" } }) AS var11
            }
            RETURN { edges: var11, totalCount: totalCount } AS this"
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
