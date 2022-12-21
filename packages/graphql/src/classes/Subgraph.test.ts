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

import { print } from "graphql";
import gql from "graphql-tag";
import { Subgraph } from "./Subgraph";

describe("Subgraph", () => {
    describe("findFederationLinkDirective", () => {
        test("can find link directive in schema definition", () => {
            const typeDefs = gql`
                type Query {
                    "The full list of locations presented by the Interplanetary Space Tourism department"
                    locations: [Location!]!
                    "The details of a specific location"
                    location(id: ID!): Location
                }

                type Location @key(fields: "id") {
                    id: ID!
                    "The name of the location"
                    name: String!
                    "A short description about the location"
                    description: String!
                    "The location's main photo as a URL"
                    photo: String!
                }

                schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key"]) {
                    query: Query
                }
            `;

            // @ts-ignore
            const plugin = new Subgraph(typeDefs, undefined);

            expect(plugin["findFederationLinkDirective"](typeDefs)?.name.value).toBe("link");
        });

        test("can find link directive in schema extension", () => {
            const typeDefs = gql`
                extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key"])

                type Query {
                    "The full list of locations presented by the Interplanetary Space Tourism department"
                    locations: [Location!]!
                    "The details of a specific location"
                    location(id: ID!): Location
                }

                type Location @key(fields: "id") {
                    id: ID!
                    "The name of the location"
                    name: String!
                    "A short description about the location"
                    description: String!
                    "The location's main photo as a URL"
                    photo: String!
                }
            `;

            // @ts-ignore
            const plugin = new Subgraph(typeDefs, undefined);

            expect(plugin["findFederationLinkDirective"](typeDefs)?.name.value).toBe("link");
        });

        test("returns undefined if link directive imports non-Federation schema", () => {
            const typeDefs = gql`
                extend schema
                    @link(
                        url: "https://example.com/otherSchema"
                        import: ["SomeType", "@someDirective", { name: "@someRenamedDirective", as: "@renamed" }]
                    )

                type Query {
                    "The full list of locations presented by the Interplanetary Space Tourism department"
                    locations: [Location!]!
                    "The details of a specific location"
                    location(id: ID!): Location
                }

                type Location {
                    id: ID!
                    "The name of the location"
                    name: String!
                    "A short description about the location"
                    description: String!
                    "The location's main photo as a URL"
                    photo: String!
                }
            `;

            // findFederationLinkDirective called in constructor
            // @ts-ignore
            expect(() => new Subgraph(typeDefs, undefined)).toThrow(
                "typeDefs must contain `@link` schema extension to be used with Apollo Federation"
            );
        });

        test("returns undefined if directive is not defined", () => {
            const typeDefs = gql`
                type Query {
                    "The full list of locations presented by the Interplanetary Space Tourism department"
                    locations: [Location!]!
                    "The details of a specific location"
                    location(id: ID!): Location
                }

                type Location {
                    id: ID!
                    "The name of the location"
                    name: String!
                    "A short description about the location"
                    description: String!
                    "The location's main photo as a URL"
                    photo: String!
                }
            `;

            // findFederationLinkDirective called in constructor
            // @ts-ignore
            expect(() => new Subgraph(typeDefs, undefined)).toThrow(
                "typeDefs must contain `@link` schema extension to be used with Apollo Federation"
            );
        });
    });

    describe("parseLinkImportArgument", () => {
        test("parses valid directive", () => {
            const typeDefs = gql`
                extend schema
                    @link(
                        url: "https://specs.apollo.dev/federation/v2.0"
                        import: [
                            "@key"
                            { name: "@shareable", as: "@shared" }
                            { name: "@external", as: "@ext" }
                            "@requires"
                        ]
                    )

                type Query {
                    "The full list of locations presented by the Interplanetary Space Tourism department"
                    locations: [Location!]!
                    "The details of a specific location"
                    location(id: ID!): Location
                }

                type Location @key(fields: "id") {
                    id: ID!
                    "The name of the location"
                    name: String!
                    "A short description about the location"
                    description: String!
                    "The location's main photo as a URL"
                    photo: String!
                }
            `;

            // @ts-ignore
            const plugin = new Subgraph(typeDefs, undefined);

            const directive = plugin["findFederationLinkDirective"](typeDefs);
            expect(directive).toBeDefined();

            plugin["parseLinkImportArgument"](directive);

            expect(plugin["importArgument"]).toEqual(
                new Map([
                    ["@key", "@key"],
                    ["@shareable", "@shared"],
                    ["@inaccessible", "@federation__inaccessible"],
                    ["@override", "@federation__override"],
                    ["@external", "@ext"],
                    ["@provides", "@federation__provides"],
                    ["@requires", "@requires"],
                    ["@tag", "@federation__tag"],
                ])
            );
        });

        test("throws an error for invalid Federation directive", () => {
            const typeDefs = gql`
                extend schema
                    @link(
                        url: "https://specs.apollo.dev/federation/v2.0"
                        import: [
                            "@key"
                            { name: "@shareable", as: "@shared" }
                            { name: "@external", as: "@ext" }
                            "@banana"
                        ]
                    )

                type Query {
                    "The full list of locations presented by the Interplanetary Space Tourism department"
                    locations: [Location!]!
                    "The details of a specific location"
                    location(id: ID!): Location
                }

                type Location @key(fields: "id") {
                    id: ID!
                    "The name of the location"
                    name: String!
                    "A short description about the location"
                    description: String!
                    "The location's main photo as a URL"
                    photo: String!
                }
            `;

            // parseLinkImportArgument called in constructor
            // @ts-ignore
            expect(() => new Subgraph(typeDefs, undefined)).toThrow(
                "Encountered unknown Apollo Federation directive @banana"
            );
        });

        test("throws an error alias of non-string type", () => {
            const typeDefs = gql`
                extend schema
                    @link(
                        url: "https://specs.apollo.dev/federation/v2.0"
                        import: [
                            "@key"
                            { name: "@shareable", as: "@shared" }
                            { name: "@external", as: 4 }
                            "@requires"
                        ]
                    )

                type Query {
                    "The full list of locations presented by the Interplanetary Space Tourism department"
                    locations: [Location!]!
                    "The details of a specific location"
                    location(id: ID!): Location
                }

                type Location @key(fields: "id") {
                    id: ID!
                    "The name of the location"
                    name: String!
                    "A short description about the location"
                    description: String!
                    "The location's main photo as a URL"
                    photo: String!
                }
            `;

            // parseLinkImportArgument called in constructor
            // @ts-ignore
            expect(() => new Subgraph(typeDefs, undefined)).toThrow(
                "Alias for directive @external is not of type string"
            );
        });
    });

    describe("filterFederationDirectives", () => {
        test("filters @link and @key directives", () => {
            const typeDefs = gql`
                extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key"])

                type Query {
                    "The full list of locations presented by the Interplanetary Space Tourism department"
                    locations: [Location!]!
                    "The details of a specific location"
                    location(id: ID!): Location
                }

                type Location @key(fields: "id") {
                    id: ID!
                    "The name of the location"
                    name: String!
                    "A short description about the location"
                    description: String!
                    "The location's main photo as a URL"
                    photo: String!
                }
            `;

            // @ts-ignore
            const plugin = new Subgraph(typeDefs, undefined);

            const filteredTypeDefs = plugin["filterFederationDirectives"](typeDefs);

            expect(print(filteredTypeDefs)).toMatchInlineSnapshot(`
                "type Query {
                  \\"The full list of locations presented by the Interplanetary Space Tourism department\\"
                  locations: [Location!]!
                  \\"The details of a specific location\\"
                  location(id: ID!): Location
                }

                type Location {
                  id: ID!
                  \\"The name of the location\\"
                  name: String!
                  \\"A short description about the location\\"
                  description: String!
                  \\"The location's main photo as a URL\\"
                  photo: String!
                }"
            `);
        });
    });
});
