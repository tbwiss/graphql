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

import { Neo4jGraphQL } from "../../../../../../src";
import { createBearerToken } from "../../../../../utils/create-bearer-token";
import { formatCypher, formatParams, translateQuery } from "../../../../utils/tck-test-utils";

describe("Cypher Auth Allow", () => {
    const secret = "secret";
    let typeDefs: string;
    let neoSchema: Neo4jGraphQL;

    beforeAll(() => {
        typeDefs = /* GraphQL */ `
            type Comment @node {
                id: ID
                content: String
                creator: User! @relationship(type: "HAS_COMMENT", direction: IN)
                post: Post! @relationship(type: "HAS_COMMENT", direction: IN)
            }

            type Post @node {
                id: ID
                content: String
                creator: User! @relationship(type: "HAS_POST", direction: IN)
                comments: [Comment!]! @relationship(type: "HAS_COMMENT", direction: OUT)
            }

            type User @node {
                id: ID
                name: String
                posts: [Post!]! @relationship(type: "HAS_POST", direction: OUT)
            }

            extend type User
                @authorization(
                    validate: [
                        {
                            operations: [READ, UPDATE, DELETE, DELETE_RELATIONSHIP, CREATE_RELATIONSHIP]
                            when: BEFORE
                            where: { node: { id_EQ: "$jwt.sub" } }
                        }
                    ]
                )

            extend type User {
                password: String!
                    @authorization(
                        validate: [
                            { operations: [READ, UPDATE, DELETE], when: BEFORE, where: { node: { id_EQ: "$jwt.sub" } } }
                        ]
                    )
            }

            extend type Post
                @authorization(
                    validate: [
                        {
                            operations: [READ, UPDATE, DELETE, DELETE_RELATIONSHIP, CREATE_RELATIONSHIP]
                            when: BEFORE
                            where: { node: { creator: { id_EQ: "$jwt.sub" } } }
                        }
                    ]
                )

            extend type Comment
                @authorization(
                    validate: [
                        {
                            operations: [READ, UPDATE, DELETE, DELETE_RELATIONSHIP, CREATE_RELATIONSHIP]
                            when: BEFORE
                            where: { node: { creator: { id_EQ: "$jwt.sub" } } }
                        }
                    ]
                )
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

    test("Read Node", async () => {
        const query = /* GraphQL */ `
            {
                users {
                    id
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, {
            token,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:User)
            WITH *
            WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0])
            RETURN this { .id } AS this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"isAuthenticated\\": true,
                \\"jwt\\": {
                    \\"roles\\": [
                        \\"admin\\"
                    ],
                    \\"sub\\": \\"id-01\\"
                }
            }"
        `);
    });

    test("Read Node & Protected Field", async () => {
        const query = /* GraphQL */ `
            {
                users {
                    password
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, {
            token,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:User)
            WITH *
            WHERE (apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0]) AND apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0]))
            RETURN this { .password } AS this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"isAuthenticated\\": true,
                \\"jwt\\": {
                    \\"roles\\": [
                        \\"admin\\"
                    ],
                    \\"sub\\": \\"id-01\\"
                }
            }"
        `);
    });

    test("Read Relationship", async () => {
        const query = /* GraphQL */ `
            {
                users {
                    id
                    posts {
                        content
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
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
                WITH this1 { .content } AS this1
                RETURN collect(this1) AS var4
            }
            RETURN this { .id, posts: var4 } AS this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"isAuthenticated\\": true,
                \\"jwt\\": {
                    \\"roles\\": [
                        \\"admin\\"
                    ],
                    \\"sub\\": \\"id-01\\"
                }
            }"
        `);
    });

    test("Read Relationship & Protected Field", async () => {
        const query = /* GraphQL */ `
            {
                posts {
                    creator {
                        password
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, {
            token,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            OPTIONAL MATCH (this)<-[:HAS_POST]-(this0:User)
            WITH *, count(this0) AS var1
            WITH *
            WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND (var1 <> 0 AND ($jwt.sub IS NOT NULL AND this0.id = $jwt.sub))), \\"@neo4j/graphql/FORBIDDEN\\", [0])
            CALL {
                WITH this
                MATCH (this)<-[this2:HAS_POST]-(this3:User)
                WITH *
                WHERE (apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this3.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0]) AND apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this3.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0]))
                WITH this3 { .password } AS this3
                RETURN head(collect(this3)) AS var4
            }
            RETURN this { creator: var4 } AS this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"isAuthenticated\\": true,
                \\"jwt\\": {
                    \\"roles\\": [
                        \\"admin\\"
                    ],
                    \\"sub\\": \\"id-01\\"
                }
            }"
        `);
    });

    test("Read Two Relationships", async () => {
        const query = /* GraphQL */ `
            {
                users(where: { id_EQ: "1" }) {
                    id
                    posts(where: { id_EQ: "1" }) {
                        comments(where: { id_EQ: "1" }) {
                            content
                        }
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, {
            token,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:User)
            WITH *
            WHERE (this.id = $param0 AND apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0]))
            CALL {
                WITH this
                MATCH (this)-[this0:HAS_POST]->(this1:Post)
                OPTIONAL MATCH (this1)<-[:HAS_POST]-(this2:User)
                WITH *, count(this2) AS var3
                WITH *
                WHERE (this1.id = $param3 AND apoc.util.validatePredicate(NOT ($isAuthenticated = true AND (var3 <> 0 AND ($jwt.sub IS NOT NULL AND this2.id = $jwt.sub))), \\"@neo4j/graphql/FORBIDDEN\\", [0]))
                CALL {
                    WITH this1
                    MATCH (this1)-[this4:HAS_COMMENT]->(this5:Comment)
                    OPTIONAL MATCH (this5)<-[:HAS_COMMENT]-(this6:User)
                    WITH *, count(this6) AS var7
                    WITH *
                    WHERE (this5.id = $param4 AND apoc.util.validatePredicate(NOT ($isAuthenticated = true AND (var7 <> 0 AND ($jwt.sub IS NOT NULL AND this6.id = $jwt.sub))), \\"@neo4j/graphql/FORBIDDEN\\", [0]))
                    WITH this5 { .content } AS this5
                    RETURN collect(this5) AS var8
                }
                WITH this1 { comments: var8 } AS this1
                RETURN collect(this1) AS var9
            }
            RETURN this { .id, posts: var9 } AS this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"param0\\": \\"1\\",
                \\"isAuthenticated\\": true,
                \\"jwt\\": {
                    \\"roles\\": [
                        \\"admin\\"
                    ],
                    \\"sub\\": \\"id-01\\"
                },
                \\"param3\\": \\"1\\",
                \\"param4\\": \\"1\\"
            }"
        `);
    });

    test("Update Node", async () => {
        const query = /* GraphQL */ `
            mutation {
                updateUsers(where: { id_EQ: "old-id" }, update: { id_SET: "new-id" }) {
                    users {
                        id
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "old-id", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, {
            token,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:User)
            WITH *
            WHERE (this.id = $param0 AND apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0]))
            SET this.id = $this_update_id_SET
            WITH *
            WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0])
            RETURN collect(DISTINCT this { .id }) AS data"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"isAuthenticated\\": true,
                \\"jwt\\": {
                    \\"roles\\": [
                        \\"admin\\"
                    ],
                    \\"sub\\": \\"old-id\\"
                },
                \\"param0\\": \\"old-id\\",
                \\"this_update_id_SET\\": \\"new-id\\",
                \\"resolvedCallbacks\\": {}
            }"
        `);
    });

    test("Update Node Property", async () => {
        const query = /* GraphQL */ `
            mutation {
                updateUsers(where: { id_EQ: "id-01" }, update: { password_SET: "new-password" }) {
                    users {
                        id
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, {
            token,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:User)
            WITH *
            WHERE (this.id = $param0 AND apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0]))
            WITH this
            WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0])
            SET this.password = $this_update_password_SET
            WITH *
            WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0])
            RETURN collect(DISTINCT this { .id }) AS data"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"isAuthenticated\\": true,
                \\"jwt\\": {
                    \\"roles\\": [
                        \\"admin\\"
                    ],
                    \\"sub\\": \\"id-01\\"
                },
                \\"param0\\": \\"id-01\\",
                \\"this_update_password_SET\\": \\"new-password\\",
                \\"resolvedCallbacks\\": {}
            }"
        `);
    });

    test("Nested Update Node", async () => {
        const query = /* GraphQL */ `
            mutation {
                updatePosts(
                    where: { id_EQ: "post-id" }
                    update: { creator: { update: { node: { id_SET: "new-id" } } } }
                ) {
                    posts {
                        id
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "user-id", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, {
            token,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            OPTIONAL MATCH (this)<-[:HAS_POST]-(this0:User)
            WITH *, count(this0) AS var1
            WITH *
            WHERE (this.id = $param0 AND apoc.util.validatePredicate(NOT ($isAuthenticated = true AND (var1 <> 0 AND ($jwt.sub IS NOT NULL AND this0.id = $jwt.sub))), \\"@neo4j/graphql/FORBIDDEN\\", [0]))
            WITH this
            CALL {
            	WITH this
            	MATCH (this)<-[this_has_post0_relationship:HAS_POST]-(this_creator0:User)
            	WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this_creator0.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0])
            	SET this_creator0.id = $this_update_creator0_id_SET
            	RETURN count(*) AS update_this_creator0
            }
            WITH *
            CALL {
            	WITH this
            	MATCH (this)<-[this_creator_User_unique:HAS_POST]-(:User)
            	WITH count(this_creator_User_unique) as c
            	WHERE apoc.util.validatePredicate(NOT (c = 1), '@neo4j/graphql/RELATIONSHIP-REQUIREDPost.creator required exactly once', [0])
            	RETURN c AS this_creator_User_unique_ignored
            }
            OPTIONAL MATCH (this)<-[:HAS_POST]-(update_this0:User)
            WITH *, count(update_this0) AS update_var1
            WITH *
            WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND (update_var1 <> 0 AND ($jwt.sub IS NOT NULL AND update_this0.id = $jwt.sub))), \\"@neo4j/graphql/FORBIDDEN\\", [0])
            RETURN collect(DISTINCT this { .id }) AS data"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"isAuthenticated\\": true,
                \\"jwt\\": {
                    \\"roles\\": [
                        \\"admin\\"
                    ],
                    \\"sub\\": \\"user-id\\"
                },
                \\"param0\\": \\"post-id\\",
                \\"this_update_creator0_id_SET\\": \\"new-id\\",
                \\"resolvedCallbacks\\": {}
            }"
        `);
    });

    test("Nested Update Property", async () => {
        const query = /* GraphQL */ `
            mutation {
                updatePosts(
                    where: { id_EQ: "post-id" }
                    update: { creator: { update: { node: { password_SET: "new-password" } } } }
                ) {
                    posts {
                        id
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "user-id", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, {
            token,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            OPTIONAL MATCH (this)<-[:HAS_POST]-(this0:User)
            WITH *, count(this0) AS var1
            WITH *
            WHERE (this.id = $param0 AND apoc.util.validatePredicate(NOT ($isAuthenticated = true AND (var1 <> 0 AND ($jwt.sub IS NOT NULL AND this0.id = $jwt.sub))), \\"@neo4j/graphql/FORBIDDEN\\", [0]))
            WITH this
            CALL {
            	WITH this
            	MATCH (this)<-[this_has_post0_relationship:HAS_POST]-(this_creator0:User)
            	WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this_creator0.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0])
            	WITH this, this_creator0
            	WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this_creator0.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0])
            	SET this_creator0.password = $this_update_creator0_password_SET
            	RETURN count(*) AS update_this_creator0
            }
            WITH *
            CALL {
            	WITH this
            	MATCH (this)<-[this_creator_User_unique:HAS_POST]-(:User)
            	WITH count(this_creator_User_unique) as c
            	WHERE apoc.util.validatePredicate(NOT (c = 1), '@neo4j/graphql/RELATIONSHIP-REQUIREDPost.creator required exactly once', [0])
            	RETURN c AS this_creator_User_unique_ignored
            }
            OPTIONAL MATCH (this)<-[:HAS_POST]-(update_this0:User)
            WITH *, count(update_this0) AS update_var1
            WITH *
            WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND (update_var1 <> 0 AND ($jwt.sub IS NOT NULL AND update_this0.id = $jwt.sub))), \\"@neo4j/graphql/FORBIDDEN\\", [0])
            RETURN collect(DISTINCT this { .id }) AS data"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"isAuthenticated\\": true,
                \\"jwt\\": {
                    \\"roles\\": [
                        \\"admin\\"
                    ],
                    \\"sub\\": \\"user-id\\"
                },
                \\"param0\\": \\"post-id\\",
                \\"this_update_creator0_password_SET\\": \\"new-password\\",
                \\"resolvedCallbacks\\": {}
            }"
        `);
    });

    test("Delete Node", async () => {
        const query = /* GraphQL */ `
            mutation {
                deleteUsers(where: { id_EQ: "user-id" }) {
                    nodesDeleted
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "user-id", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, {
            token,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:User)
            WHERE (this.id = $param0 AND apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0]))
            DETACH DELETE this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"param0\\": \\"user-id\\",
                \\"isAuthenticated\\": true,
                \\"jwt\\": {
                    \\"roles\\": [
                        \\"admin\\"
                    ],
                    \\"sub\\": \\"user-id\\"
                }
            }"
        `);
    });

    test("Nested Delete Node", async () => {
        const query = /* GraphQL */ `
            mutation {
                deleteUsers(where: { id_EQ: "user-id" }, delete: { posts: { where: { node: { id_EQ: "post-id" } } } }) {
                    nodesDeleted
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "user-id", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, {
            token,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:User)
            WHERE (this.id = $param0 AND apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0]))
            WITH *
            CALL {
                WITH *
                OPTIONAL MATCH (this)-[this0:HAS_POST]->(this1:Post)
                OPTIONAL MATCH (this1)<-[:HAS_POST]-(this2:User)
                WITH *, count(this2) AS var3
                WHERE (this1.id = $param3 AND apoc.util.validatePredicate(NOT ($isAuthenticated = true AND (var3 <> 0 AND ($jwt.sub IS NOT NULL AND this2.id = $jwt.sub))), \\"@neo4j/graphql/FORBIDDEN\\", [0]))
                WITH this0, collect(DISTINCT this1) AS var4
                CALL {
                    WITH var4
                    UNWIND var4 AS var5
                    DETACH DELETE var5
                }
            }
            WITH *
            DETACH DELETE this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"param0\\": \\"user-id\\",
                \\"isAuthenticated\\": true,
                \\"jwt\\": {
                    \\"roles\\": [
                        \\"admin\\"
                    ],
                    \\"sub\\": \\"user-id\\"
                },
                \\"param3\\": \\"post-id\\"
            }"
        `);
    });

    test("Disconnect Node", async () => {
        const query = /* GraphQL */ `
            mutation {
                updateUsers(
                    where: { id_EQ: "user-id" }
                    update: { posts: { disconnect: { where: { node: { id_EQ: "post-id" } } } } }
                ) {
                    users {
                        id
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "user-id", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, {
            token,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:User)
            WITH *
            WHERE (this.id = $param0 AND apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0]))
            WITH this
            CALL {
            WITH this
            OPTIONAL MATCH (this)-[this_posts0_disconnect0_rel:HAS_POST]->(this_posts0_disconnect0:Post)
            OPTIONAL MATCH (this_posts0_disconnect0)<-[:HAS_POST]-(authorization__before_this1:User)
            WITH *, count(authorization__before_this1) AS authorization__before_var0
            WITH *
            WHERE this_posts0_disconnect0.id = $updateUsers_args_update_posts0_disconnect0_where_Post_this_posts0_disconnect0param0 AND (apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0]) AND apoc.util.validatePredicate(NOT ($isAuthenticated = true AND (authorization__before_var0 <> 0 AND ($jwt.sub IS NOT NULL AND authorization__before_this1.id = $jwt.sub))), \\"@neo4j/graphql/FORBIDDEN\\", [0]))
            CALL {
            	WITH this_posts0_disconnect0, this_posts0_disconnect0_rel, this
            	WITH collect(this_posts0_disconnect0) as this_posts0_disconnect0, this_posts0_disconnect0_rel, this
            	UNWIND this_posts0_disconnect0 as x
            	DELETE this_posts0_disconnect0_rel
            }
            RETURN count(*) AS disconnect_this_posts0_disconnect_Post
            }
            WITH *
            WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0])
            RETURN collect(DISTINCT this { .id }) AS data"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"isAuthenticated\\": true,
                \\"jwt\\": {
                    \\"roles\\": [
                        \\"admin\\"
                    ],
                    \\"sub\\": \\"user-id\\"
                },
                \\"param0\\": \\"user-id\\",
                \\"updateUsers_args_update_posts0_disconnect0_where_Post_this_posts0_disconnect0param0\\": \\"post-id\\",
                \\"updateUsers\\": {
                    \\"args\\": {
                        \\"update\\": {
                            \\"posts\\": [
                                {
                                    \\"disconnect\\": [
                                        {
                                            \\"where\\": {
                                                \\"node\\": {
                                                    \\"id_EQ\\": \\"post-id\\"
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                },
                \\"resolvedCallbacks\\": {}
            }"
        `);
    });

    test("Nested Disconnect Node", async () => {
        const query = /* GraphQL */ `
            mutation {
                updateComments(
                    where: { id_EQ: "comment-id" }
                    update: {
                        post: { disconnect: { disconnect: { creator: { where: { node: { id_EQ: "user-id" } } } } } }
                    }
                ) {
                    comments {
                        id
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "user-id", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, {
            token,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Comment)
            OPTIONAL MATCH (this)<-[:HAS_COMMENT]-(this0:User)
            WITH *, count(this0) AS var1
            WITH *
            WHERE (this.id = $param0 AND apoc.util.validatePredicate(NOT ($isAuthenticated = true AND (var1 <> 0 AND ($jwt.sub IS NOT NULL AND this0.id = $jwt.sub))), \\"@neo4j/graphql/FORBIDDEN\\", [0]))
            WITH this
            CALL {
            WITH this
            OPTIONAL MATCH (this)<-[this_post0_disconnect0_rel:HAS_COMMENT]-(this_post0_disconnect0:Post)
            OPTIONAL MATCH (this)<-[:HAS_COMMENT]-(authorization__before_this1:User)
            WITH *, count(authorization__before_this1) AS authorization__before_var0
            OPTIONAL MATCH (this_post0_disconnect0)<-[:HAS_POST]-(authorization__before_this3:User)
            WITH *, count(authorization__before_this3) AS authorization__before_var2
            WITH *
            WHERE (apoc.util.validatePredicate(NOT ($isAuthenticated = true AND (authorization__before_var0 <> 0 AND ($jwt.sub IS NOT NULL AND authorization__before_this1.id = $jwt.sub))), \\"@neo4j/graphql/FORBIDDEN\\", [0]) AND apoc.util.validatePredicate(NOT ($isAuthenticated = true AND (authorization__before_var2 <> 0 AND ($jwt.sub IS NOT NULL AND authorization__before_this3.id = $jwt.sub))), \\"@neo4j/graphql/FORBIDDEN\\", [0]))
            CALL {
            	WITH this_post0_disconnect0, this_post0_disconnect0_rel, this
            	WITH collect(this_post0_disconnect0) as this_post0_disconnect0, this_post0_disconnect0_rel, this
            	UNWIND this_post0_disconnect0 as x
            	DELETE this_post0_disconnect0_rel
            }
            CALL {
            WITH this, this_post0_disconnect0
            OPTIONAL MATCH (this_post0_disconnect0)<-[this_post0_disconnect0_creator0_rel:HAS_POST]-(this_post0_disconnect0_creator0:User)
            OPTIONAL MATCH (this_post0_disconnect0)<-[:HAS_POST]-(authorization__before_this1:User)
            WITH *, count(authorization__before_this1) AS authorization__before_var0
            WITH *
            WHERE this_post0_disconnect0_creator0.id = $updateComments_args_update_post_disconnect_disconnect_creator_where_User_this_post0_disconnect0_creator0param0 AND (apoc.util.validatePredicate(NOT ($isAuthenticated = true AND (authorization__before_var0 <> 0 AND ($jwt.sub IS NOT NULL AND authorization__before_this1.id = $jwt.sub))), \\"@neo4j/graphql/FORBIDDEN\\", [0]) AND apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this_post0_disconnect0_creator0.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0]))
            CALL {
            	WITH this_post0_disconnect0_creator0, this_post0_disconnect0_creator0_rel, this_post0_disconnect0
            	WITH collect(this_post0_disconnect0_creator0) as this_post0_disconnect0_creator0, this_post0_disconnect0_creator0_rel, this_post0_disconnect0
            	UNWIND this_post0_disconnect0_creator0 as x
            	DELETE this_post0_disconnect0_creator0_rel
            }
            RETURN count(*) AS disconnect_this_post0_disconnect0_creator_User
            }
            RETURN count(*) AS disconnect_this_post0_disconnect_Post
            }
            WITH *
            CALL {
            	WITH this
            	MATCH (this)<-[this_creator_User_unique:HAS_COMMENT]-(:User)
            	WITH count(this_creator_User_unique) as c
            	WHERE apoc.util.validatePredicate(NOT (c = 1), '@neo4j/graphql/RELATIONSHIP-REQUIREDComment.creator required exactly once', [0])
            	RETURN c AS this_creator_User_unique_ignored
            }
            CALL {
            	WITH this
            	MATCH (this)<-[this_post_Post_unique:HAS_COMMENT]-(:Post)
            	WITH count(this_post_Post_unique) as c
            	WHERE apoc.util.validatePredicate(NOT (c = 1), '@neo4j/graphql/RELATIONSHIP-REQUIREDComment.post required exactly once', [0])
            	RETURN c AS this_post_Post_unique_ignored
            }
            OPTIONAL MATCH (this)<-[:HAS_COMMENT]-(update_this0:User)
            WITH *, count(update_this0) AS update_var1
            WITH *
            WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND (update_var1 <> 0 AND ($jwt.sub IS NOT NULL AND update_this0.id = $jwt.sub))), \\"@neo4j/graphql/FORBIDDEN\\", [0])
            RETURN collect(DISTINCT this { .id }) AS data"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"isAuthenticated\\": true,
                \\"jwt\\": {
                    \\"roles\\": [
                        \\"admin\\"
                    ],
                    \\"sub\\": \\"user-id\\"
                },
                \\"param0\\": \\"comment-id\\",
                \\"updateComments_args_update_post_disconnect_disconnect_creator_where_User_this_post0_disconnect0_creator0param0\\": \\"user-id\\",
                \\"updateComments\\": {
                    \\"args\\": {
                        \\"update\\": {
                            \\"post\\": {
                                \\"disconnect\\": {
                                    \\"disconnect\\": {
                                        \\"creator\\": {
                                            \\"where\\": {
                                                \\"node\\": {
                                                    \\"id_EQ\\": \\"user-id\\"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                \\"resolvedCallbacks\\": {}
            }"
        `);
    });

    test("Connect Node", async () => {
        const query = /* GraphQL */ `
            mutation {
                updateUsers(
                    where: { id_EQ: "user-id" }
                    update: { posts: { connect: { where: { node: { id_EQ: "post-id" } } } } }
                ) {
                    users {
                        id
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "user-id", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, {
            token,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:User)
            WITH *
            WHERE (this.id = $param0 AND apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0]))
            WITH *
            CALL {
            	WITH this
            	OPTIONAL MATCH (this_posts0_connect0_node:Post)
            OPTIONAL MATCH (this_posts0_connect0_node)<-[:HAS_POST]-(authorization__before_this1:User)
            WITH *, count(authorization__before_this1) AS authorization__before_var0
            WITH *
            	WHERE this_posts0_connect0_node.id = $this_posts0_connect0_node_param0 AND (apoc.util.validatePredicate(NOT ($isAuthenticated = true AND (authorization__before_var0 <> 0 AND ($jwt.sub IS NOT NULL AND authorization__before_this1.id = $jwt.sub))), \\"@neo4j/graphql/FORBIDDEN\\", [0]) AND apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0]))
            	CALL {
            		WITH *
            		WITH collect(this_posts0_connect0_node) as connectedNodes, collect(this) as parentNodes
            		CALL {
            			WITH connectedNodes, parentNodes
            			UNWIND parentNodes as this
            			UNWIND connectedNodes as this_posts0_connect0_node
            			MERGE (this)-[:HAS_POST]->(this_posts0_connect0_node)
            		}
            	}
            WITH this, this_posts0_connect0_node
            	RETURN count(*) AS connect_this_posts0_connect_Post0
            }
            WITH *
            WHERE apoc.util.validatePredicate(NOT ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)), \\"@neo4j/graphql/FORBIDDEN\\", [0])
            RETURN collect(DISTINCT this { .id }) AS data"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"isAuthenticated\\": true,
                \\"jwt\\": {
                    \\"roles\\": [
                        \\"admin\\"
                    ],
                    \\"sub\\": \\"user-id\\"
                },
                \\"param0\\": \\"user-id\\",
                \\"this_posts0_connect0_node_param0\\": \\"post-id\\",
                \\"resolvedCallbacks\\": {}
            }"
        `);
    });
});
