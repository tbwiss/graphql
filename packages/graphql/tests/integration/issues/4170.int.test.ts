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

import type { Driver } from "neo4j-driver";
import Neo4j from "../neo4j";
import { Neo4jGraphQL } from "../../../src/classes";
import gql from "graphql-tag";
import { graphql } from "graphql";

describe("https://github.com/neo4j/graphql/issues/4170", () => {
    let driver: Driver;
    let neo4j: Neo4j;

    const typeDefs = gql`
        type JWT @jwt {
            id: String
            roles: [String]
        }
        type User @authorization(validate: [{ where: { node: { userId: "$jwt.id" } }, operations: [READ] }]) {
            userId: String! @unique
            adminAccess: [Tenant!]! @relationship(type: "ADMIN_IN", direction: OUT)
        }

        type Tenant @authorization(validate: [{ where: { node: { admins: { userId: "$jwt.id" } } } }]) {
            id: ID! @id
            settings: Settings! @relationship(type: "HAS_SETTINGS", direction: OUT)
            admins: [User!]! @relationship(type: "ADMIN_IN", direction: IN)
        }

        type Settings @authorization(validate: [{ where: { node: { tenant: { admins: { userId: "$jwt.id" } } } } }]) {
            id: ID! @id
            tenant: Tenant! @relationship(type: "HAS_SETTINGS", direction: IN)
            openingDays: [OpeningDay!]! @relationship(type: "VALID_OPENING_DAYS", direction: OUT)
            name: String
        }

        type OpeningDay
            @authorization(
                validate: [{ where: { node: { settings: { tenant: { admins: { userId: "$jwt.id" } } } } } }]
            ) {
            id: ID! @id
            settings: Settings @relationship(type: "VALID_GARAGES", direction: IN)
            open: [OpeningHoursInterval!]! @relationship(type: "HAS_OPEN_INTERVALS", direction: OUT)
        }

        type OpeningHoursInterval
            @authorization(
                validate: [
                    { where: { node: { openingDay: { settings: { tenant: { admins: { userId: "$jwt.id" } } } } } } }
                ]
            ) {
            name: String
            openingDay: OpeningDay! @relationship(type: "HAS_OPEN_INTERVALS", direction: IN)
            updatedBy: String @populatedBy(callback: "getUserIDFromContext", operations: [CREATE, UPDATE])
        }
    `;

    const ADD_TENANT = `
        mutation addTenant($input: [TenantCreateInput!]!) {
            createTenants(input: $input) {
                tenants {
                    id
                    admins {
                        userId
                    }
                }
            }
        }
    `;

    let tenantVariables: Record<string, any>;
    let myUserId: string;

    beforeAll(async () => {
        neo4j = new Neo4j();
        driver = await neo4j.getDriver();
    });

    beforeEach(() => {
        myUserId = Math.random().toString(36).slice(2, 7);
        tenantVariables = {
            input: {
                admins: {
                    create: {
                        node: { userId: myUserId },
                    },
                },
                settings: {
                    create: {
                        node: {
                            openingDays: {
                                create: {
                                    node: {
                                        open: {
                                            create: {
                                                node: {
                                                    name: "lambo",
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        };
    });

    afterEach(async () => {
        const session = driver.session();
        await session.run(` match (n) detach delete n`);
        await session.close();
    });

    afterAll(async () => {
        await driver.close();
    });
    test("create tenant with nested openingDays and openHoursInterval - subscriptions disabled", async () => {
        const neo4jGraphql = new Neo4jGraphQL({
            typeDefs,
            driver,
            features: {
                populatedBy: {
                    callbacks: {
                        getUserIDFromContext: () => "hi",
                    },
                },
            },
        });
        const schema = await neo4jGraphql.getSchema();

        const addTenantResponse = await graphql({
            schema,
            source: ADD_TENANT,
            variableValues: tenantVariables,
            contextValue: neo4j.getContextValues({ jwt: { id: myUserId } }),
        });

        expect(addTenantResponse.errors?.[0]?.message).toContain("Forbidden");
    });

    test("create tenant with nested openingDays and openHoursInterval - subscriptions enabled", async () => {
        const neo4jGraphql = new Neo4jGraphQL({
            typeDefs,
            driver,
            features: {
                subscriptions: true,
                populatedBy: {
                    callbacks: {
                        getUserIDFromContext: () => "hi",
                    },
                },
            },
        });
        const schema = await neo4jGraphql.getSchema();

        const addTenantResponse = await graphql({
            schema,
            source: ADD_TENANT,
            variableValues: tenantVariables,
            contextValue: neo4j.getContextValues({ jwt: { id: myUserId } }),
        });

        expect(addTenantResponse.errors?.[0]?.message).toContain("Forbidden");
    });
});
