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
import { formatCypher, formatParams, translateQuery } from "../../utils/tck-test-utils";

describe("Relay Cursor Connection projections", () => {
    let typeDefs: string;
    let neoSchema: Neo4jGraphQL;

    beforeAll(() => {
        typeDefs = /* GraphQL */ `
            union Production = Movie | Series

            type Movie @node {
                title: String!
                actors: [Actor!]! @relationship(type: "ACTED_IN", direction: IN)
            }

            type Series @node {
                title: String!
                actors: [Actor!]! @relationship(type: "ACTED_IN", direction: IN)
            }

            type Actor @node {
                name: String!
                productions: [Production!]! @relationship(type: "ACTED_IN", direction: OUT)
            }
        `;

        neoSchema = new Neo4jGraphQL({
            typeDefs,
        });
    });

    test("edges not returned if not asked for", async () => {
        const query = /* GraphQL */ `
            query {
                movies(where: { title_EQ: "Forrest Gump" }) {
                    title
                    actorsConnection {
                        totalCount
                    }
                }
            }
        `;

        const result = await translateQuery(neoSchema, query);

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Movie)
            WHERE this.title = $param0
            CALL {
                WITH this
                MATCH (this)<-[this0:ACTED_IN]-(this1:Actor)
                WITH collect({ node: this1, relationship: this0 }) AS edges
                WITH edges, size(edges) AS totalCount
                CALL {
                    WITH edges
                    UNWIND edges AS edge
                    WITH edge.node AS this1, edge.relationship AS this0
                    RETURN collect({ node: { __id: id(this1), __resolveType: \\"Actor\\" } }) AS var2
                }
                RETURN { edges: var2, totalCount: totalCount } AS var3
            }
            RETURN this { .title, actorsConnection: var3 } AS this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"param0\\": \\"Forrest Gump\\"
            }"
        `);
    });

    test("edges and totalCount returned if pageInfo asked for", async () => {
        const query = /* GraphQL */ `
            query {
                movies(where: { title_EQ: "Forrest Gump" }) {
                    title
                    actorsConnection {
                        pageInfo {
                            startCursor
                            endCursor
                            hasNextPage
                            hasPreviousPage
                        }
                    }
                }
            }
        `;

        const result = await translateQuery(neoSchema, query);

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Movie)
            WHERE this.title = $param0
            CALL {
                WITH this
                MATCH (this)<-[this0:ACTED_IN]-(this1:Actor)
                WITH collect({ node: this1, relationship: this0 }) AS edges
                WITH edges, size(edges) AS totalCount
                CALL {
                    WITH edges
                    UNWIND edges AS edge
                    WITH edge.node AS this1, edge.relationship AS this0
                    RETURN collect({ node: { __id: id(this1), __resolveType: \\"Actor\\" } }) AS var2
                }
                RETURN { edges: var2, totalCount: totalCount } AS var3
            }
            RETURN this { .title, actorsConnection: var3 } AS this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"param0\\": \\"Forrest Gump\\"
            }"
        `);
    });

    test("Minimal edges returned if not asked for with pagination arguments", async () => {
        const query = /* GraphQL */ `
            query {
                movies(where: { title_EQ: "Forrest Gump" }) {
                    title
                    actorsConnection(first: 5) {
                        totalCount
                    }
                }
            }
        `;

        const result = await translateQuery(neoSchema, query);

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Movie)
            WHERE this.title = $param0
            CALL {
                WITH this
                MATCH (this)<-[this0:ACTED_IN]-(this1:Actor)
                WITH collect({ node: this1, relationship: this0 }) AS edges
                WITH edges, size(edges) AS totalCount
                CALL {
                    WITH edges
                    UNWIND edges AS edge
                    WITH edge.node AS this1, edge.relationship AS this0
                    WITH *
                    LIMIT $param1
                    RETURN collect({ node: { __id: id(this1), __resolveType: \\"Actor\\" } }) AS var2
                }
                RETURN { edges: var2, totalCount: totalCount } AS var3
            }
            RETURN this { .title, actorsConnection: var3 } AS this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"param0\\": \\"Forrest Gump\\",
                \\"param1\\": {
                    \\"low\\": 5,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("edges not returned if not asked for on a union", async () => {
        const query = /* GraphQL */ `
            query {
                actors(where: { name_EQ: "Tom Hanks" }) {
                    name
                    productionsConnection {
                        totalCount
                    }
                }
            }
        `;

        const result = await translateQuery(neoSchema, query);

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Actor)
            WHERE this.name = $param0
            CALL {
                WITH this
                CALL {
                    WITH this
                    MATCH (this)-[this0:ACTED_IN]->(this1:Movie)
                    WITH { node: { __resolveType: \\"Movie\\", __id: id(this1) } } AS edge
                    RETURN edge
                    UNION
                    WITH this
                    MATCH (this)-[this2:ACTED_IN]->(this3:Series)
                    WITH { node: { __resolveType: \\"Series\\", __id: id(this3) } } AS edge
                    RETURN edge
                }
                WITH collect(edge) AS edges
                WITH edges, size(edges) AS totalCount
                RETURN { edges: edges, totalCount: totalCount } AS var4
            }
            RETURN this { .name, productionsConnection: var4 } AS this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"param0\\": \\"Tom Hanks\\"
            }"
        `);
    });

    test("edges and totalCount returned if pageInfo asked for on a union", async () => {
        const query = /* GraphQL */ `
            query {
                actors(where: { name_EQ: "Tom Hanks" }) {
                    name
                    productionsConnection {
                        pageInfo {
                            startCursor
                            endCursor
                            hasNextPage
                            hasPreviousPage
                        }
                    }
                }
            }
        `;

        const result = await translateQuery(neoSchema, query);

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Actor)
            WHERE this.name = $param0
            CALL {
                WITH this
                CALL {
                    WITH this
                    MATCH (this)-[this0:ACTED_IN]->(this1:Movie)
                    WITH { node: { __resolveType: \\"Movie\\", __id: id(this1) } } AS edge
                    RETURN edge
                    UNION
                    WITH this
                    MATCH (this)-[this2:ACTED_IN]->(this3:Series)
                    WITH { node: { __resolveType: \\"Series\\", __id: id(this3) } } AS edge
                    RETURN edge
                }
                WITH collect(edge) AS edges
                WITH edges, size(edges) AS totalCount
                RETURN { edges: edges, totalCount: totalCount } AS var4
            }
            RETURN this { .name, productionsConnection: var4 } AS this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"param0\\": \\"Tom Hanks\\"
            }"
        `);
    });

    test("totalCount is calculated and returned if asked for with edges", async () => {
        const query = /* GraphQL */ `
            query {
                movies(where: { title_EQ: "Forrest Gump" }) {
                    title
                    actorsConnection {
                        totalCount
                        edges {
                            node {
                                name
                            }
                        }
                    }
                }
            }
        `;

        const result = await translateQuery(neoSchema, query);

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Movie)
            WHERE this.title = $param0
            CALL {
                WITH this
                MATCH (this)<-[this0:ACTED_IN]-(this1:Actor)
                WITH collect({ node: this1, relationship: this0 }) AS edges
                WITH edges, size(edges) AS totalCount
                CALL {
                    WITH edges
                    UNWIND edges AS edge
                    WITH edge.node AS this1, edge.relationship AS this0
                    RETURN collect({ node: { name: this1.name, __resolveType: \\"Actor\\" } }) AS var2
                }
                RETURN { edges: var2, totalCount: totalCount } AS var3
            }
            RETURN this { .title, actorsConnection: var3 } AS this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"param0\\": \\"Forrest Gump\\"
            }"
        `);
    });

    test("totalCount is calculated and returned if asked for with edges with pagination arguments", async () => {
        const query = /* GraphQL */ `
            query {
                movies(where: { title_EQ: "Forrest Gump" }) {
                    title
                    actorsConnection(first: 5) {
                        totalCount
                        edges {
                            node {
                                name
                            }
                        }
                    }
                }
            }
        `;

        const result = await translateQuery(neoSchema, query);

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Movie)
            WHERE this.title = $param0
            CALL {
                WITH this
                MATCH (this)<-[this0:ACTED_IN]-(this1:Actor)
                WITH collect({ node: this1, relationship: this0 }) AS edges
                WITH edges, size(edges) AS totalCount
                CALL {
                    WITH edges
                    UNWIND edges AS edge
                    WITH edge.node AS this1, edge.relationship AS this0
                    WITH *
                    LIMIT $param1
                    RETURN collect({ node: { name: this1.name, __resolveType: \\"Actor\\" } }) AS var2
                }
                RETURN { edges: var2, totalCount: totalCount } AS var3
            }
            RETURN this { .title, actorsConnection: var3 } AS this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"param0\\": \\"Forrest Gump\\",
                \\"param1\\": {
                    \\"low\\": 5,
                    \\"high\\": 0
                }
            }"
        `);
    });
});
