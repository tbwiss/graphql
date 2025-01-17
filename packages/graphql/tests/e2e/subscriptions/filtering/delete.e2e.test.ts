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

import type { Response } from "supertest";
import supertest from "supertest";
import { delay } from "../../../../src/utils/utils";
import type { UniqueType } from "../../../utils/graphql-types";
import { TestHelper } from "../../../utils/tests-helper";
import type { TestGraphQLServer } from "../../setup/apollo-server";
import { ApolloTestServer } from "../../setup/apollo-server";
import { WebSocketTestClient } from "../../setup/ws-client";

describe("Delete Subscription", () => {
    const testHelper = new TestHelper({ cdc: true });
    let server: TestGraphQLServer;
    let wsClient: WebSocketTestClient;
    let typeMovie: UniqueType;

    beforeAll(async () => {
        await testHelper.assertCDCEnabled();
    });

    beforeEach(async () => {
        typeMovie = testHelper.createUniqueType("Movie");
        const typeDefs = `
        type ${typeMovie} @node {
            id: ID
            title: String
            releasedIn: Int
            averageRating: Float
            fileSize: BigInt
            isFavorite: Boolean
            similarTitles: [String]
        }
        `;

        const neoSchema = await testHelper.initNeo4jGraphQL({
            typeDefs,
            features: {
                subscriptions: await testHelper.getSubscriptionEngine(),
            },
        });

        // eslint-disable-next-line @typescript-eslint/require-await
        server = new ApolloTestServer(neoSchema, async ({ req }) => ({
            sessionConfig: {
                database: testHelper.database,
            },
            token: req.headers.authorization,
        }));
        await server.start();

        wsClient = new WebSocketTestClient(server.wsPath);
    });

    afterEach(async () => {
        await wsClient.close();
        await server.close();
        await testHelper.close();
    });

    test("create subscription with where OR", async () => {
        await wsClient.subscribe(`
            subscription {
                ${typeMovie.operations.subscribe.deleted}(where: { OR: [{ title_EQ: "movie1"}, {title_EQ: "movie2"}] }) {
                    ${typeMovie.operations.subscribe.payload.deleted} {
                        title
                    }
                }
            }
        `);

        await createMovie({ title: "movie1", releasedIn: 2020 });
        await createMovie({ title: "movie2", releasedIn: 2000 });

        await deleteMovie("title", "movie1");
        await deleteMovie("title", "movie2");

        await wsClient.waitForEvents(2);

        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toIncludeSameMembers([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "movie1" },
                },
            },

            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "movie2" },
                },
            },
        ]);
    });
    test("create subscription with where AND match 1", async () => {
        await wsClient.subscribe(`
            subscription {
                ${typeMovie.operations.subscribe.deleted}(where: { AND: [{ title_EQ: "movie2"}, {releasedIn_EQ: 2000}] }) {
                    ${typeMovie.operations.subscribe.payload.deleted} {
                        title
                    }
                }
            }
        `);

        await createMovie({ title: "movie1", releasedIn: 2020 });
        await createMovie({ title: "movie2", releasedIn: 2000 });

        await deleteMovie("title", "movie1");
        await deleteMovie("title", "movie2");

        await wsClient.waitForEvents(1);

        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toIncludeSameMembers([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "movie2" },
                },
            },
        ]);
    });
    test("create subscription with where OR match 1", async () => {
        await wsClient.subscribe(`
            subscription {
                ${typeMovie.operations.subscribe.deleted}(where: { OR: [{ title_EQ: "movie2", releasedIn_EQ: 2020}, {releasedIn_EQ: 2000}] }) {
                    ${typeMovie.operations.subscribe.payload.deleted} {
                        title
                    }
                }
            }
        `);

        await createMovie({ title: "movie1", releasedIn: 2020 });
        await createMovie({ title: "movie2", releasedIn: 2000 });

        await deleteMovie("title", "movie1");
        await deleteMovie("title", "movie2");

        await wsClient.waitForEvents(1);

        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toIncludeSameMembers([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "movie2" },
                },
            },
        ]);
    });
    test("create subscription with where OR match 2", async () => {
        await wsClient.subscribe(`
            subscription {
                ${typeMovie.operations.subscribe.deleted}(where: { OR: [{ title_EQ: "movie2", releasedIn_EQ: 2000}, {title_EQ: "movie1", releasedIn_EQ: 2020}] }) {
                    ${typeMovie.operations.subscribe.payload.deleted} {
                        title
                    }
                }
            }
        `);

        await createMovie({ title: "movie1", releasedIn: 2020 });
        await createMovie({ title: "movie2", releasedIn: 2000 });

        await deleteMovie("title", "movie1");
        await deleteMovie("title", "movie2");

        await wsClient.waitForEvents(2);

        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toIncludeSameMembers([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "movie1" },
                },
            },
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "movie2" },
                },
            },
        ]);
    });
    test("create subscription with where property + OR match 1", async () => {
        await wsClient.subscribe(`
            subscription {
                ${typeMovie.operations.subscribe.deleted}(where: { title_EQ: "movie3", OR: [{ releasedIn_EQ: 2001}, {title_EQ: "movie2", releasedIn_EQ: 2020}] }) {
                    ${typeMovie.operations.subscribe.payload.deleted} {
                        title
                    }
                }
            }
        `);

        await createMovie({ title: "movie1", releasedIn: 2020 });
        await createMovie({ title: "movie2", releasedIn: 2000 });
        await createMovie({ title: "movie3", releasedIn: 2001 });

        await deleteMovie("title", "movie1");
        await deleteMovie("title", "movie2");
        await deleteMovie("title", "movie3");

        await wsClient.waitForEvents(1);

        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toIncludeSameMembers([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "movie3" },
                },
            },
        ]);
    });
    test("create subscription with where property + OR match nothing", async () => {
        await wsClient.subscribe(`
            subscription {
                ${typeMovie.operations.subscribe.deleted}(where: { title_EQ: "movie2", OR: [{ releasedIn_EQ: 2001}, {title_EQ: "movie2", releasedIn_EQ: 2020}] }) {
                    ${typeMovie.operations.subscribe.payload.deleted} {
                        title
                    }
                }
            }
        `);

        await createMovie({ title: "movie1", releasedIn: 2020 });
        await createMovie({ title: "movie2", releasedIn: 2000 });
        await createMovie({ title: "movie3", releasedIn: 2001 });

        await deleteMovie("title", "movie1");
        await deleteMovie("title", "movie2");
        await deleteMovie("title", "movie3");

        // forcing a delay to ensure events do not exist
        await delay(2);
        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toEqual([]);
    });
    test("create subscription with where property + OR with filters match 1", async () => {
        await wsClient.subscribe(`
            subscription {
                ${typeMovie.operations.subscribe.deleted}(where: { releasedIn_GTE: 2000, OR: [{ NOT: { title_STARTS_WITH: "movie" }, releasedIn_EQ: 2001}, {title_EQ: "movie4", releasedIn_EQ: 1000}] }) {
                    ${typeMovie.operations.subscribe.payload.deleted} {
                        title
                    }
                }
            }
        `);

        await createMovie({ title: "movie1", releasedIn: 2000 });
        await createMovie({ title: "movie2", releasedIn: 2020 });
        await createMovie({ title: "movie3", releasedIn: 2000 });
        await createMovie({ title: "movie4", releasedIn: 1000 });
        await createMovie({ title: "dummy-movie", releasedIn: 2001 });

        await deleteMovie("title", "movie1");
        await deleteMovie("title", "movie2");
        await deleteMovie("title", "movie3");
        await deleteMovie("title", "movie4");
        await deleteMovie("title", "dummy-movie");

        await wsClient.waitForEvents(1);

        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toIncludeSameMembers([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "dummy-movie" },
                },
            },
        ]);
    });
    test("create subscription with where property + OR with filters match 2", async () => {
        await wsClient.subscribe(`
            subscription {
                ${typeMovie.operations.subscribe.deleted}(where: { releasedIn_GTE: 2000, OR: [{ title_STARTS_WITH: "moviee", releasedIn_EQ: 2001}, {title_EQ: "amovie"}] }) {
                    ${typeMovie.operations.subscribe.payload.deleted} {
                        title
                    }
                }
            }
        `);

        await createMovie({ title: "movie1", releasedIn: 2000 });
        await createMovie({ title: "amovie", releasedIn: 2020 });
        await createMovie({ title: "movie3", releasedIn: 2000 });
        await createMovie({ title: "movie4", releasedIn: 1000 });
        await createMovie({ title: "movie5", releasedIn: 2001 });
        await createMovie({ title: "moviee1", releasedIn: 2001 });
        await createMovie({ title: "moviee2", releasedIn: 2021 });

        await deleteMovie("title", "movie1");
        await deleteMovie("title", "amovie");
        await deleteMovie("title", "movie3");
        await deleteMovie("title", "movie4");
        await deleteMovie("title", "movie5");
        await deleteMovie("title", "moviee1");
        await deleteMovie("title", "moviee2");

        await wsClient.waitForEvents(2);

        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toIncludeSameMembers([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "moviee1" },
                },
            },
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "amovie" },
                },
            },
        ]);
    });
    test("create subscription with where property + OR with filters match none", async () => {
        await wsClient.subscribe(`
            subscription {
                ${typeMovie.operations.subscribe.deleted}(where: { releasedIn_GTE: 2000, OR: [{ title_STARTS_WITH: "moviee", releasedIn_EQ: 2001}, {title_EQ: "amovie", releasedIn_GT: 2020}] }) {
                    ${typeMovie.operations.subscribe.payload.deleted} {
                        title
                    }
                }
            }
        `);

        await createMovie({ title: "movie1", releasedIn: 2000 });
        await createMovie({ title: "amovie", releasedIn: 2019 });
        await createMovie({ title: "movie3", releasedIn: 2000 });
        await createMovie({ title: "movie4", releasedIn: 1000 });
        await createMovie({ title: "movie5", releasedIn: 2001 });
        await createMovie({ title: "moviee2", releasedIn: 2021 });

        await deleteMovie("title", "movie1");
        await deleteMovie("title", "amovie");
        await deleteMovie("title", "movie3");
        await deleteMovie("title", "movie4");
        await deleteMovie("title", "movie5");
        await deleteMovie("title", "moviee2");

        // forcing a delay to ensure events do not exist
        await delay(2);
        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toIncludeSameMembers([]);
    });
    test("create subscription with where OR single element match", async () => {
        await wsClient.subscribe(`
        subscription {
            ${typeMovie.operations.subscribe.deleted}(where: { OR: [{ title_EQ: "movie1"}] }) {
                ${typeMovie.operations.subscribe.payload.deleted} {
                    title
                }
            }
        }
    `);

        await createMovie({ title: "movie1", releasedIn: 2020 });
        await createMovie({ title: "movie2", releasedIn: 2000 });

        await deleteMovie("title", "movie1");
        await deleteMovie("title", "movie2");

        await wsClient.waitForEvents(1);

        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toIncludeSameMembers([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "movie1" },
                },
            },
        ]);
    });
    test("create subscription with where OR single element no match", async () => {
        await wsClient.subscribe(`
        subscription {
            ${typeMovie.operations.subscribe.deleted}(where: { OR: [{ title_EQ: "movie1"}] }) {
                ${typeMovie.operations.subscribe.payload.deleted} {
                    title
                }
            }
        }
    `);

        await createMovie({ title: "movie3", releasedIn: 2020 });
        await createMovie({ title: "movie2", releasedIn: 2000 });

        await deleteMovie("title", "movie3");
        await deleteMovie("title", "movie2");

        // forcing a delay to ensure events do not exist
        await delay(2);
        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toIncludeSameMembers([]);
    });
    test("create subscription with where OR nested match 1", async () => {
        await wsClient.subscribe(`
        subscription {
            ${typeMovie.operations.subscribe.deleted}(where: {
                OR: [
                    { title_EQ: "movie1" },
                    { AND: [
                        { title_EQ: "movie2" },
                        { title_EQ: "movie3" }
                    ]}
                ]
            }) {
                ${typeMovie.operations.subscribe.payload.deleted} {
                    title
                }
            }
        }
    `);

        await createMovie({ title: "movie1", releasedIn: 2020 });
        await createMovie({ title: "movie2", releasedIn: 2000 });

        await deleteMovie("title", "movie1");
        await deleteMovie("title", "movie2");

        await wsClient.waitForEvents(1);

        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toIncludeSameMembers([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "movie1" },
                },
            },
        ]);
    });
    test("create subscription with where OR nested match some", async () => {
        await wsClient.subscribe(`
        subscription {
            ${typeMovie.operations.subscribe.deleted}(where: {
                OR: [
                    { title_EQ: "movie1" },
                    { AND: [
                        { title_EQ: "movie2" },
                        { releasedIn_EQ: 2000 }
                    ]}
                ]
            }) {
                ${typeMovie.operations.subscribe.payload.deleted} {
                    title
                }
            }
        }
    `);

        await createMovie({ title: "movie1", releasedIn: 2020 });
        await createMovie({ title: "movie2", releasedIn: 2000 });
        await createMovie({ title: "movie2", releasedIn: 2002 });

        await deleteMovie("title", "movie1");
        await deleteMovie("title", "movie2");

        await wsClient.waitForEvents(2);

        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toIncludeSameMembers([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "movie1" },
                },
            },
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "movie2" },
                },
            },
        ]);
    });
    test("create subscription with where OR nested match all", async () => {
        await wsClient.subscribe(`
        subscription {
            ${typeMovie.operations.subscribe.deleted}(where: {
                OR: [
                    { title_EQ: "movie1" },
                    { AND: [
                        { title_EQ: "movie2" },
                        { releasedIn_GTE: 2000 }
                    ]}
                ]
            }) {
                ${typeMovie.operations.subscribe.payload.deleted} {
                    title
                }
            }
        }
    `);

        await createMovie({ title: "movie1", releasedIn: 2020 });
        await createMovie({ title: "movie2", releasedIn: 2000 });
        await createMovie({ title: "movie2", releasedIn: 2002 });

        await deleteMovie("title", "movie1");
        await deleteMovie("title", "movie2");

        await wsClient.waitForEvents(3);

        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toIncludeSameMembers([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "movie1" },
                },
            },
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "movie2" },
                },
            },
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "movie2" },
                },
            },
        ]);
    });

    // all but boolean types
    test("subscription with IN on String", async () => {
        await wsClient.subscribe(`
            subscription {
                ${typeMovie.operations.subscribe.deleted}(where: { title_IN: ["abc", "sth"] }) {
                    ${typeMovie.operations.subscribe.payload.deleted} {
                        title
                    }
                }
            }
        `);

        await createMovie({ title: "abc" });
        await createMovie({ title: "something" });

        await deleteMovie("title", "abc");
        await deleteMovie("title", "something");

        await wsClient.waitForEvents(1);

        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toEqual([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "abc" },
                },
            },
        ]);
    });

    test("subscription with IN on ID as String", async () => {
        await wsClient.subscribe(`
            subscription {
                ${typeMovie.operations.subscribe.deleted}(where: { id_IN: ["id1", "id11"] }) {
                    ${typeMovie.operations.subscribe.payload.deleted} {
                        id
                    }
                }
            }
   `);

        await createMovie({ id: "id1" });
        await createMovie({ id: "id111" });

        await deleteMovie("id", "id1");
        await deleteMovie("id", "id11");

        await wsClient.waitForEvents(1);

        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toEqual([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { id: "id1" },
                },
            },
        ]);
    });

    test("subscription with IN on ID as Int", async () => {
        await wsClient.subscribe(`
            subscription {
                ${typeMovie.operations.subscribe.deleted}(where: { id_IN: [42, 420] }) {
                    ${typeMovie.operations.subscribe.payload.deleted} {
                        id
                    }
                }
            }
        `);

        await createMovie({ id: 420 });
        await createMovie({ id: 42 });

        await deleteMovie("id", 420);
        await deleteMovie("id", 42);

        await wsClient.waitForEvents(2);

        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toEqual([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { id: "420" },
                },
            },
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { id: "42" },
                },
            },
        ]);
    });

    test("subscription with IN on Int", async () => {
        await wsClient.subscribe(`
            subscription {
                ${typeMovie.operations.subscribe.deleted}(where: { releasedIn_IN: [2020, 2021] }) {
                    ${typeMovie.operations.subscribe.payload.deleted} {
                        releasedIn
                    }
                }
            }
        `);

        await createMovie({ releasedIn: 2020 });
        await createMovie({ releasedIn: 2022 });

        await deleteMovie("releasedIn", 2020);
        await deleteMovie("releasedIn", 2022);

        await wsClient.waitForEvents(1);

        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toEqual([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { releasedIn: 2020 },
                },
            },
        ]);
    });

    test("subscription with IN on Float", async () => {
        await wsClient.subscribe(`
            subscription {
                ${typeMovie.operations.subscribe.deleted}(where: { averageRating_IN: [4.2, 4.20] }) {
                    ${typeMovie.operations.subscribe.payload.deleted} {
                        averageRating
                    }
                }
            }
        `);

        await createMovie({ averageRating: 4.2 });
        await createMovie({ averageRating: 10 });

        await deleteMovie("averageRating", 4.2);
        await deleteMovie("averageRating", 10);

        await wsClient.waitForEvents(1);

        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toEqual([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { averageRating: 4.2 },
                },
            },
        ]);
    });

    test("subscription with IN on BigInt", async () => {
        await wsClient.subscribe(`
            subscription {
                ${typeMovie.operations.subscribe.deleted}(where: { fileSize_IN: ["922372036854775608"] }) {
                    ${typeMovie.operations.subscribe.payload.deleted} {
                        fileSize
                    }
                }
            }
        `);

        await createMovie({ fileSize: "922372036854775608" });
        await createMovie({ fileSize: "100" });

        await deleteMovie("fileSize", "922372036854775608");
        await deleteMovie("fileSize", "100");

        await wsClient.waitForEvents(1);

        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toEqual([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { fileSize: "922372036854775608" },
                },
            },
        ]);
    });

    test("subscription with IN on Boolean should error", async () => {
        const onReturnError = jest.fn();
        await wsClient.subscribe(
            `
            subscription {
                ${typeMovie.operations.subscribe.deleted}(where: { isFavorite_IN: [true] }) {
                    ${typeMovie.operations.subscribe.payload.deleted} {
                        isFavorite
                    }
                }
            }
        `,
            onReturnError
        );

        await createMovie({ title: "some_movie1", isFavorite: true });
        await createMovie({ title: "some_movie2", isFavorite: true });

        await deleteMovie("title", "some_movie1");
        await deleteMovie("title", "some_movie2");

        expect(onReturnError).toHaveBeenCalled();
        expect(wsClient.events).toEqual([]);
    });

    test("subscription with IN on Array should error", async () => {
        const onReturnError = jest.fn();
        await wsClient.subscribe(
            `
            subscription {
                ${typeMovie.operations.subscribe.deleted}(where: { similarTitles_IN: ["fight club"] }) {
                    ${typeMovie.operations.subscribe.payload.deleted} {
                        similarTitles
                    }
                }
            }
        `,
            onReturnError
        );

        await createMovie({ title: "some_movie1", similarTitles: ["fight club"] });
        await createMovie({ title: "some_movie2" });

        await deleteMovie("title", "some_movie1");
        await deleteMovie("title", "some_movie2");

        expect(onReturnError).toHaveBeenCalled();
        expect(wsClient.events).toEqual([]);
    });

    // NOT Operator tests
    test("delete subscription with where NOT operator 1 result", async () => {
        await wsClient.subscribe(`
            subscription {
                ${typeMovie.operations.subscribe.deleted}(where: { NOT: { title_EQ: "movie3" } }) {
                    ${typeMovie.operations.subscribe.payload.deleted} {
                        title
                    }
                }
            }
        `);

        await createMovie({ title: "movie3" });
        await createMovie({ title: "movie4" });

        await deleteMovie("title", "movie3");
        await deleteMovie("title", "movie4");

        await wsClient.waitForEvents(1);

        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toEqual([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "movie4" },
                },
            },
        ]);
    });
    test("create subscription with where OR nested NOT OR match 1", async () => {
        await wsClient.subscribe(`
        subscription {
            ${typeMovie.operations.subscribe.deleted}(where: {
                OR: [
                    { title_EQ: "movie1" },
                    { 
                        NOT: { 
                            OR: [
                                { title_EQ: "movie2" },
                                { title_EQ: "movie3" }
                            ]
                        }
                    }
                ]
            }) {
                ${typeMovie.operations.subscribe.payload.deleted} {
                    title
                }
            }
        }
    `);

        await createMovie({ title: "movie1", releasedIn: 2020 });
        await createMovie({ title: "movie2", releasedIn: 2000 });

        await deleteMovie("title", "movie1");
        await deleteMovie("title", "movie2");

        await wsClient.waitForEvents(1);

        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toIncludeSameMembers([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { title: "movie1" },
                },
            },
        ]);
    });
    test("subscription with NOT IN on Int", async () => {
        await wsClient.subscribe(`
        subscription {
            ${typeMovie.operations.subscribe.deleted}(where: { NOT: { releasedIn_IN: [2020, 2000] } }) {
                ${typeMovie.operations.subscribe.payload.deleted} {
                    releasedIn
                }
            }
           }
        `);

        await createMovie({ releasedIn: 2001 });
        await createMovie({ releasedIn: 2000 });

        await deleteMovie("releasedIn", 2001);
        await deleteMovie("releasedIn", 2000);

        await wsClient.waitForEvents(1);

        expect(wsClient.errors).toEqual([]);
        expect(wsClient.events).toEqual([
            {
                [typeMovie.operations.subscribe.deleted]: {
                    [typeMovie.operations.subscribe.payload.deleted]: { releasedIn: 2001 },
                },
            },
        ]);
    });

    const makeTypedFieldValue = (value) => {
        if (typeof value === "string") {
            return `"${value}"`;
        }
        if (Array.isArray(value)) {
            return `[${value.map(makeTypedFieldValue)}]`;
        }
        return value;
    };
    async function createMovie(all: {
        id?: string | number;
        title?: string;
        releasedIn?: number;
        averageRating?: number;
        fileSize?: string;
        isFavorite?: boolean;
        similarTitles?: string[];
    }): Promise<Response> {
        const movieInput = Object.entries(all)
            .filter(([, v]) => v)
            .map(([k, v]) => {
                return `${k}: ${makeTypedFieldValue(v)}`;
            })
            .join(", ");

        const result = await supertest(server.path)
            .post("")
            .send({
                query: `
                    mutation {
                        ${typeMovie.operations.create}(input: [{ ${movieInput} }]) {
                            ${typeMovie.plural} {
                                id
                                title
                                releasedIn
                                averageRating
                                fileSize
                                isFavorite
                                similarTitles
                            }
                        }
                    }
                `,
            })
            .expect(200);
        return result;
    }

    async function deleteMovie(fieldName: string, value: number | string): Promise<Response> {
        const result = await supertest(server.path)
            .post("")
            .send({
                query: `
                    mutation {
                        ${typeMovie.operations.delete}(where: { ${fieldName}_EQ: ${makeTypedFieldValue(value)} }) {
                            nodesDeleted
                        }
                    }
                `,
            })
            .expect(200);
        return result;
    }
});
