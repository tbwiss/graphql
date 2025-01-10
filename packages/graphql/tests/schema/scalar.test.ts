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

import { printSchemaWithDirectives } from "@graphql-tools/utils";
import { gql } from "graphql-tag";
import { lexicographicSortSchema } from "graphql/utilities";
import { Neo4jGraphQL } from "../../src";

describe("Scalar", () => {
    test("Scalars", async () => {
        const typeDefs = gql`
            scalar CustomScalar

            type Movie @node {
                id: ID
                myCustomArrayScalar: [CustomScalar!]
                myCustomScalar: CustomScalar
                myRequiredCustomArrayScalar: [CustomScalar!]!
            }
        `;
        const neoSchema = new Neo4jGraphQL({ typeDefs });
        const printedSchema = printSchemaWithDirectives(lexicographicSortSchema(await neoSchema.getSchema()));

        expect(printedSchema).toMatchInlineSnapshot(`
            "schema {
              query: Query
              mutation: Mutation
            }

            \\"\\"\\"
            Information about the number of nodes and relationships created during a create mutation
            \\"\\"\\"
            type CreateInfo {
              nodesCreated: Int!
              relationshipsCreated: Int!
            }

            type CreateMoviesMutationResponse {
              info: CreateInfo!
              movies: [Movie!]!
            }

            scalar CustomScalar

            \\"\\"\\"
            Information about the number of nodes and relationships deleted during a delete mutation
            \\"\\"\\"
            type DeleteInfo {
              nodesDeleted: Int!
              relationshipsDeleted: Int!
            }

            type IDAggregateSelection {
              longest: ID
              shortest: ID
            }

            type Movie {
              id: ID
              myCustomArrayScalar: [CustomScalar!]
              myCustomScalar: CustomScalar
              myRequiredCustomArrayScalar: [CustomScalar!]!
            }

            type MovieAggregateSelection {
              count: Int!
              id: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
            }

            input MovieCreateInput {
              id: ID
              myCustomArrayScalar: [CustomScalar!]
              myCustomScalar: CustomScalar
              myRequiredCustomArrayScalar: [CustomScalar!]!
            }

            type MovieEdge {
              cursor: String!
              node: Movie!
            }

            input MovieOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more MovieSort objects to sort Movies by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [MovieSort!]
            }

            \\"\\"\\"
            Fields to sort Movies by. The order in which sorts are applied is not guaranteed when specifying many fields in one MovieSort object.
            \\"\\"\\"
            input MovieSort {
              id: SortDirection
              myCustomScalar: SortDirection
            }

            input MovieUpdateInput {
              id: ID @deprecated(reason: \\"Please use the explicit _SET field\\")
              id_SET: ID
              myCustomArrayScalar: [CustomScalar!] @deprecated(reason: \\"Please use the explicit _SET field\\")
              myCustomArrayScalar_SET: [CustomScalar!]
              myCustomScalar: CustomScalar @deprecated(reason: \\"Please use the explicit _SET field\\")
              myCustomScalar_SET: CustomScalar
              myRequiredCustomArrayScalar: [CustomScalar!] @deprecated(reason: \\"Please use the explicit _SET field\\")
              myRequiredCustomArrayScalar_SET: [CustomScalar!]
            }

            input MovieWhere {
              AND: [MovieWhere!]
              NOT: MovieWhere
              OR: [MovieWhere!]
              id: ID @deprecated(reason: \\"Please use the explicit _EQ version\\")
              id_CONTAINS: ID
              id_ENDS_WITH: ID
              id_EQ: ID
              id_IN: [ID]
              id_STARTS_WITH: ID
              myCustomArrayScalar: [CustomScalar!] @deprecated(reason: \\"Please use the explicit _EQ version\\")
              myCustomArrayScalar_EQ: [CustomScalar!]
              myCustomArrayScalar_INCLUDES: CustomScalar
              myCustomScalar: CustomScalar @deprecated(reason: \\"Please use the explicit _EQ version\\")
              myCustomScalar_EQ: CustomScalar
              myCustomScalar_IN: [CustomScalar]
              myRequiredCustomArrayScalar: [CustomScalar!] @deprecated(reason: \\"Please use the explicit _EQ version\\")
              myRequiredCustomArrayScalar_EQ: [CustomScalar!]
              myRequiredCustomArrayScalar_INCLUDES: CustomScalar
            }

            type MoviesConnection {
              edges: [MovieEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Mutation {
              createMovies(input: [MovieCreateInput!]!): CreateMoviesMutationResponse!
              deleteMovies(where: MovieWhere): DeleteInfo!
              updateMovies(update: MovieUpdateInput, where: MovieWhere): UpdateMoviesMutationResponse!
            }

            \\"\\"\\"Pagination information (Relay)\\"\\"\\"
            type PageInfo {
              endCursor: String
              hasNextPage: Boolean!
              hasPreviousPage: Boolean!
              startCursor: String
            }

            type Query {
              movies(limit: Int, offset: Int, options: MovieOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [MovieSort!], where: MovieWhere): [Movie!]!
              moviesAggregate(where: MovieWhere): MovieAggregateSelection!
              moviesConnection(after: String, first: Int, sort: [MovieSort!], where: MovieWhere): MoviesConnection!
            }

            \\"\\"\\"An enum for sorting in either ascending or descending order.\\"\\"\\"
            enum SortDirection {
              \\"\\"\\"Sort by field values in ascending order.\\"\\"\\"
              ASC
              \\"\\"\\"Sort by field values in descending order.\\"\\"\\"
              DESC
            }

            \\"\\"\\"
            Information about the number of nodes and relationships created and deleted during an update mutation
            \\"\\"\\"
            type UpdateInfo {
              nodesCreated: Int!
              nodesDeleted: Int!
              relationshipsCreated: Int!
              relationshipsDeleted: Int!
            }

            type UpdateMoviesMutationResponse {
              info: UpdateInfo!
              movies: [Movie!]!
            }"
        `);
    });
});
