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

describe("Unions", () => {
    test("Unions", async () => {
        const typeDefs = gql`
            union Search = Movie | Genre

            type Genre @node {
                id: ID
            }

            type Movie @node {
                id: ID
                search: [Search!]! @relationship(type: "SEARCH", direction: OUT)
                searchNoDirective: Search
            }
        `;
        const neoSchema = new Neo4jGraphQL({ typeDefs });
        const printedSchema = printSchemaWithDirectives(lexicographicSortSchema(await neoSchema.getSchema()));

        expect(printedSchema).toMatchInlineSnapshot(`
            "schema {
              query: Query
              mutation: Mutation
            }

            type CreateGenresMutationResponse {
              genres: [Genre!]!
              info: CreateInfo!
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

            \\"\\"\\"
            Information about the number of nodes and relationships deleted during a delete mutation
            \\"\\"\\"
            type DeleteInfo {
              nodesDeleted: Int!
              relationshipsDeleted: Int!
            }

            type Genre {
              id: ID
            }

            type GenreAggregateSelection {
              count: Int!
              id: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
            }

            input GenreConnectWhere {
              node: GenreWhere!
            }

            input GenreCreateInput {
              id: ID
            }

            type GenreEdge {
              cursor: String!
              node: Genre!
            }

            input GenreOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more GenreSort objects to sort Genres by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [GenreSort!]
            }

            \\"\\"\\"
            Fields to sort Genres by. The order in which sorts are applied is not guaranteed when specifying many fields in one GenreSort object.
            \\"\\"\\"
            input GenreSort {
              id: SortDirection
            }

            input GenreUpdateInput {
              id: ID @deprecated(reason: \\"Please use the explicit _SET field\\")
              id_SET: ID
            }

            input GenreWhere {
              AND: [GenreWhere!]
              NOT: GenreWhere
              OR: [GenreWhere!]
              id: ID @deprecated(reason: \\"Please use the explicit _EQ version\\")
              id_CONTAINS: ID
              id_ENDS_WITH: ID
              id_EQ: ID
              id_IN: [ID]
              id_STARTS_WITH: ID
            }

            type GenresConnection {
              edges: [GenreEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type IDAggregateSelection {
              longest: ID
              shortest: ID
            }

            type Movie {
              id: ID
              search(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: QueryOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), where: SearchWhere): [Search!]!
              searchConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, where: MovieSearchConnectionWhere): MovieSearchConnection!
              searchNoDirective: Search
            }

            type MovieAggregateSelection {
              count: Int!
              id: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
            }

            input MovieConnectInput {
              search: MovieSearchConnectInput
            }

            input MovieConnectWhere {
              node: MovieWhere!
            }

            input MovieCreateInput {
              id: ID
              search: MovieSearchCreateInput
            }

            input MovieDeleteInput {
              search: MovieSearchDeleteInput
            }

            input MovieDisconnectInput {
              search: MovieSearchDisconnectInput
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

            input MovieSearchConnectInput {
              Genre: [MovieSearchGenreConnectFieldInput!]
              Movie: [MovieSearchMovieConnectFieldInput!]
            }

            type MovieSearchConnection {
              edges: [MovieSearchRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input MovieSearchConnectionWhere {
              Genre: MovieSearchGenreConnectionWhere
              Movie: MovieSearchMovieConnectionWhere
            }

            input MovieSearchCreateInput {
              Genre: MovieSearchGenreFieldInput
              Movie: MovieSearchMovieFieldInput
            }

            input MovieSearchDeleteInput {
              Genre: [MovieSearchGenreDeleteFieldInput!]
              Movie: [MovieSearchMovieDeleteFieldInput!]
            }

            input MovieSearchDisconnectInput {
              Genre: [MovieSearchGenreDisconnectFieldInput!]
              Movie: [MovieSearchMovieDisconnectFieldInput!]
            }

            input MovieSearchGenreConnectFieldInput {
              where: GenreConnectWhere
            }

            input MovieSearchGenreConnectionWhere {
              AND: [MovieSearchGenreConnectionWhere!]
              NOT: MovieSearchGenreConnectionWhere
              OR: [MovieSearchGenreConnectionWhere!]
              node: GenreWhere
            }

            input MovieSearchGenreCreateFieldInput {
              node: GenreCreateInput!
            }

            input MovieSearchGenreDeleteFieldInput {
              where: MovieSearchGenreConnectionWhere
            }

            input MovieSearchGenreDisconnectFieldInput {
              where: MovieSearchGenreConnectionWhere
            }

            input MovieSearchGenreFieldInput {
              connect: [MovieSearchGenreConnectFieldInput!]
              create: [MovieSearchGenreCreateFieldInput!]
            }

            input MovieSearchGenreUpdateConnectionInput {
              node: GenreUpdateInput
            }

            input MovieSearchGenreUpdateFieldInput {
              connect: [MovieSearchGenreConnectFieldInput!]
              create: [MovieSearchGenreCreateFieldInput!]
              delete: [MovieSearchGenreDeleteFieldInput!]
              disconnect: [MovieSearchGenreDisconnectFieldInput!]
              update: MovieSearchGenreUpdateConnectionInput
              where: MovieSearchGenreConnectionWhere
            }

            input MovieSearchMovieConnectFieldInput {
              connect: [MovieConnectInput!]
              where: MovieConnectWhere
            }

            input MovieSearchMovieConnectionWhere {
              AND: [MovieSearchMovieConnectionWhere!]
              NOT: MovieSearchMovieConnectionWhere
              OR: [MovieSearchMovieConnectionWhere!]
              node: MovieWhere
            }

            input MovieSearchMovieCreateFieldInput {
              node: MovieCreateInput!
            }

            input MovieSearchMovieDeleteFieldInput {
              delete: MovieDeleteInput
              where: MovieSearchMovieConnectionWhere
            }

            input MovieSearchMovieDisconnectFieldInput {
              disconnect: MovieDisconnectInput
              where: MovieSearchMovieConnectionWhere
            }

            input MovieSearchMovieFieldInput {
              connect: [MovieSearchMovieConnectFieldInput!]
              create: [MovieSearchMovieCreateFieldInput!]
            }

            input MovieSearchMovieUpdateConnectionInput {
              node: MovieUpdateInput
            }

            input MovieSearchMovieUpdateFieldInput {
              connect: [MovieSearchMovieConnectFieldInput!]
              create: [MovieSearchMovieCreateFieldInput!]
              delete: [MovieSearchMovieDeleteFieldInput!]
              disconnect: [MovieSearchMovieDisconnectFieldInput!]
              update: MovieSearchMovieUpdateConnectionInput
              where: MovieSearchMovieConnectionWhere
            }

            type MovieSearchRelationship {
              cursor: String!
              node: Search!
            }

            input MovieSearchUpdateInput {
              Genre: [MovieSearchGenreUpdateFieldInput!]
              Movie: [MovieSearchMovieUpdateFieldInput!]
            }

            \\"\\"\\"
            Fields to sort Movies by. The order in which sorts are applied is not guaranteed when specifying many fields in one MovieSort object.
            \\"\\"\\"
            input MovieSort {
              id: SortDirection
            }

            input MovieUpdateInput {
              id: ID @deprecated(reason: \\"Please use the explicit _SET field\\")
              id_SET: ID
              search: MovieSearchUpdateInput
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
              \\"\\"\\"
              Return Movies where all of the related MovieSearchConnections match this filter
              \\"\\"\\"
              searchConnection_ALL: MovieSearchConnectionWhere
              \\"\\"\\"
              Return Movies where none of the related MovieSearchConnections match this filter
              \\"\\"\\"
              searchConnection_NONE: MovieSearchConnectionWhere
              \\"\\"\\"
              Return Movies where one of the related MovieSearchConnections match this filter
              \\"\\"\\"
              searchConnection_SINGLE: MovieSearchConnectionWhere
              \\"\\"\\"
              Return Movies where some of the related MovieSearchConnections match this filter
              \\"\\"\\"
              searchConnection_SOME: MovieSearchConnectionWhere
              \\"\\"\\"Return Movies where all of the related Searches match this filter\\"\\"\\"
              search_ALL: SearchWhere
              \\"\\"\\"Return Movies where none of the related Searches match this filter\\"\\"\\"
              search_NONE: SearchWhere
              \\"\\"\\"Return Movies where one of the related Searches match this filter\\"\\"\\"
              search_SINGLE: SearchWhere
              \\"\\"\\"Return Movies where some of the related Searches match this filter\\"\\"\\"
              search_SOME: SearchWhere
            }

            type MoviesConnection {
              edges: [MovieEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Mutation {
              createGenres(input: [GenreCreateInput!]!): CreateGenresMutationResponse!
              createMovies(input: [MovieCreateInput!]!): CreateMoviesMutationResponse!
              deleteGenres(where: GenreWhere): DeleteInfo!
              deleteMovies(delete: MovieDeleteInput, where: MovieWhere): DeleteInfo!
              updateGenres(update: GenreUpdateInput, where: GenreWhere): UpdateGenresMutationResponse!
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
              genres(limit: Int, offset: Int, options: GenreOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [GenreSort!], where: GenreWhere): [Genre!]!
              genresAggregate(where: GenreWhere): GenreAggregateSelection!
              genresConnection(after: String, first: Int, sort: [GenreSort!], where: GenreWhere): GenresConnection!
              movies(limit: Int, offset: Int, options: MovieOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [MovieSort!], where: MovieWhere): [Movie!]!
              moviesAggregate(where: MovieWhere): MovieAggregateSelection!
              moviesConnection(after: String, first: Int, sort: [MovieSort!], where: MovieWhere): MoviesConnection!
              searches(limit: Int, offset: Int, options: QueryOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), where: SearchWhere): [Search!]!
            }

            \\"\\"\\"Input type for options that can be specified on a query operation.\\"\\"\\"
            input QueryOptions {
              limit: Int
              offset: Int
            }

            union Search = Genre | Movie

            input SearchWhere {
              Genre: GenreWhere
              Movie: MovieWhere
            }

            \\"\\"\\"An enum for sorting in either ascending or descending order.\\"\\"\\"
            enum SortDirection {
              \\"\\"\\"Sort by field values in ascending order.\\"\\"\\"
              ASC
              \\"\\"\\"Sort by field values in descending order.\\"\\"\\"
              DESC
            }

            type UpdateGenresMutationResponse {
              genres: [Genre!]!
              info: UpdateInfo!
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
