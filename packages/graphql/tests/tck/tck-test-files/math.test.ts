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

import { gql } from "apollo-server";
import { DocumentNode } from "graphql";
import { Neo4jGraphQL } from "../../../src";
import { createJwtRequest } from "../../utils/create-jwt-request";
import { formatCypher, translateQuery, formatParams } from "../utils/tck-test-utils";

describe("Math operators", () => {
    let typeDefs: DocumentNode;
    let neoSchema: Neo4jGraphQL;

    beforeAll(() => {
        typeDefs = gql`
            interface Wife {
                marriageLength: Int
            }

            type Star implements Wife {
                marriageLength: Int
                marriedWith: Actor @relationship(type: "MARRIED_WITH", direction: IN)
            }

            type Movie {
                id: ID! @id
                title: String!
                viewers: Int
                revenue: Float
                actors: [Actor!]! @relationship(type: "ACTED_IN", properties: "ActedIn", direction: IN)
            }

            type Actor {
                id: ID!
                name: String!
                actedIn: [Movie!]! @relationship(type: "ACTED_IN", properties: "ActedIn", direction: OUT)
                marriedWith: Wife @relationship(type: "MARRIED_WITH", direction: OUT)
            }

            interface ActedIn @relationshipProperties {
                pay: Float
            }
        `;

        neoSchema = new Neo4jGraphQL({
            typeDefs,
            config: { enableRegex: true },
        });
    });

    test("Simple Int increment", async () => {
        const query = gql`
            mutation {
                updateMovies(update: { viewers_INCREMENT: 3 }) {
                    movies {
                        id
                        viewers
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
            WITH this
            CALL {
            WITH this
            CALL apoc.util.validate(apoc.meta.type(this.viewers) = \\"NULL\\", 'Cannot %s %s to Nan', [\\"_INCREMENT\\", $this_update_viewers_INCREMENT])
            CALL apoc.util.validate(this.viewers + $this_update_viewers_INCREMENT > 2^31-1, 'Overflow: Value returned from operator %s is larger than %s bit', [\\"_INCREMENT\\", \\"32\\"])
            CALL apoc.util.validate(apoc.meta.type(this.viewers + $this_update_viewers_INCREMENT) <> \\"INTEGER\\", 'Type Mismatch: Value returned from operator %s does not match: %s', [\\"_INCREMENT\\", \\"Int\\"])
            SET this.viewers = this.viewers + $this_update_viewers_INCREMENT
            RETURN this as this_viewers__INCREMENT
            }
            RETURN collect(DISTINCT this { .id, .viewers }) AS data"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_update_viewers_INCREMENT\\": {
                    \\"low\\": 3,
                    \\"high\\": 0
                },
                \\"resolvedCallbacks\\": {}
            }"
        `);
    });

    test("Simple Float multiply", async () => {
        const query = gql`
            mutation {
                updateMovies(update: { revenue_MULTIPLY: 3 }) {
                    movies {
                        id
                        revenue
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
            WITH this
            CALL {
            WITH this
            CALL apoc.util.validate(apoc.meta.type(this.revenue) = \\"NULL\\", 'Cannot %s %s to Nan', [\\"_MULTIPLY\\", $this_update_revenue_MULTIPLY])
            CALL apoc.util.validate(this.revenue * $this_update_revenue_MULTIPLY > 2^63-1, 'Overflow: Value returned from operator %s is larger than %s bit', [\\"_MULTIPLY\\", \\"64\\"])
            CALL apoc.util.validate(apoc.meta.type(this.revenue * $this_update_revenue_MULTIPLY) <> \\"FLOAT\\", 'Type Mismatch: Value returned from operator %s does not match: %s', [\\"_MULTIPLY\\", \\"Float\\"])
            SET this.revenue = this.revenue * $this_update_revenue_MULTIPLY
            RETURN this as this_revenue__MULTIPLY
            }
            RETURN collect(DISTINCT this { .id, .revenue }) AS data"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_update_revenue_MULTIPLY\\": 3,
                \\"resolvedCallbacks\\": {}
            }"
        `);
    });

    test("Nested Int increment", async () => {
        const query = gql`
            mutation {
                updateActors(update: { actedIn: [{ update: { node: { viewers_INCREMENT: 10 } } }] }) {
                    actors {
                        name
                        actedIn {
                            viewers
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
            "MATCH (this:Actor)
            WITH this
            OPTIONAL MATCH (this)-[this_acted_in0_relationship:ACTED_IN]->(this_actedIn0:Movie)
            CALL apoc.do.when(this_actedIn0 IS NOT NULL, \\"
            WITH this_actedIn0, this
            CALL {
            WITH this_actedIn0
            CALL apoc.util.validate(apoc.meta.type(this_actedIn0.viewers) = \\\\\\"NULL\\\\\\", 'Cannot %s %s to Nan', [\\\\\\"_INCREMENT\\\\\\", $this_update_actedIn0_viewers_INCREMENT])
            CALL apoc.util.validate(this_actedIn0.viewers + $this_update_actedIn0_viewers_INCREMENT > 2^31-1, 'Overflow: Value returned from operator %s is larger than %s bit', [\\\\\\"_INCREMENT\\\\\\", \\\\\\"32\\\\\\"])
            CALL apoc.util.validate(apoc.meta.type(this_actedIn0.viewers + $this_update_actedIn0_viewers_INCREMENT) <> \\\\\\"INTEGER\\\\\\", 'Type Mismatch: Value returned from operator %s does not match: %s', [\\\\\\"_INCREMENT\\\\\\", \\\\\\"Int\\\\\\"])
            SET this_actedIn0.viewers = this_actedIn0.viewers + $this_update_actedIn0_viewers_INCREMENT
            RETURN this_actedIn0 as this_actedIn0_viewers__INCREMENT
            }
            RETURN count(*) AS _
            \\", \\"\\", {this:this, updateActors: $updateActors, this_actedIn0:this_actedIn0, auth:$auth,this_update_actedIn0_viewers_INCREMENT:$this_update_actedIn0_viewers_INCREMENT})
            YIELD value AS _
            RETURN collect(DISTINCT this { .name, actedIn: [ (this)-[:ACTED_IN]->(this_actedIn:Movie)   | this_actedIn { .viewers } ] }) AS data"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_update_actedIn0_viewers_INCREMENT\\": {
                    \\"low\\": 10,
                    \\"high\\": 0
                },
                \\"auth\\": {
                    \\"isAuthenticated\\": false,
                    \\"roles\\": []
                },
                \\"updateActors\\": {
                    \\"args\\": {
                        \\"update\\": {
                            \\"actedIn\\": [
                                {
                                    \\"update\\": {
                                        \\"node\\": {
                                            \\"viewers_INCREMENT\\": {
                                                \\"low\\": 10,
                                                \\"high\\": 0
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                \\"resolvedCallbacks\\": {}
            }"
        `);
    });

    test("Increment on relationship property", async () => {
        const query = gql`
            mutation Mutation {
                updateActors(update: { actedIn: [{ update: { edge: { pay_ADD: 100 } } }] }) {
                    actors {
                        name
                        actedIn {
                            title
                        }
                        actedInConnection {
                            edges {
                                pay
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
            "MATCH (this:Actor)
            WITH this
            OPTIONAL MATCH (this)-[this_acted_in0_relationship:ACTED_IN]->(this_actedIn0:Movie)
            CALL apoc.do.when(this_acted_in0_relationship IS NOT NULL, \\"
            WITH this_acted_in0_relationship, this
            CALL {
            WITH this_acted_in0_relationship
            CALL apoc.util.validate(apoc.meta.type(this_acted_in0_relationship.pay) = \\\\\\"NULL\\\\\\", 'Cannot %s %s to Nan', [\\\\\\"_ADD\\\\\\", $updateActors.args.update.actedIn[0].update.edge.pay_ADD])
            CALL apoc.util.validate(this_acted_in0_relationship.pay + $updateActors.args.update.actedIn[0].update.edge.pay_ADD > 2^63-1, 'Overflow: Value returned from operator %s is larger than %s bit', [\\\\\\"_ADD\\\\\\", \\\\\\"64\\\\\\"])
            CALL apoc.util.validate(apoc.meta.type(this_acted_in0_relationship.pay + $updateActors.args.update.actedIn[0].update.edge.pay_ADD) <> \\\\\\"FLOAT\\\\\\", 'Type Mismatch: Value returned from operator %s does not match: %s', [\\\\\\"_ADD\\\\\\", \\\\\\"Float\\\\\\"])
            SET this_acted_in0_relationship.pay = this_acted_in0_relationship.pay + $updateActors.args.update.actedIn[0].update.edge.pay_ADD
            RETURN this_acted_in0_relationship as this_acted_in0_relationship_pay__ADD
            }
            RETURN count(*) AS _
            \\", \\"\\", {this:this, this_acted_in0_relationship:this_acted_in0_relationship, updateActors: $updateActors, resolvedCallbacks: $resolvedCallbacks})
            YIELD value AS this_acted_in0_relationship_actedIn0_edge
            WITH this
            CALL {
            WITH this
            MATCH (this)-[this_acted_in_relationship:ACTED_IN]->(this_movie:Movie)
            WITH collect({ pay: this_acted_in_relationship.pay }) AS edges
            RETURN { edges: edges, totalCount: size(edges) } AS actedInConnection
            }
            RETURN collect(DISTINCT this { .name, actedIn: [ (this)-[:ACTED_IN]->(this_actedIn:Movie)   | this_actedIn { .title } ], actedInConnection }) AS data"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"updateActors\\": {
                    \\"args\\": {
                        \\"update\\": {
                            \\"actedIn\\": [
                                {
                                    \\"update\\": {
                                        \\"edge\\": {
                                            \\"pay_ADD\\": 100
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                \\"resolvedCallbacks\\": {}
            }"
        `);
    });

    test("Increment on interface property", async () => {
        const query = gql`
            mutation {
                updateActors(update: { marriedWith: { update: { node: { marriageLength_INCREMENT: 1 } } } }) {
                    actors {
                        name
                        marriedWith {
                            marriageLength
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
            "MATCH (this:Actor)
            WITH this
            CALL {
            WITH this
            OPTIONAL MATCH (this)-[this_married_with0_relationship:MARRIED_WITH]->(this_marriedWith0:Star)
            CALL apoc.do.when(this_marriedWith0 IS NOT NULL, \\"
            WITH this_marriedWith0, this
            CALL {
            WITH this_marriedWith0
            CALL apoc.util.validate(apoc.meta.type(this_marriedWith0.marriageLength) = \\\\\\"NULL\\\\\\", 'Cannot %s %s to Nan', [\\\\\\"_INCREMENT\\\\\\", $this_update_marriedWith0_marriageLength_INCREMENT])
            CALL apoc.util.validate(this_marriedWith0.marriageLength + $this_update_marriedWith0_marriageLength_INCREMENT > 2^31-1, 'Overflow: Value returned from operator %s is larger than %s bit', [\\\\\\"_INCREMENT\\\\\\", \\\\\\"32\\\\\\"])
            CALL apoc.util.validate(apoc.meta.type(this_marriedWith0.marriageLength + $this_update_marriedWith0_marriageLength_INCREMENT) <> \\\\\\"INTEGER\\\\\\", 'Type Mismatch: Value returned from operator %s does not match: %s', [\\\\\\"_INCREMENT\\\\\\", \\\\\\"Int\\\\\\"])
            SET this_marriedWith0.marriageLength = this_marriedWith0.marriageLength + $this_update_marriedWith0_marriageLength_INCREMENT
            RETURN this_marriedWith0 as this_marriedWith0_marriageLength__INCREMENT
            }
            WITH this, this_marriedWith0
            CALL {
            	WITH this_marriedWith0
            	MATCH (this_marriedWith0)<-[this_marriedWith0_marriedWith_Actor_unique:MARRIED_WITH]-(:Actor)
            	WITH count(this_marriedWith0_marriedWith_Actor_unique) as c
            	CALL apoc.util.validate(NOT (c <= 1), '@neo4j/graphql/RELATIONSHIP-REQUIREDStar.marriedWith must be less than or equal to one', [0])
            	RETURN c AS this_marriedWith0_marriedWith_Actor_unique_ignored
            }
            RETURN count(*) AS _
            \\", \\"\\", {this:this, updateActors: $updateActors, this_marriedWith0:this_marriedWith0, auth:$auth,this_update_marriedWith0_marriageLength_INCREMENT:$this_update_marriedWith0_marriageLength_INCREMENT})
            YIELD value AS _
            RETURN count(*) AS _
            }
            WITH this
            CALL {
            WITH this
            MATCH (this)-[:MARRIED_WITH]->(this_Star:Star)
            RETURN { __resolveType: \\"Star\\", marriageLength: this_Star.marriageLength } AS marriedWith
            }
            RETURN collect(DISTINCT this { .name, marriedWith: marriedWith }) AS data"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_update_marriedWith0_marriageLength_INCREMENT\\": {
                    \\"low\\": 1,
                    \\"high\\": 0
                },
                \\"auth\\": {
                    \\"isAuthenticated\\": false,
                    \\"roles\\": []
                },
                \\"updateActors\\": {
                    \\"args\\": {
                        \\"update\\": {
                            \\"marriedWith\\": {
                                \\"update\\": {
                                    \\"node\\": {
                                        \\"marriageLength_INCREMENT\\": {
                                            \\"low\\": 1,
                                            \\"high\\": 0
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

    test("Increment on interface implementation property", async () => {
        const query = gql`
            mutation {
                updateActors(
                    update: { marriedWith: { update: { node: { _on: { Star: { marriageLength_INCREMENT: 1 } } } } } }
                ) {
                    actors {
                        name
                        marriedWith {
                            marriageLength
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
            "MATCH (this:Actor)
            WITH this
            CALL {
            WITH this
            OPTIONAL MATCH (this)-[this_married_with0_relationship:MARRIED_WITH]->(this_marriedWith0:Star)
            CALL apoc.do.when(this_marriedWith0 IS NOT NULL, \\"
            WITH this, this_marriedWith0
            CALL {
            	WITH this_marriedWith0
            	MATCH (this_marriedWith0)<-[this_marriedWith0_marriedWith_Actor_unique:MARRIED_WITH]-(:Actor)
            	WITH count(this_marriedWith0_marriedWith_Actor_unique) as c
            	CALL apoc.util.validate(NOT (c <= 1), '@neo4j/graphql/RELATIONSHIP-REQUIREDStar.marriedWith must be less than or equal to one', [0])
            	RETURN c AS this_marriedWith0_marriedWith_Actor_unique_ignored
            }
            WITH this_marriedWith0, this
            CALL {
            WITH this_marriedWith0
            CALL apoc.util.validate(apoc.meta.type(this_marriedWith0.marriageLength) = \\\\\\"NULL\\\\\\", 'Cannot %s %s to Nan', [\\\\\\"_INCREMENT\\\\\\", $this_update_marriedWith0_on_Star_marriageLength_INCREMENT])
            CALL apoc.util.validate(this_marriedWith0.marriageLength + $this_update_marriedWith0_on_Star_marriageLength_INCREMENT > 2^31-1, 'Overflow: Value returned from operator %s is larger than %s bit', [\\\\\\"_INCREMENT\\\\\\", \\\\\\"32\\\\\\"])
            CALL apoc.util.validate(apoc.meta.type(this_marriedWith0.marriageLength + $this_update_marriedWith0_on_Star_marriageLength_INCREMENT) <> \\\\\\"INTEGER\\\\\\", 'Type Mismatch: Value returned from operator %s does not match: %s', [\\\\\\"_INCREMENT\\\\\\", \\\\\\"Int\\\\\\"])
            SET this_marriedWith0.marriageLength = this_marriedWith0.marriageLength + $this_update_marriedWith0_on_Star_marriageLength_INCREMENT
            RETURN this_marriedWith0 as this_marriedWith0_marriageLength__INCREMENT
            }
            RETURN count(*) AS _
            \\", \\"\\", {this:this, updateActors: $updateActors, this_marriedWith0:this_marriedWith0, auth:$auth,this_update_marriedWith0_on_Star_marriageLength_INCREMENT:$this_update_marriedWith0_on_Star_marriageLength_INCREMENT})
            YIELD value AS _
            RETURN count(*) AS _
            }
            WITH this
            CALL {
            WITH this
            MATCH (this)-[:MARRIED_WITH]->(this_Star:Star)
            RETURN { __resolveType: \\"Star\\", marriageLength: this_Star.marriageLength } AS marriedWith
            }
            RETURN collect(DISTINCT this { .name, marriedWith: marriedWith }) AS data"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"auth\\": {
                    \\"isAuthenticated\\": false,
                    \\"roles\\": []
                },
                \\"this_update_marriedWith0_on_Star_marriageLength_INCREMENT\\": {
                    \\"low\\": 1,
                    \\"high\\": 0
                },
                \\"updateActors\\": {
                    \\"args\\": {
                        \\"update\\": {
                            \\"marriedWith\\": {
                                \\"update\\": {
                                    \\"node\\": {
                                        \\"_on\\": {
                                            \\"Star\\": {
                                                \\"marriageLength_INCREMENT\\": {
                                                    \\"low\\": 1,
                                                    \\"high\\": 0
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
});
