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

import { Neo4jGraphQL } from "../../../../../../../src";
import { createBearerToken } from "../../../../../../utils/create-bearer-token";
import { formatCypher, formatParams, translateQuery } from "../../../../../utils/tck-test-utils";

describe("Cypher Auth Where", () => {
    const secret = "secret";
    let typeDefs: string;
    let neoSchema: Neo4jGraphQL;

    beforeAll(() => {
        typeDefs = /* GraphQL */ `
            interface Content {
                id: ID
                content: String
                creator: User! @declareRelationship
            }

            type User @node {
                id: ID
                name: String
                content: [Content!]! @relationship(type: "HAS_CONTENT", direction: OUT)
            }

            type Comment implements Content @node {
                id: ID
                content: String
                creator: User! @relationship(type: "HAS_CONTENT", direction: IN)
            }

            type Post implements Content
                @node
                @authorization(
                    filter: [
                        {
                            operations: [READ, UPDATE, DELETE, CREATE_RELATIONSHIP, DELETE_RELATIONSHIP]
                            where: { node: { creator: { id_EQ: "$jwt.sub" } } }
                        }
                    ]
                ) {
                id: ID
                content: String
                creator: User! @relationship(type: "HAS_CONTENT", direction: IN)
            }

            extend type User
                @authorization(
                    filter: [
                        {
                            operations: [READ, UPDATE, DELETE, CREATE_RELATIONSHIP, DELETE_RELATIONSHIP]
                            where: { node: { id_EQ: "$jwt.sub" } }
                        }
                    ]
                )

            extend type User {
                password: String!
                    @authorization(filter: [{ operations: [READ], where: { node: { id_EQ: "$jwt.sub" } } }])
            }

            extend type Post {
                secretKey: String!
                    @authorization(
                        filter: [{ operations: [READ], where: { node: { creator: { id_EQ: "$jwt.sub" } } } }]
                    )
            }
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
                posts {
                    id
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, { token });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            OPTIONAL MATCH (this)<-[:HAS_CONTENT]-(this0:User)
            WITH *, count(this0) AS var1
            WITH *
            WHERE ($isAuthenticated = true AND (var1 <> 0 AND ($jwt.sub IS NOT NULL AND this0.id = $jwt.sub)))
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

    test("Read Node + User Defined Where", async () => {
        const query = /* GraphQL */ `
            {
                posts(where: { content_EQ: "bob" }) {
                    id
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, { token });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            OPTIONAL MATCH (this)<-[:HAS_CONTENT]-(this0:User)
            WITH *, count(this0) AS var1
            WITH *
            WHERE (this.content = $param0 AND ($isAuthenticated = true AND (var1 <> 0 AND ($jwt.sub IS NOT NULL AND this0.id = $jwt.sub))))
            RETURN this { .id } AS this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"param0\\": \\"bob\\",
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

    test("Read interface relationship field", async () => {
        const query = /* GraphQL */ `
            {
                users {
                    id
                    content {
                        ... on Post {
                            id
                        }
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, { token });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:User)
            WITH *
            WHERE ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub))
            CALL {
                WITH this
                CALL {
                    WITH *
                    MATCH (this)-[this0:HAS_CONTENT]->(this1:Comment)
                    WITH this1 { __resolveType: \\"Comment\\", __id: id(this1) } AS this1
                    RETURN this1 AS var2
                    UNION
                    WITH *
                    MATCH (this)-[this3:HAS_CONTENT]->(this4:Post)
                    OPTIONAL MATCH (this4)<-[:HAS_CONTENT]-(this5:User)
                    WITH *, count(this5) AS var6
                    WITH *
                    WHERE ($isAuthenticated = true AND (var6 <> 0 AND ($jwt.sub IS NOT NULL AND this5.id = $jwt.sub)))
                    WITH this4 { .id, __resolveType: \\"Post\\", __id: id(this4) } AS this4
                    RETURN this4 AS var2
                }
                WITH var2
                RETURN collect(var2) AS var2
            }
            RETURN this { .id, content: var2 } AS this"
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

    test("Read interface relationship Using Connection", async () => {
        const query = /* GraphQL */ `
            {
                users {
                    id
                    contentConnection {
                        edges {
                            node {
                                ... on Post {
                                    id
                                }
                            }
                        }
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, { token });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:User)
            WITH *
            WHERE ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub))
            CALL {
                WITH this
                CALL {
                    WITH this
                    MATCH (this)-[this0:HAS_CONTENT]->(this1:Comment)
                    WITH { node: { __resolveType: \\"Comment\\", __id: id(this1) } } AS edge
                    RETURN edge
                    UNION
                    WITH this
                    MATCH (this)-[this2:HAS_CONTENT]->(this3:Post)
                    OPTIONAL MATCH (this3)<-[:HAS_CONTENT]-(this4:User)
                    WITH *, count(this4) AS var5
                    WITH *
                    WHERE ($isAuthenticated = true AND (var5 <> 0 AND ($jwt.sub IS NOT NULL AND this4.id = $jwt.sub)))
                    WITH { node: { __resolveType: \\"Post\\", __id: id(this3), id: this3.id } } AS edge
                    RETURN edge
                }
                WITH collect(edge) AS edges
                WITH edges, size(edges) AS totalCount
                RETURN { edges: edges, totalCount: totalCount } AS var6
            }
            RETURN this { .id, contentConnection: var6 } AS this"
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

    test("Read interface relationship Using Connection + User Defined Where", async () => {
        const query = /* GraphQL */ `
            {
                users {
                    id
                    contentConnection(where: { node: { id_EQ: "some-id" } }) {
                        edges {
                            node {
                                ... on Post {
                                    id
                                }
                            }
                        }
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, { token });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:User)
            WITH *
            WHERE ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub))
            CALL {
                WITH this
                CALL {
                    WITH this
                    MATCH (this)-[this0:HAS_CONTENT]->(this1:Comment)
                    WHERE this1.id = $param2
                    WITH { node: { __resolveType: \\"Comment\\", __id: id(this1) } } AS edge
                    RETURN edge
                    UNION
                    WITH this
                    MATCH (this)-[this2:HAS_CONTENT]->(this3:Post)
                    OPTIONAL MATCH (this3)<-[:HAS_CONTENT]-(this4:User)
                    WITH *, count(this4) AS var5
                    WITH *
                    WHERE (this3.id = $param3 AND ($isAuthenticated = true AND (var5 <> 0 AND ($jwt.sub IS NOT NULL AND this4.id = $jwt.sub))))
                    WITH { node: { __resolveType: \\"Post\\", __id: id(this3), id: this3.id } } AS edge
                    RETURN edge
                }
                WITH collect(edge) AS edges
                WITH edges, size(edges) AS totalCount
                RETURN { edges: edges, totalCount: totalCount } AS var6
            }
            RETURN this { .id, contentConnection: var6 } AS this"
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
                \\"param2\\": \\"some-id\\",
                \\"param3\\": \\"some-id\\"
            }"
        `);
    });

    test("Update Node", async () => {
        const query = /* GraphQL */ `
            mutation {
                updatePosts(update: { content_SET: "Bob" }) {
                    posts {
                        id
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, { token });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            OPTIONAL MATCH (this)<-[:HAS_CONTENT]-(this0:User)
            WITH *, count(this0) AS var1
            WITH *
            WHERE ($isAuthenticated = true AND (var1 <> 0 AND ($jwt.sub IS NOT NULL AND this0.id = $jwt.sub)))
            SET this.content = $this_update_content_SET
            WITH *
            CALL {
            	WITH this
            	MATCH (this)<-[this_creator_User_unique:HAS_CONTENT]-(:User)
            	WITH count(this_creator_User_unique) as c
            	WHERE apoc.util.validatePredicate(NOT (c = 1), '@neo4j/graphql/RELATIONSHIP-REQUIREDPost.creator required exactly once', [0])
            	RETURN c AS this_creator_User_unique_ignored
            }
            OPTIONAL MATCH (this)<-[:HAS_CONTENT]-(update_this0:User)
            WITH *, count(update_this0) AS update_var1
            WITH *
            WHERE ($isAuthenticated = true AND (update_var1 <> 0 AND ($jwt.sub IS NOT NULL AND update_this0.id = $jwt.sub)))
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
                \\"this_update_content_SET\\": \\"Bob\\",
                \\"resolvedCallbacks\\": {}
            }"
        `);
    });

    test("Update Node + User Defined Where", async () => {
        const query = /* GraphQL */ `
            mutation {
                updatePosts(where: { content_EQ: "bob" }, update: { content_SET: "Bob" }) {
                    posts {
                        id
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, { token });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            OPTIONAL MATCH (this)<-[:HAS_CONTENT]-(this0:User)
            WITH *, count(this0) AS var1
            WITH *
            WHERE (this.content = $param0 AND ($isAuthenticated = true AND (var1 <> 0 AND ($jwt.sub IS NOT NULL AND this0.id = $jwt.sub))))
            SET this.content = $this_update_content_SET
            WITH *
            CALL {
            	WITH this
            	MATCH (this)<-[this_creator_User_unique:HAS_CONTENT]-(:User)
            	WITH count(this_creator_User_unique) as c
            	WHERE apoc.util.validatePredicate(NOT (c = 1), '@neo4j/graphql/RELATIONSHIP-REQUIREDPost.creator required exactly once', [0])
            	RETURN c AS this_creator_User_unique_ignored
            }
            OPTIONAL MATCH (this)<-[:HAS_CONTENT]-(update_this0:User)
            WITH *, count(update_this0) AS update_var1
            WITH *
            WHERE ($isAuthenticated = true AND (update_var1 <> 0 AND ($jwt.sub IS NOT NULL AND update_this0.id = $jwt.sub)))
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
                \\"param0\\": \\"bob\\",
                \\"this_update_content_SET\\": \\"Bob\\",
                \\"resolvedCallbacks\\": {}
            }"
        `);
    });

    test("Update Nested Node", async () => {
        const query = /* GraphQL */ `
            mutation {
                updateUsers(update: { content: { update: { node: { id_SET: "new-id" } } } }) {
                    users {
                        id
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, { token });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:User)
            WITH *
            WHERE ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub))
            WITH this
            CALL {
            	 WITH this
            WITH this
            CALL {
            	WITH this
            	MATCH (this)-[this_has_content0_relationship:HAS_CONTENT]->(this_content0:Comment)
            	SET this_content0.id = $this_update_content0_id_SET
            	WITH this, this_content0
            	CALL {
            		WITH this_content0
            		MATCH (this_content0)<-[this_content0_creator_User_unique:HAS_CONTENT]-(:User)
            		WITH count(this_content0_creator_User_unique) as c
            		WHERE apoc.util.validatePredicate(NOT (c = 1), '@neo4j/graphql/RELATIONSHIP-REQUIREDComment.creator required exactly once', [0])
            		RETURN c AS this_content0_creator_User_unique_ignored
            	}
            	RETURN count(*) AS update_this_content0
            }
            RETURN count(*) AS update_this_Comment
            }
            CALL {
            	 WITH this
            	WITH this
            CALL {
            	WITH this
            	MATCH (this)-[this_has_content0_relationship:HAS_CONTENT]->(this_content0:Post)
            	OPTIONAL MATCH (this_content0)<-[:HAS_CONTENT]-(authorization_updatebefore_this1:User)
            	WITH *, count(authorization_updatebefore_this1) AS authorization_updatebefore_var0
            	WHERE ($isAuthenticated = true AND (authorization_updatebefore_var0 <> 0 AND ($jwt.sub IS NOT NULL AND authorization_updatebefore_this1.id = $jwt.sub)))
            	SET this_content0.id = $this_update_content0_id_SET
            	WITH this, this_content0
            	CALL {
            		WITH this_content0
            		MATCH (this_content0)<-[this_content0_creator_User_unique:HAS_CONTENT]-(:User)
            		WITH count(this_content0_creator_User_unique) as c
            		WHERE apoc.util.validatePredicate(NOT (c = 1), '@neo4j/graphql/RELATIONSHIP-REQUIREDPost.creator required exactly once', [0])
            		RETURN c AS this_content0_creator_User_unique_ignored
            	}
            	RETURN count(*) AS update_this_content0
            }
            RETURN count(*) AS update_this_Post
            }
            WITH *
            WHERE ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub))
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
                \\"this_update_content0_id_SET\\": \\"new-id\\",
                \\"resolvedCallbacks\\": {}
            }"
        `);
    });

    test("Delete Node", async () => {
        const query = /* GraphQL */ `
            mutation {
                deletePosts {
                    nodesDeleted
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, { token });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            OPTIONAL MATCH (this)<-[:HAS_CONTENT]-(this0:User)
            WITH *, count(this0) AS var1
            WHERE ($isAuthenticated = true AND (var1 <> 0 AND ($jwt.sub IS NOT NULL AND this0.id = $jwt.sub)))
            DETACH DELETE this"
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

    test("Delete Node + User Defined Where", async () => {
        const query = /* GraphQL */ `
            mutation {
                deletePosts(where: { content_EQ: "Bob" }) {
                    nodesDeleted
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, { token });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            OPTIONAL MATCH (this)<-[:HAS_CONTENT]-(this0:User)
            WITH *, count(this0) AS var1
            WHERE (this.content = $param0 AND ($isAuthenticated = true AND (var1 <> 0 AND ($jwt.sub IS NOT NULL AND this0.id = $jwt.sub))))
            DETACH DELETE this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"param0\\": \\"Bob\\",
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

    test("Delete Nested Node", async () => {
        const query = /* GraphQL */ `
            mutation {
                deleteUsers(delete: { content: { where: {} } }) {
                    nodesDeleted
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, { token });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:User)
            WHERE ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub))
            WITH *
            CALL {
                WITH *
                OPTIONAL MATCH (this)-[this0:HAS_CONTENT]->(this1:Comment)
                WITH this0, collect(DISTINCT this1) AS var2
                CALL {
                    WITH var2
                    UNWIND var2 AS var3
                    DETACH DELETE var3
                }
            }
            CALL {
                WITH *
                OPTIONAL MATCH (this)-[this4:HAS_CONTENT]->(this5:Post)
                OPTIONAL MATCH (this5)<-[:HAS_CONTENT]-(this6:User)
                WITH *, count(this6) AS var7
                WHERE ($isAuthenticated = true AND (var7 <> 0 AND ($jwt.sub IS NOT NULL AND this6.id = $jwt.sub)))
                WITH this4, collect(DISTINCT this5) AS var8
                CALL {
                    WITH var8
                    UNWIND var8 AS var9
                    DETACH DELETE var9
                }
            }
            WITH *
            DETACH DELETE this"
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

    test("Connect Node (from create)", async () => {
        const query = /* GraphQL */ `
            mutation {
                createUsers(
                    input: [
                        { id: "123", name: "Bob", password: "password", content: { connect: { where: { node: {} } } } }
                    ]
                ) {
                    users {
                        id
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, { token });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "CALL {
            CREATE (this0:User)
            SET this0.id = $this0_id
            SET this0.name = $this0_name
            SET this0.password = $this0_password
            WITH *
            CALL {
            	WITH this0
            	OPTIONAL MATCH (this0_content_connect0_node:Comment)
            	CALL {
            		WITH *
            		WITH collect(this0_content_connect0_node) as connectedNodes, collect(this0) as parentNodes
            		CALL {
            			WITH connectedNodes, parentNodes
            			UNWIND parentNodes as this0
            			UNWIND connectedNodes as this0_content_connect0_node
            			MERGE (this0)-[:HAS_CONTENT]->(this0_content_connect0_node)
            		}
            	}
            WITH this0, this0_content_connect0_node
            	RETURN count(*) AS connect_this0_content_connect_Comment0
            }
            CALL {
            		WITH this0
            	OPTIONAL MATCH (this0_content_connect1_node:Post)
            OPTIONAL MATCH (this0_content_connect1_node)<-[:HAS_CONTENT]-(authorization__before_this1:User)
            WITH *, count(authorization__before_this1) AS authorization__before_var0
            WITH *
            	WHERE ($isAuthenticated = true AND (authorization__before_var0 <> 0 AND ($jwt.sub IS NOT NULL AND authorization__before_this1.id = $jwt.sub)))
            	CALL {
            		WITH *
            		WITH collect(this0_content_connect1_node) as connectedNodes, collect(this0) as parentNodes
            		CALL {
            			WITH connectedNodes, parentNodes
            			UNWIND parentNodes as this0
            			UNWIND connectedNodes as this0_content_connect1_node
            			MERGE (this0)-[:HAS_CONTENT]->(this0_content_connect1_node)
            		}
            	}
            WITH this0, this0_content_connect1_node
            	RETURN count(*) AS connect_this0_content_connect_Post1
            }
            RETURN this0
            }
            CALL {
                WITH this0
                RETURN this0 { .id } AS create_var0
            }
            RETURN [create_var0] AS data"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this0_id\\": \\"123\\",
                \\"this0_name\\": \\"Bob\\",
                \\"this0_password\\": \\"password\\",
                \\"isAuthenticated\\": true,
                \\"jwt\\": {
                    \\"roles\\": [
                        \\"admin\\"
                    ],
                    \\"sub\\": \\"id-01\\"
                },
                \\"resolvedCallbacks\\": {}
            }"
        `);
    });

    test("Connect Node + User Defined Where (from create)", async () => {
        const query = /* GraphQL */ `
            mutation {
                createUsers(
                    input: [
                        {
                            id: "123"
                            name: "Bob"
                            password: "password"
                            content: { connect: { where: { node: { id_EQ: "post-id" } } } }
                        }
                    ]
                ) {
                    users {
                        id
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, { token });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "CALL {
            CREATE (this0:User)
            SET this0.id = $this0_id
            SET this0.name = $this0_name
            SET this0.password = $this0_password
            WITH *
            CALL {
            	WITH this0
            	OPTIONAL MATCH (this0_content_connect0_node:Comment)
            	WHERE this0_content_connect0_node.id = $this0_content_connect0_node_param0
            	CALL {
            		WITH *
            		WITH collect(this0_content_connect0_node) as connectedNodes, collect(this0) as parentNodes
            		CALL {
            			WITH connectedNodes, parentNodes
            			UNWIND parentNodes as this0
            			UNWIND connectedNodes as this0_content_connect0_node
            			MERGE (this0)-[:HAS_CONTENT]->(this0_content_connect0_node)
            		}
            	}
            WITH this0, this0_content_connect0_node
            	RETURN count(*) AS connect_this0_content_connect_Comment0
            }
            CALL {
            		WITH this0
            	OPTIONAL MATCH (this0_content_connect1_node:Post)
            OPTIONAL MATCH (this0_content_connect1_node)<-[:HAS_CONTENT]-(authorization__before_this1:User)
            WITH *, count(authorization__before_this1) AS authorization__before_var0
            WITH *
            	WHERE this0_content_connect1_node.id = $this0_content_connect1_node_param0 AND ($isAuthenticated = true AND (authorization__before_var0 <> 0 AND ($jwt.sub IS NOT NULL AND authorization__before_this1.id = $jwt.sub)))
            	CALL {
            		WITH *
            		WITH collect(this0_content_connect1_node) as connectedNodes, collect(this0) as parentNodes
            		CALL {
            			WITH connectedNodes, parentNodes
            			UNWIND parentNodes as this0
            			UNWIND connectedNodes as this0_content_connect1_node
            			MERGE (this0)-[:HAS_CONTENT]->(this0_content_connect1_node)
            		}
            	}
            WITH this0, this0_content_connect1_node
            	RETURN count(*) AS connect_this0_content_connect_Post1
            }
            RETURN this0
            }
            CALL {
                WITH this0
                RETURN this0 { .id } AS create_var0
            }
            RETURN [create_var0] AS data"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this0_id\\": \\"123\\",
                \\"this0_name\\": \\"Bob\\",
                \\"this0_password\\": \\"password\\",
                \\"this0_content_connect0_node_param0\\": \\"post-id\\",
                \\"this0_content_connect1_node_param0\\": \\"post-id\\",
                \\"isAuthenticated\\": true,
                \\"jwt\\": {
                    \\"roles\\": [
                        \\"admin\\"
                    ],
                    \\"sub\\": \\"id-01\\"
                },
                \\"resolvedCallbacks\\": {}
            }"
        `);
    });

    test("Connect Node (from update update)", async () => {
        const query = /* GraphQL */ `
            mutation {
                updateUsers(update: { content: { connect: { where: { node: {} } } } }) {
                    users {
                        id
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, { token });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:User)
            WITH *
            WHERE ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub))
            WITH this
            CALL {
            	 WITH this
            WITH *
            CALL {
            	WITH this
            	OPTIONAL MATCH (this_content0_connect0_node:Comment)
            	WHERE ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub))
            	CALL {
            		WITH *
            		WITH collect(this_content0_connect0_node) as connectedNodes, collect(this) as parentNodes
            		CALL {
            			WITH connectedNodes, parentNodes
            			UNWIND parentNodes as this
            			UNWIND connectedNodes as this_content0_connect0_node
            			MERGE (this)-[:HAS_CONTENT]->(this_content0_connect0_node)
            		}
            	}
            WITH this, this_content0_connect0_node
            	RETURN count(*) AS connect_this_content0_connect_Comment0
            }
            RETURN count(*) AS update_this_Comment
            }
            CALL {
            	 WITH this
            	WITH *
            CALL {
            	WITH this
            	OPTIONAL MATCH (this_content0_connect0_node:Post)
            OPTIONAL MATCH (this_content0_connect0_node)<-[:HAS_CONTENT]-(authorization__before_this1:User)
            WITH *, count(authorization__before_this1) AS authorization__before_var0
            WITH *
            	WHERE (($isAuthenticated = true AND (authorization__before_var0 <> 0 AND ($jwt.sub IS NOT NULL AND authorization__before_this1.id = $jwt.sub))) AND ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)))
            	CALL {
            		WITH *
            		WITH collect(this_content0_connect0_node) as connectedNodes, collect(this) as parentNodes
            		CALL {
            			WITH connectedNodes, parentNodes
            			UNWIND parentNodes as this
            			UNWIND connectedNodes as this_content0_connect0_node
            			MERGE (this)-[:HAS_CONTENT]->(this_content0_connect0_node)
            		}
            	}
            WITH this, this_content0_connect0_node
            	RETURN count(*) AS connect_this_content0_connect_Post0
            }
            RETURN count(*) AS update_this_Post
            }
            WITH *
            WHERE ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub))
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
                \\"resolvedCallbacks\\": {}
            }"
        `);
    });

    test("Connect Node + User Defined Where (from update update)", async () => {
        const query = /* GraphQL */ `
            mutation {
                updateUsers(update: { content: { connect: { where: { node: { id_EQ: "new-id" } } } } }) {
                    users {
                        id
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, { token });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:User)
            WITH *
            WHERE ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub))
            WITH this
            CALL {
            	 WITH this
            WITH *
            CALL {
            	WITH this
            	OPTIONAL MATCH (this_content0_connect0_node:Comment)
            	WHERE this_content0_connect0_node.id = $this_content0_connect0_node_param0 AND ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub))
            	CALL {
            		WITH *
            		WITH collect(this_content0_connect0_node) as connectedNodes, collect(this) as parentNodes
            		CALL {
            			WITH connectedNodes, parentNodes
            			UNWIND parentNodes as this
            			UNWIND connectedNodes as this_content0_connect0_node
            			MERGE (this)-[:HAS_CONTENT]->(this_content0_connect0_node)
            		}
            	}
            WITH this, this_content0_connect0_node
            	RETURN count(*) AS connect_this_content0_connect_Comment0
            }
            RETURN count(*) AS update_this_Comment
            }
            CALL {
            	 WITH this
            	WITH *
            CALL {
            	WITH this
            	OPTIONAL MATCH (this_content0_connect0_node:Post)
            OPTIONAL MATCH (this_content0_connect0_node)<-[:HAS_CONTENT]-(authorization__before_this1:User)
            WITH *, count(authorization__before_this1) AS authorization__before_var0
            WITH *
            	WHERE this_content0_connect0_node.id = $this_content0_connect0_node_param0 AND (($isAuthenticated = true AND (authorization__before_var0 <> 0 AND ($jwt.sub IS NOT NULL AND authorization__before_this1.id = $jwt.sub))) AND ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)))
            	CALL {
            		WITH *
            		WITH collect(this_content0_connect0_node) as connectedNodes, collect(this) as parentNodes
            		CALL {
            			WITH connectedNodes, parentNodes
            			UNWIND parentNodes as this
            			UNWIND connectedNodes as this_content0_connect0_node
            			MERGE (this)-[:HAS_CONTENT]->(this_content0_connect0_node)
            		}
            	}
            WITH this, this_content0_connect0_node
            	RETURN count(*) AS connect_this_content0_connect_Post0
            }
            RETURN count(*) AS update_this_Post
            }
            WITH *
            WHERE ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub))
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
                \\"this_content0_connect0_node_param0\\": \\"new-id\\",
                \\"resolvedCallbacks\\": {}
            }"
        `);
    });

    test("Disconnect Node (from update update)", async () => {
        const query = /* GraphQL */ `
            mutation {
                updateUsers(update: { content: { disconnect: { where: {} } } }) {
                    users {
                        id
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, { token });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:User)
            WITH *
            WHERE ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub))
            WITH this
            CALL {
            	 WITH this
            WITH this
            CALL {
            WITH this
            OPTIONAL MATCH (this)-[this_content0_disconnect0_rel:HAS_CONTENT]->(this_content0_disconnect0:Comment)
            WHERE ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub))
            CALL {
            	WITH this_content0_disconnect0, this_content0_disconnect0_rel, this
            	WITH collect(this_content0_disconnect0) as this_content0_disconnect0, this_content0_disconnect0_rel, this
            	UNWIND this_content0_disconnect0 as x
            	DELETE this_content0_disconnect0_rel
            }
            RETURN count(*) AS disconnect_this_content0_disconnect_Comment
            }
            RETURN count(*) AS update_this_Comment
            }
            CALL {
            	 WITH this
            	WITH this
            CALL {
            WITH this
            OPTIONAL MATCH (this)-[this_content0_disconnect0_rel:HAS_CONTENT]->(this_content0_disconnect0:Post)
            OPTIONAL MATCH (this_content0_disconnect0)<-[:HAS_CONTENT]-(authorization__before_this1:User)
            WITH *, count(authorization__before_this1) AS authorization__before_var0
            WITH *
            WHERE (($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)) AND ($isAuthenticated = true AND (authorization__before_var0 <> 0 AND ($jwt.sub IS NOT NULL AND authorization__before_this1.id = $jwt.sub))))
            CALL {
            	WITH this_content0_disconnect0, this_content0_disconnect0_rel, this
            	WITH collect(this_content0_disconnect0) as this_content0_disconnect0, this_content0_disconnect0_rel, this
            	UNWIND this_content0_disconnect0 as x
            	DELETE this_content0_disconnect0_rel
            }
            RETURN count(*) AS disconnect_this_content0_disconnect_Post
            }
            RETURN count(*) AS update_this_Post
            }
            WITH *
            WHERE ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub))
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
                \\"resolvedCallbacks\\": {}
            }"
        `);
    });

    test("Disconnect Node + User Defined Where (from update update)", async () => {
        const query = /* GraphQL */ `
            mutation {
                updateUsers(update: { content: [{ disconnect: { where: { node: { id_EQ: "new-id" } } } }] }) {
                    users {
                        id
                    }
                }
            }
        `;

        const token = createBearerToken("secret", { sub: "id-01", roles: ["admin"] });
        const result = await translateQuery(neoSchema, query, { token });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:User)
            WITH *
            WHERE ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub))
            WITH this
            CALL {
            	 WITH this
            WITH this
            CALL {
            WITH this
            OPTIONAL MATCH (this)-[this_content0_disconnect0_rel:HAS_CONTENT]->(this_content0_disconnect0:Comment)
            WHERE this_content0_disconnect0.id = $updateUsers_args_update_content0_disconnect0_where_Comment_this_content0_disconnect0param0 AND ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub))
            CALL {
            	WITH this_content0_disconnect0, this_content0_disconnect0_rel, this
            	WITH collect(this_content0_disconnect0) as this_content0_disconnect0, this_content0_disconnect0_rel, this
            	UNWIND this_content0_disconnect0 as x
            	DELETE this_content0_disconnect0_rel
            }
            RETURN count(*) AS disconnect_this_content0_disconnect_Comment
            }
            RETURN count(*) AS update_this_Comment
            }
            CALL {
            	 WITH this
            	WITH this
            CALL {
            WITH this
            OPTIONAL MATCH (this)-[this_content0_disconnect0_rel:HAS_CONTENT]->(this_content0_disconnect0:Post)
            OPTIONAL MATCH (this_content0_disconnect0)<-[:HAS_CONTENT]-(authorization__before_this1:User)
            WITH *, count(authorization__before_this1) AS authorization__before_var0
            WITH *
            WHERE this_content0_disconnect0.id = $updateUsers_args_update_content0_disconnect0_where_Post_this_content0_disconnect0param0 AND (($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub)) AND ($isAuthenticated = true AND (authorization__before_var0 <> 0 AND ($jwt.sub IS NOT NULL AND authorization__before_this1.id = $jwt.sub))))
            CALL {
            	WITH this_content0_disconnect0, this_content0_disconnect0_rel, this
            	WITH collect(this_content0_disconnect0) as this_content0_disconnect0, this_content0_disconnect0_rel, this
            	UNWIND this_content0_disconnect0 as x
            	DELETE this_content0_disconnect0_rel
            }
            RETURN count(*) AS disconnect_this_content0_disconnect_Post
            }
            RETURN count(*) AS update_this_Post
            }
            WITH *
            WHERE ($isAuthenticated = true AND ($jwt.sub IS NOT NULL AND this.id = $jwt.sub))
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
                \\"updateUsers_args_update_content0_disconnect0_where_Comment_this_content0_disconnect0param0\\": \\"new-id\\",
                \\"updateUsers_args_update_content0_disconnect0_where_Post_this_content0_disconnect0param0\\": \\"new-id\\",
                \\"updateUsers\\": {
                    \\"args\\": {
                        \\"update\\": {
                            \\"content\\": [
                                {
                                    \\"disconnect\\": [
                                        {
                                            \\"where\\": {
                                                \\"node\\": {
                                                    \\"id_EQ\\": \\"new-id\\"
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
});
