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

import { JWTPlugin } from "@neo4j/graphql-plugin-auth";
import { gql } from "apollo-server";
import { DocumentNode } from "graphql";
import { Neo4jGraphQL } from "../../../../../../src";
import { createJwtRequest } from "../../../../../utils/create-jwt-request";
import {
    formatCypher,
    translateQuery,
    formatParams,
    setTestEnvVars,
    unsetTestEnvVars,
} from "../../../../utils/tck-test-utils";

describe("Cypher -> Connections -> Filtering -> Relationship -> String", () => {
    const secret = "secret";
    let typeDefs: DocumentNode;
    let neoSchema: Neo4jGraphQL;

    beforeAll(() => {
        typeDefs = gql`
            type Movie {
                title: String!
                actors: [Actor!]! @relationship(type: "ACTED_IN", properties: "ActedIn", direction: IN)
            }

            type Actor {
                name: String!
                movies: [Movie!]! @relationship(type: "ACTED_IN", properties: "ActedIn", direction: OUT)
            }

            interface ActedIn {
                role: String!
                screenTime: Int!
            }
        `;

        neoSchema = new Neo4jGraphQL({
            typeDefs,
            config: { enableRegex: true },
            plugins: {
                jwt: new JWTPlugin({
                    secret,
                }),
            },
        });
        setTestEnvVars("NEO4J_GRAPHQL_ENABLE_REGEX=1");
    });

    afterAll(() => {
        unsetTestEnvVars(undefined);
    });
    test("CONTAINS", async () => {
        const query = gql`
            query {
                movies {
                    title
                    actorsConnection(where: { edge: { role_CONTAINS: "Forrest" } }) {
                        edges {
                            role
                            node {
                                name
                            }
                        }
                    }
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Movie)
            CALL {
            WITH this
            MATCH (this)<-[this_acted_in_relationship:ACTED_IN]-(this_actor:Actor)
            WHERE this_acted_in_relationship.role CONTAINS $this_actorsConnection.args.where.edge.role_CONTAINS
            WITH collect({ role: this_acted_in_relationship.role, node: { name: this_actor.name } }) AS edges
            RETURN { edges: edges, totalCount: size(edges) } AS actorsConnection
            }
            RETURN this { .title, actorsConnection } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_actorsConnection\\": {
                    \\"args\\": {
                        \\"where\\": {
                            \\"edge\\": {
                                \\"role_CONTAINS\\": \\"Forrest\\"
                            }
                        }
                    }
                }
            }"
        `);
    });

    test("NOT_CONTAINS", async () => {
        const query = gql`
            query {
                movies {
                    title
                    actorsConnection(where: { edge: { role_NOT_CONTAINS: "Forrest" } }) {
                        edges {
                            role
                            node {
                                name
                            }
                        }
                    }
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Movie)
            CALL {
            WITH this
            MATCH (this)<-[this_acted_in_relationship:ACTED_IN]-(this_actor:Actor)
            WHERE (NOT this_acted_in_relationship.role CONTAINS $this_actorsConnection.args.where.edge.role_NOT_CONTAINS)
            WITH collect({ role: this_acted_in_relationship.role, node: { name: this_actor.name } }) AS edges
            RETURN { edges: edges, totalCount: size(edges) } AS actorsConnection
            }
            RETURN this { .title, actorsConnection } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_actorsConnection\\": {
                    \\"args\\": {
                        \\"where\\": {
                            \\"edge\\": {
                                \\"role_NOT_CONTAINS\\": \\"Forrest\\"
                            }
                        }
                    }
                }
            }"
        `);
    });

    test("STARTS_WITH", async () => {
        const query = gql`
            query {
                movies {
                    title
                    actorsConnection(where: { edge: { role_STARTS_WITH: "Forrest" } }) {
                        edges {
                            role
                            node {
                                name
                            }
                        }
                    }
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Movie)
            CALL {
            WITH this
            MATCH (this)<-[this_acted_in_relationship:ACTED_IN]-(this_actor:Actor)
            WHERE this_acted_in_relationship.role STARTS WITH $this_actorsConnection.args.where.edge.role_STARTS_WITH
            WITH collect({ role: this_acted_in_relationship.role, node: { name: this_actor.name } }) AS edges
            RETURN { edges: edges, totalCount: size(edges) } AS actorsConnection
            }
            RETURN this { .title, actorsConnection } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_actorsConnection\\": {
                    \\"args\\": {
                        \\"where\\": {
                            \\"edge\\": {
                                \\"role_STARTS_WITH\\": \\"Forrest\\"
                            }
                        }
                    }
                }
            }"
        `);
    });

    test("NOT_STARTS_WITH", async () => {
        const query = gql`
            query {
                movies {
                    title
                    actorsConnection(where: { edge: { role_NOT_STARTS_WITH: "Forrest" } }) {
                        edges {
                            role
                            node {
                                name
                            }
                        }
                    }
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Movie)
            CALL {
            WITH this
            MATCH (this)<-[this_acted_in_relationship:ACTED_IN]-(this_actor:Actor)
            WHERE (NOT this_acted_in_relationship.role STARTS WITH $this_actorsConnection.args.where.edge.role_NOT_STARTS_WITH)
            WITH collect({ role: this_acted_in_relationship.role, node: { name: this_actor.name } }) AS edges
            RETURN { edges: edges, totalCount: size(edges) } AS actorsConnection
            }
            RETURN this { .title, actorsConnection } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_actorsConnection\\": {
                    \\"args\\": {
                        \\"where\\": {
                            \\"edge\\": {
                                \\"role_NOT_STARTS_WITH\\": \\"Forrest\\"
                            }
                        }
                    }
                }
            }"
        `);
    });

    test("ENDS_WITH", async () => {
        const query = gql`
            query {
                movies {
                    title
                    actorsConnection(where: { edge: { role_ENDS_WITH: "Gump" } }) {
                        edges {
                            role
                            node {
                                name
                            }
                        }
                    }
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Movie)
            CALL {
            WITH this
            MATCH (this)<-[this_acted_in_relationship:ACTED_IN]-(this_actor:Actor)
            WHERE this_acted_in_relationship.role ENDS WITH $this_actorsConnection.args.where.edge.role_ENDS_WITH
            WITH collect({ role: this_acted_in_relationship.role, node: { name: this_actor.name } }) AS edges
            RETURN { edges: edges, totalCount: size(edges) } AS actorsConnection
            }
            RETURN this { .title, actorsConnection } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_actorsConnection\\": {
                    \\"args\\": {
                        \\"where\\": {
                            \\"edge\\": {
                                \\"role_ENDS_WITH\\": \\"Gump\\"
                            }
                        }
                    }
                }
            }"
        `);
    });

    test("NOT_ENDS_WITH", async () => {
        const query = gql`
            query {
                movies {
                    title
                    actorsConnection(where: { edge: { role_NOT_ENDS_WITH: "Gump" } }) {
                        edges {
                            role
                            node {
                                name
                            }
                        }
                    }
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Movie)
            CALL {
            WITH this
            MATCH (this)<-[this_acted_in_relationship:ACTED_IN]-(this_actor:Actor)
            WHERE (NOT this_acted_in_relationship.role ENDS WITH $this_actorsConnection.args.where.edge.role_NOT_ENDS_WITH)
            WITH collect({ role: this_acted_in_relationship.role, node: { name: this_actor.name } }) AS edges
            RETURN { edges: edges, totalCount: size(edges) } AS actorsConnection
            }
            RETURN this { .title, actorsConnection } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_actorsConnection\\": {
                    \\"args\\": {
                        \\"where\\": {
                            \\"edge\\": {
                                \\"role_NOT_ENDS_WITH\\": \\"Gump\\"
                            }
                        }
                    }
                }
            }"
        `);
    });

    test("MATCHES", async () => {
        const query = gql`
            query {
                movies {
                    title
                    actorsConnection(where: { edge: { role_MATCHES: "Forrest.+" } }) {
                        edges {
                            role
                            node {
                                name
                            }
                        }
                    }
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Movie)
            CALL {
            WITH this
            MATCH (this)<-[this_acted_in_relationship:ACTED_IN]-(this_actor:Actor)
            WHERE this_acted_in_relationship.role =~ $this_actorsConnection.args.where.edge.role_MATCHES
            WITH collect({ role: this_acted_in_relationship.role, node: { name: this_actor.name } }) AS edges
            RETURN { edges: edges, totalCount: size(edges) } AS actorsConnection
            }
            RETURN this { .title, actorsConnection } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_actorsConnection\\": {
                    \\"args\\": {
                        \\"where\\": {
                            \\"edge\\": {
                                \\"role_MATCHES\\": \\"Forrest.+\\"
                            }
                        }
                    }
                }
            }"
        `);
    });
});
