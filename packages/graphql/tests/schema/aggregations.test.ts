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
import { lexicographicSortSchema } from "graphql/utilities";
import { Neo4jGraphQL } from "../../src";

describe("Aggregations", () => {
    test("Top Level Aggregations", async () => {
        const typeDefs = /* GraphQL */ `
            type Movie @node {
                id: ID
                isbn: String!
                title: String
                createdAt: DateTime
                someTime: Time
                someLocalTime: LocalTime
                someLocalDateTime: LocalDateTime
                imdbRating: Float
                someInt: Int
                someBigInt: BigInt
                screenTime: Duration
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
            A BigInt value up to 64 bits in size, which can be a number or a string if used inline, or a string only if used as a variable. Always returned as a string.
            \\"\\"\\"
            scalar BigInt

            type BigIntAggregateSelection {
              average: BigInt
              max: BigInt
              min: BigInt
              sum: BigInt
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

            \\"\\"\\"A date and time, represented as an ISO-8601 string\\"\\"\\"
            scalar DateTime

            type DateTimeAggregateSelection {
              max: DateTime
              min: DateTime
            }

            \\"\\"\\"
            Information about the number of nodes and relationships deleted during a delete mutation
            \\"\\"\\"
            type DeleteInfo {
              nodesDeleted: Int!
              relationshipsDeleted: Int!
            }

            \\"\\"\\"A duration, represented as an ISO 8601 duration string\\"\\"\\"
            scalar Duration

            type DurationAggregateSelection {
              max: Duration
              min: Duration
            }

            type FloatAggregateSelection {
              average: Float
              max: Float
              min: Float
              sum: Float
            }

            type IDAggregateSelection {
              longest: ID
              shortest: ID
            }

            type IntAggregateSelection {
              average: Float
              max: Int
              min: Int
              sum: Int
            }

            \\"\\"\\"A local datetime, represented as 'YYYY-MM-DDTHH:MM:SS'\\"\\"\\"
            scalar LocalDateTime

            type LocalDateTimeAggregateSelection {
              max: LocalDateTime
              min: LocalDateTime
            }

            \\"\\"\\"
            A local time, represented as a time string without timezone information
            \\"\\"\\"
            scalar LocalTime

            type LocalTimeAggregateSelection {
              max: LocalTime
              min: LocalTime
            }

            type Movie {
              createdAt: DateTime
              id: ID
              imdbRating: Float
              isbn: String!
              screenTime: Duration
              someBigInt: BigInt
              someInt: Int
              someLocalDateTime: LocalDateTime
              someLocalTime: LocalTime
              someTime: Time
              title: String
            }

            type MovieAggregateSelection {
              count: Int!
              createdAt: DateTimeAggregateSelection!
              id: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              imdbRating: FloatAggregateSelection!
              isbn: StringAggregateSelection!
              screenTime: DurationAggregateSelection!
              someBigInt: BigIntAggregateSelection!
              someInt: IntAggregateSelection!
              someLocalDateTime: LocalDateTimeAggregateSelection!
              someLocalTime: LocalTimeAggregateSelection!
              someTime: TimeAggregateSelection!
              title: StringAggregateSelection!
            }

            input MovieCreateInput {
              createdAt: DateTime
              id: ID
              imdbRating: Float
              isbn: String!
              screenTime: Duration
              someBigInt: BigInt
              someInt: Int
              someLocalDateTime: LocalDateTime
              someLocalTime: LocalTime
              someTime: Time
              title: String
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
              createdAt: SortDirection
              id: SortDirection
              imdbRating: SortDirection
              isbn: SortDirection
              screenTime: SortDirection
              someBigInt: SortDirection
              someInt: SortDirection
              someLocalDateTime: SortDirection
              someLocalTime: SortDirection
              someTime: SortDirection
              title: SortDirection
            }

            input MovieUpdateInput {
              createdAt: DateTime @deprecated(reason: \\"Please use the explicit _SET field\\")
              createdAt_SET: DateTime
              id: ID @deprecated(reason: \\"Please use the explicit _SET field\\")
              id_SET: ID
              imdbRating: Float @deprecated(reason: \\"Please use the explicit _SET field\\")
              imdbRating_ADD: Float
              imdbRating_DIVIDE: Float
              imdbRating_MULTIPLY: Float
              imdbRating_SET: Float
              imdbRating_SUBTRACT: Float
              isbn: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              isbn_SET: String
              screenTime: Duration @deprecated(reason: \\"Please use the explicit _SET field\\")
              screenTime_SET: Duration
              someBigInt: BigInt @deprecated(reason: \\"Please use the explicit _SET field\\")
              someBigInt_DECREMENT: BigInt
              someBigInt_INCREMENT: BigInt
              someBigInt_SET: BigInt
              someInt: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              someInt_DECREMENT: Int
              someInt_INCREMENT: Int
              someInt_SET: Int
              someLocalDateTime: LocalDateTime @deprecated(reason: \\"Please use the explicit _SET field\\")
              someLocalDateTime_SET: LocalDateTime
              someLocalTime: LocalTime @deprecated(reason: \\"Please use the explicit _SET field\\")
              someLocalTime_SET: LocalTime
              someTime: Time @deprecated(reason: \\"Please use the explicit _SET field\\")
              someTime_SET: Time
              title: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              title_SET: String
            }

            input MovieWhere {
              AND: [MovieWhere!]
              NOT: MovieWhere
              OR: [MovieWhere!]
              createdAt: DateTime @deprecated(reason: \\"Please use the explicit _EQ version\\")
              createdAt_EQ: DateTime
              createdAt_GT: DateTime
              createdAt_GTE: DateTime
              createdAt_IN: [DateTime]
              createdAt_LT: DateTime
              createdAt_LTE: DateTime
              id: ID @deprecated(reason: \\"Please use the explicit _EQ version\\")
              id_CONTAINS: ID
              id_ENDS_WITH: ID
              id_EQ: ID
              id_IN: [ID]
              id_STARTS_WITH: ID
              imdbRating: Float @deprecated(reason: \\"Please use the explicit _EQ version\\")
              imdbRating_EQ: Float
              imdbRating_GT: Float
              imdbRating_GTE: Float
              imdbRating_IN: [Float]
              imdbRating_LT: Float
              imdbRating_LTE: Float
              isbn: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              isbn_CONTAINS: String
              isbn_ENDS_WITH: String
              isbn_EQ: String
              isbn_IN: [String!]
              isbn_STARTS_WITH: String
              screenTime: Duration @deprecated(reason: \\"Please use the explicit _EQ version\\")
              screenTime_EQ: Duration
              screenTime_GT: Duration
              screenTime_GTE: Duration
              screenTime_IN: [Duration]
              screenTime_LT: Duration
              screenTime_LTE: Duration
              someBigInt: BigInt @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someBigInt_EQ: BigInt
              someBigInt_GT: BigInt
              someBigInt_GTE: BigInt
              someBigInt_IN: [BigInt]
              someBigInt_LT: BigInt
              someBigInt_LTE: BigInt
              someInt: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someInt_EQ: Int
              someInt_GT: Int
              someInt_GTE: Int
              someInt_IN: [Int]
              someInt_LT: Int
              someInt_LTE: Int
              someLocalDateTime: LocalDateTime @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someLocalDateTime_EQ: LocalDateTime
              someLocalDateTime_GT: LocalDateTime
              someLocalDateTime_GTE: LocalDateTime
              someLocalDateTime_IN: [LocalDateTime]
              someLocalDateTime_LT: LocalDateTime
              someLocalDateTime_LTE: LocalDateTime
              someLocalTime: LocalTime @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someLocalTime_EQ: LocalTime
              someLocalTime_GT: LocalTime
              someLocalTime_GTE: LocalTime
              someLocalTime_IN: [LocalTime]
              someLocalTime_LT: LocalTime
              someLocalTime_LTE: LocalTime
              someTime: Time @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someTime_EQ: Time
              someTime_GT: Time
              someTime_GTE: Time
              someTime_IN: [Time]
              someTime_LT: Time
              someTime_LTE: Time
              title: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              title_CONTAINS: String
              title_ENDS_WITH: String
              title_EQ: String
              title_IN: [String]
              title_STARTS_WITH: String
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

            type StringAggregateSelection {
              longest: String
              shortest: String
            }

            \\"\\"\\"A time, represented as an RFC3339 time string\\"\\"\\"
            scalar Time

            type TimeAggregateSelection {
              max: Time
              min: Time
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

    test("Where Level Aggregations", async () => {
        const typeDefs = /* GraphQL */ `
            type User @node {
                someID: ID
                someString: String
                someFloat: Float
                someInt: Int
                someBigInt: BigInt
                someDateTime: DateTime
                someLocalDateTime: LocalDateTime
                someLocalTime: LocalTime
                someTime: Time
                someDuration: Duration
            }

            type Post @node {
                someID: ID
                title: String
                likes: [User!]! @relationship(type: "LIKES", direction: IN, properties: "Likes")
            }

            type Likes @relationshipProperties {
                someID: ID
                someString: String
                someFloat: Float
                someInt: Int
                someBigInt: BigInt
                someDateTime: DateTime
                someLocalDateTime: LocalDateTime
                someLocalTime: LocalTime
                someTime: Time
                someDuration: Duration
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
            A BigInt value up to 64 bits in size, which can be a number or a string if used inline, or a string only if used as a variable. Always returned as a string.
            \\"\\"\\"
            scalar BigInt

            type BigIntAggregateSelection {
              average: BigInt
              max: BigInt
              min: BigInt
              sum: BigInt
            }

            \\"\\"\\"
            Information about the number of nodes and relationships created during a create mutation
            \\"\\"\\"
            type CreateInfo {
              nodesCreated: Int!
              relationshipsCreated: Int!
            }

            type CreatePostsMutationResponse {
              info: CreateInfo!
              posts: [Post!]!
            }

            type CreateUsersMutationResponse {
              info: CreateInfo!
              users: [User!]!
            }

            \\"\\"\\"A date and time, represented as an ISO-8601 string\\"\\"\\"
            scalar DateTime

            type DateTimeAggregateSelection {
              max: DateTime
              min: DateTime
            }

            \\"\\"\\"
            Information about the number of nodes and relationships deleted during a delete mutation
            \\"\\"\\"
            type DeleteInfo {
              nodesDeleted: Int!
              relationshipsDeleted: Int!
            }

            \\"\\"\\"A duration, represented as an ISO 8601 duration string\\"\\"\\"
            scalar Duration

            type DurationAggregateSelection {
              max: Duration
              min: Duration
            }

            type FloatAggregateSelection {
              average: Float
              max: Float
              min: Float
              sum: Float
            }

            type IDAggregateSelection {
              longest: ID
              shortest: ID
            }

            type IntAggregateSelection {
              average: Float
              max: Int
              min: Int
              sum: Int
            }

            \\"\\"\\"
            The edge properties for the following fields:
            * Post.likes
            \\"\\"\\"
            type Likes {
              someBigInt: BigInt
              someDateTime: DateTime
              someDuration: Duration
              someFloat: Float
              someID: ID
              someInt: Int
              someLocalDateTime: LocalDateTime
              someLocalTime: LocalTime
              someString: String
              someTime: Time
            }

            input LikesAggregationWhereInput {
              AND: [LikesAggregationWhereInput!]
              NOT: LikesAggregationWhereInput
              OR: [LikesAggregationWhereInput!]
              someBigInt_AVERAGE_EQUAL: BigInt
              someBigInt_AVERAGE_GT: BigInt
              someBigInt_AVERAGE_GTE: BigInt
              someBigInt_AVERAGE_LT: BigInt
              someBigInt_AVERAGE_LTE: BigInt
              someBigInt_MAX_EQUAL: BigInt
              someBigInt_MAX_GT: BigInt
              someBigInt_MAX_GTE: BigInt
              someBigInt_MAX_LT: BigInt
              someBigInt_MAX_LTE: BigInt
              someBigInt_MIN_EQUAL: BigInt
              someBigInt_MIN_GT: BigInt
              someBigInt_MIN_GTE: BigInt
              someBigInt_MIN_LT: BigInt
              someBigInt_MIN_LTE: BigInt
              someBigInt_SUM_EQUAL: BigInt
              someBigInt_SUM_GT: BigInt
              someBigInt_SUM_GTE: BigInt
              someBigInt_SUM_LT: BigInt
              someBigInt_SUM_LTE: BigInt
              someDateTime_MAX_EQUAL: DateTime
              someDateTime_MAX_GT: DateTime
              someDateTime_MAX_GTE: DateTime
              someDateTime_MAX_LT: DateTime
              someDateTime_MAX_LTE: DateTime
              someDateTime_MIN_EQUAL: DateTime
              someDateTime_MIN_GT: DateTime
              someDateTime_MIN_GTE: DateTime
              someDateTime_MIN_LT: DateTime
              someDateTime_MIN_LTE: DateTime
              someDuration_AVERAGE_EQUAL: Duration
              someDuration_AVERAGE_GT: Duration
              someDuration_AVERAGE_GTE: Duration
              someDuration_AVERAGE_LT: Duration
              someDuration_AVERAGE_LTE: Duration
              someDuration_MAX_EQUAL: Duration
              someDuration_MAX_GT: Duration
              someDuration_MAX_GTE: Duration
              someDuration_MAX_LT: Duration
              someDuration_MAX_LTE: Duration
              someDuration_MIN_EQUAL: Duration
              someDuration_MIN_GT: Duration
              someDuration_MIN_GTE: Duration
              someDuration_MIN_LT: Duration
              someDuration_MIN_LTE: Duration
              someFloat_AVERAGE_EQUAL: Float
              someFloat_AVERAGE_GT: Float
              someFloat_AVERAGE_GTE: Float
              someFloat_AVERAGE_LT: Float
              someFloat_AVERAGE_LTE: Float
              someFloat_MAX_EQUAL: Float
              someFloat_MAX_GT: Float
              someFloat_MAX_GTE: Float
              someFloat_MAX_LT: Float
              someFloat_MAX_LTE: Float
              someFloat_MIN_EQUAL: Float
              someFloat_MIN_GT: Float
              someFloat_MIN_GTE: Float
              someFloat_MIN_LT: Float
              someFloat_MIN_LTE: Float
              someFloat_SUM_EQUAL: Float
              someFloat_SUM_GT: Float
              someFloat_SUM_GTE: Float
              someFloat_SUM_LT: Float
              someFloat_SUM_LTE: Float
              someID_MAX_EQUAL: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someID_MAX_GT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someID_MAX_GTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someID_MAX_LT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someID_MAX_LTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someID_MIN_EQUAL: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someID_MIN_GT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someID_MIN_GTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someID_MIN_LT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someID_MIN_LTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someInt_AVERAGE_EQUAL: Float
              someInt_AVERAGE_GT: Float
              someInt_AVERAGE_GTE: Float
              someInt_AVERAGE_LT: Float
              someInt_AVERAGE_LTE: Float
              someInt_MAX_EQUAL: Int
              someInt_MAX_GT: Int
              someInt_MAX_GTE: Int
              someInt_MAX_LT: Int
              someInt_MAX_LTE: Int
              someInt_MIN_EQUAL: Int
              someInt_MIN_GT: Int
              someInt_MIN_GTE: Int
              someInt_MIN_LT: Int
              someInt_MIN_LTE: Int
              someInt_SUM_EQUAL: Int
              someInt_SUM_GT: Int
              someInt_SUM_GTE: Int
              someInt_SUM_LT: Int
              someInt_SUM_LTE: Int
              someLocalDateTime_MAX_EQUAL: LocalDateTime
              someLocalDateTime_MAX_GT: LocalDateTime
              someLocalDateTime_MAX_GTE: LocalDateTime
              someLocalDateTime_MAX_LT: LocalDateTime
              someLocalDateTime_MAX_LTE: LocalDateTime
              someLocalDateTime_MIN_EQUAL: LocalDateTime
              someLocalDateTime_MIN_GT: LocalDateTime
              someLocalDateTime_MIN_GTE: LocalDateTime
              someLocalDateTime_MIN_LT: LocalDateTime
              someLocalDateTime_MIN_LTE: LocalDateTime
              someLocalTime_MAX_EQUAL: LocalTime
              someLocalTime_MAX_GT: LocalTime
              someLocalTime_MAX_GTE: LocalTime
              someLocalTime_MAX_LT: LocalTime
              someLocalTime_MAX_LTE: LocalTime
              someLocalTime_MIN_EQUAL: LocalTime
              someLocalTime_MIN_GT: LocalTime
              someLocalTime_MIN_GTE: LocalTime
              someLocalTime_MIN_LT: LocalTime
              someLocalTime_MIN_LTE: LocalTime
              someString_AVERAGE_LENGTH_EQUAL: Float
              someString_AVERAGE_LENGTH_GT: Float
              someString_AVERAGE_LENGTH_GTE: Float
              someString_AVERAGE_LENGTH_LT: Float
              someString_AVERAGE_LENGTH_LTE: Float
              someString_LONGEST_LENGTH_EQUAL: Int
              someString_LONGEST_LENGTH_GT: Int
              someString_LONGEST_LENGTH_GTE: Int
              someString_LONGEST_LENGTH_LT: Int
              someString_LONGEST_LENGTH_LTE: Int
              someString_SHORTEST_LENGTH_EQUAL: Int
              someString_SHORTEST_LENGTH_GT: Int
              someString_SHORTEST_LENGTH_GTE: Int
              someString_SHORTEST_LENGTH_LT: Int
              someString_SHORTEST_LENGTH_LTE: Int
              someTime_MAX_EQUAL: Time
              someTime_MAX_GT: Time
              someTime_MAX_GTE: Time
              someTime_MAX_LT: Time
              someTime_MAX_LTE: Time
              someTime_MIN_EQUAL: Time
              someTime_MIN_GT: Time
              someTime_MIN_GTE: Time
              someTime_MIN_LT: Time
              someTime_MIN_LTE: Time
            }

            input LikesCreateInput {
              someBigInt: BigInt
              someDateTime: DateTime
              someDuration: Duration
              someFloat: Float
              someID: ID
              someInt: Int
              someLocalDateTime: LocalDateTime
              someLocalTime: LocalTime
              someString: String
              someTime: Time
            }

            input LikesSort {
              someBigInt: SortDirection
              someDateTime: SortDirection
              someDuration: SortDirection
              someFloat: SortDirection
              someID: SortDirection
              someInt: SortDirection
              someLocalDateTime: SortDirection
              someLocalTime: SortDirection
              someString: SortDirection
              someTime: SortDirection
            }

            input LikesUpdateInput {
              someBigInt: BigInt @deprecated(reason: \\"Please use the explicit _SET field\\")
              someBigInt_DECREMENT: BigInt
              someBigInt_INCREMENT: BigInt
              someBigInt_SET: BigInt
              someDateTime: DateTime @deprecated(reason: \\"Please use the explicit _SET field\\")
              someDateTime_SET: DateTime
              someDuration: Duration @deprecated(reason: \\"Please use the explicit _SET field\\")
              someDuration_SET: Duration
              someFloat: Float @deprecated(reason: \\"Please use the explicit _SET field\\")
              someFloat_ADD: Float
              someFloat_DIVIDE: Float
              someFloat_MULTIPLY: Float
              someFloat_SET: Float
              someFloat_SUBTRACT: Float
              someID: ID @deprecated(reason: \\"Please use the explicit _SET field\\")
              someID_SET: ID
              someInt: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              someInt_DECREMENT: Int
              someInt_INCREMENT: Int
              someInt_SET: Int
              someLocalDateTime: LocalDateTime @deprecated(reason: \\"Please use the explicit _SET field\\")
              someLocalDateTime_SET: LocalDateTime
              someLocalTime: LocalTime @deprecated(reason: \\"Please use the explicit _SET field\\")
              someLocalTime_SET: LocalTime
              someString: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              someString_SET: String
              someTime: Time @deprecated(reason: \\"Please use the explicit _SET field\\")
              someTime_SET: Time
            }

            input LikesWhere {
              AND: [LikesWhere!]
              NOT: LikesWhere
              OR: [LikesWhere!]
              someBigInt: BigInt @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someBigInt_EQ: BigInt
              someBigInt_GT: BigInt
              someBigInt_GTE: BigInt
              someBigInt_IN: [BigInt]
              someBigInt_LT: BigInt
              someBigInt_LTE: BigInt
              someDateTime: DateTime @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someDateTime_EQ: DateTime
              someDateTime_GT: DateTime
              someDateTime_GTE: DateTime
              someDateTime_IN: [DateTime]
              someDateTime_LT: DateTime
              someDateTime_LTE: DateTime
              someDuration: Duration @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someDuration_EQ: Duration
              someDuration_GT: Duration
              someDuration_GTE: Duration
              someDuration_IN: [Duration]
              someDuration_LT: Duration
              someDuration_LTE: Duration
              someFloat: Float @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someFloat_EQ: Float
              someFloat_GT: Float
              someFloat_GTE: Float
              someFloat_IN: [Float]
              someFloat_LT: Float
              someFloat_LTE: Float
              someID: ID @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someID_CONTAINS: ID
              someID_ENDS_WITH: ID
              someID_EQ: ID
              someID_IN: [ID]
              someID_STARTS_WITH: ID
              someInt: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someInt_EQ: Int
              someInt_GT: Int
              someInt_GTE: Int
              someInt_IN: [Int]
              someInt_LT: Int
              someInt_LTE: Int
              someLocalDateTime: LocalDateTime @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someLocalDateTime_EQ: LocalDateTime
              someLocalDateTime_GT: LocalDateTime
              someLocalDateTime_GTE: LocalDateTime
              someLocalDateTime_IN: [LocalDateTime]
              someLocalDateTime_LT: LocalDateTime
              someLocalDateTime_LTE: LocalDateTime
              someLocalTime: LocalTime @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someLocalTime_EQ: LocalTime
              someLocalTime_GT: LocalTime
              someLocalTime_GTE: LocalTime
              someLocalTime_IN: [LocalTime]
              someLocalTime_LT: LocalTime
              someLocalTime_LTE: LocalTime
              someString: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someString_CONTAINS: String
              someString_ENDS_WITH: String
              someString_EQ: String
              someString_IN: [String]
              someString_STARTS_WITH: String
              someTime: Time @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someTime_EQ: Time
              someTime_GT: Time
              someTime_GTE: Time
              someTime_IN: [Time]
              someTime_LT: Time
              someTime_LTE: Time
            }

            \\"\\"\\"A local datetime, represented as 'YYYY-MM-DDTHH:MM:SS'\\"\\"\\"
            scalar LocalDateTime

            type LocalDateTimeAggregateSelection {
              max: LocalDateTime
              min: LocalDateTime
            }

            \\"\\"\\"
            A local time, represented as a time string without timezone information
            \\"\\"\\"
            scalar LocalTime

            type LocalTimeAggregateSelection {
              max: LocalTime
              min: LocalTime
            }

            type Mutation {
              createPosts(input: [PostCreateInput!]!): CreatePostsMutationResponse!
              createUsers(input: [UserCreateInput!]!): CreateUsersMutationResponse!
              deletePosts(delete: PostDeleteInput, where: PostWhere): DeleteInfo!
              deleteUsers(where: UserWhere): DeleteInfo!
              updatePosts(update: PostUpdateInput, where: PostWhere): UpdatePostsMutationResponse!
              updateUsers(update: UserUpdateInput, where: UserWhere): UpdateUsersMutationResponse!
            }

            \\"\\"\\"Pagination information (Relay)\\"\\"\\"
            type PageInfo {
              endCursor: String
              hasNextPage: Boolean!
              hasPreviousPage: Boolean!
              startCursor: String
            }

            type Post {
              likes(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: UserOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [UserSort!], where: UserWhere): [User!]!
              likesAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: UserWhere): PostUserLikesAggregationSelection
              likesConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [PostLikesConnectionSort!], where: PostLikesConnectionWhere): PostLikesConnection!
              someID: ID
              title: String
            }

            type PostAggregateSelection {
              count: Int!
              someID: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              title: StringAggregateSelection!
            }

            input PostCreateInput {
              likes: PostLikesFieldInput
              someID: ID
              title: String
            }

            input PostDeleteInput {
              likes: [PostLikesDeleteFieldInput!]
            }

            type PostEdge {
              cursor: String!
              node: Post!
            }

            input PostLikesAggregateInput {
              AND: [PostLikesAggregateInput!]
              NOT: PostLikesAggregateInput
              OR: [PostLikesAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: LikesAggregationWhereInput
              node: PostLikesNodeAggregationWhereInput
            }

            input PostLikesConnectFieldInput {
              edge: LikesCreateInput
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: UserConnectWhere
            }

            type PostLikesConnection {
              edges: [PostLikesRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input PostLikesConnectionSort {
              edge: LikesSort
              node: UserSort
            }

            input PostLikesConnectionWhere {
              AND: [PostLikesConnectionWhere!]
              NOT: PostLikesConnectionWhere
              OR: [PostLikesConnectionWhere!]
              edge: LikesWhere
              node: UserWhere
            }

            input PostLikesCreateFieldInput {
              edge: LikesCreateInput
              node: UserCreateInput!
            }

            input PostLikesDeleteFieldInput {
              where: PostLikesConnectionWhere
            }

            input PostLikesDisconnectFieldInput {
              where: PostLikesConnectionWhere
            }

            input PostLikesFieldInput {
              connect: [PostLikesConnectFieldInput!]
              create: [PostLikesCreateFieldInput!]
            }

            input PostLikesNodeAggregationWhereInput {
              AND: [PostLikesNodeAggregationWhereInput!]
              NOT: PostLikesNodeAggregationWhereInput
              OR: [PostLikesNodeAggregationWhereInput!]
              someBigInt_AVERAGE_EQUAL: BigInt
              someBigInt_AVERAGE_GT: BigInt
              someBigInt_AVERAGE_GTE: BigInt
              someBigInt_AVERAGE_LT: BigInt
              someBigInt_AVERAGE_LTE: BigInt
              someBigInt_MAX_EQUAL: BigInt
              someBigInt_MAX_GT: BigInt
              someBigInt_MAX_GTE: BigInt
              someBigInt_MAX_LT: BigInt
              someBigInt_MAX_LTE: BigInt
              someBigInt_MIN_EQUAL: BigInt
              someBigInt_MIN_GT: BigInt
              someBigInt_MIN_GTE: BigInt
              someBigInt_MIN_LT: BigInt
              someBigInt_MIN_LTE: BigInt
              someBigInt_SUM_EQUAL: BigInt
              someBigInt_SUM_GT: BigInt
              someBigInt_SUM_GTE: BigInt
              someBigInt_SUM_LT: BigInt
              someBigInt_SUM_LTE: BigInt
              someDateTime_MAX_EQUAL: DateTime
              someDateTime_MAX_GT: DateTime
              someDateTime_MAX_GTE: DateTime
              someDateTime_MAX_LT: DateTime
              someDateTime_MAX_LTE: DateTime
              someDateTime_MIN_EQUAL: DateTime
              someDateTime_MIN_GT: DateTime
              someDateTime_MIN_GTE: DateTime
              someDateTime_MIN_LT: DateTime
              someDateTime_MIN_LTE: DateTime
              someDuration_AVERAGE_EQUAL: Duration
              someDuration_AVERAGE_GT: Duration
              someDuration_AVERAGE_GTE: Duration
              someDuration_AVERAGE_LT: Duration
              someDuration_AVERAGE_LTE: Duration
              someDuration_MAX_EQUAL: Duration
              someDuration_MAX_GT: Duration
              someDuration_MAX_GTE: Duration
              someDuration_MAX_LT: Duration
              someDuration_MAX_LTE: Duration
              someDuration_MIN_EQUAL: Duration
              someDuration_MIN_GT: Duration
              someDuration_MIN_GTE: Duration
              someDuration_MIN_LT: Duration
              someDuration_MIN_LTE: Duration
              someFloat_AVERAGE_EQUAL: Float
              someFloat_AVERAGE_GT: Float
              someFloat_AVERAGE_GTE: Float
              someFloat_AVERAGE_LT: Float
              someFloat_AVERAGE_LTE: Float
              someFloat_MAX_EQUAL: Float
              someFloat_MAX_GT: Float
              someFloat_MAX_GTE: Float
              someFloat_MAX_LT: Float
              someFloat_MAX_LTE: Float
              someFloat_MIN_EQUAL: Float
              someFloat_MIN_GT: Float
              someFloat_MIN_GTE: Float
              someFloat_MIN_LT: Float
              someFloat_MIN_LTE: Float
              someFloat_SUM_EQUAL: Float
              someFloat_SUM_GT: Float
              someFloat_SUM_GTE: Float
              someFloat_SUM_LT: Float
              someFloat_SUM_LTE: Float
              someID_MAX_EQUAL: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someID_MAX_GT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someID_MAX_GTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someID_MAX_LT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someID_MAX_LTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someID_MIN_EQUAL: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someID_MIN_GT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someID_MIN_GTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someID_MIN_LT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someID_MIN_LTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someInt_AVERAGE_EQUAL: Float
              someInt_AVERAGE_GT: Float
              someInt_AVERAGE_GTE: Float
              someInt_AVERAGE_LT: Float
              someInt_AVERAGE_LTE: Float
              someInt_MAX_EQUAL: Int
              someInt_MAX_GT: Int
              someInt_MAX_GTE: Int
              someInt_MAX_LT: Int
              someInt_MAX_LTE: Int
              someInt_MIN_EQUAL: Int
              someInt_MIN_GT: Int
              someInt_MIN_GTE: Int
              someInt_MIN_LT: Int
              someInt_MIN_LTE: Int
              someInt_SUM_EQUAL: Int
              someInt_SUM_GT: Int
              someInt_SUM_GTE: Int
              someInt_SUM_LT: Int
              someInt_SUM_LTE: Int
              someLocalDateTime_MAX_EQUAL: LocalDateTime
              someLocalDateTime_MAX_GT: LocalDateTime
              someLocalDateTime_MAX_GTE: LocalDateTime
              someLocalDateTime_MAX_LT: LocalDateTime
              someLocalDateTime_MAX_LTE: LocalDateTime
              someLocalDateTime_MIN_EQUAL: LocalDateTime
              someLocalDateTime_MIN_GT: LocalDateTime
              someLocalDateTime_MIN_GTE: LocalDateTime
              someLocalDateTime_MIN_LT: LocalDateTime
              someLocalDateTime_MIN_LTE: LocalDateTime
              someLocalTime_MAX_EQUAL: LocalTime
              someLocalTime_MAX_GT: LocalTime
              someLocalTime_MAX_GTE: LocalTime
              someLocalTime_MAX_LT: LocalTime
              someLocalTime_MAX_LTE: LocalTime
              someLocalTime_MIN_EQUAL: LocalTime
              someLocalTime_MIN_GT: LocalTime
              someLocalTime_MIN_GTE: LocalTime
              someLocalTime_MIN_LT: LocalTime
              someLocalTime_MIN_LTE: LocalTime
              someString_AVERAGE_LENGTH_EQUAL: Float
              someString_AVERAGE_LENGTH_GT: Float
              someString_AVERAGE_LENGTH_GTE: Float
              someString_AVERAGE_LENGTH_LT: Float
              someString_AVERAGE_LENGTH_LTE: Float
              someString_LONGEST_LENGTH_EQUAL: Int
              someString_LONGEST_LENGTH_GT: Int
              someString_LONGEST_LENGTH_GTE: Int
              someString_LONGEST_LENGTH_LT: Int
              someString_LONGEST_LENGTH_LTE: Int
              someString_SHORTEST_LENGTH_EQUAL: Int
              someString_SHORTEST_LENGTH_GT: Int
              someString_SHORTEST_LENGTH_GTE: Int
              someString_SHORTEST_LENGTH_LT: Int
              someString_SHORTEST_LENGTH_LTE: Int
              someTime_MAX_EQUAL: Time
              someTime_MAX_GT: Time
              someTime_MAX_GTE: Time
              someTime_MAX_LT: Time
              someTime_MAX_LTE: Time
              someTime_MIN_EQUAL: Time
              someTime_MIN_GT: Time
              someTime_MIN_GTE: Time
              someTime_MIN_LT: Time
              someTime_MIN_LTE: Time
            }

            type PostLikesRelationship {
              cursor: String!
              node: User!
              properties: Likes!
            }

            input PostLikesUpdateConnectionInput {
              edge: LikesUpdateInput
              node: UserUpdateInput
            }

            input PostLikesUpdateFieldInput {
              connect: [PostLikesConnectFieldInput!]
              create: [PostLikesCreateFieldInput!]
              delete: [PostLikesDeleteFieldInput!]
              disconnect: [PostLikesDisconnectFieldInput!]
              update: PostLikesUpdateConnectionInput
              where: PostLikesConnectionWhere
            }

            input PostOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more PostSort objects to sort Posts by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [PostSort!]
            }

            \\"\\"\\"
            Fields to sort Posts by. The order in which sorts are applied is not guaranteed when specifying many fields in one PostSort object.
            \\"\\"\\"
            input PostSort {
              someID: SortDirection
              title: SortDirection
            }

            input PostUpdateInput {
              likes: [PostLikesUpdateFieldInput!]
              someID: ID @deprecated(reason: \\"Please use the explicit _SET field\\")
              someID_SET: ID
              title: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              title_SET: String
            }

            type PostUserLikesAggregationSelection {
              count: Int!
              edge: PostUserLikesEdgeAggregateSelection
              node: PostUserLikesNodeAggregateSelection
            }

            type PostUserLikesEdgeAggregateSelection {
              someBigInt: BigIntAggregateSelection!
              someDateTime: DateTimeAggregateSelection!
              someDuration: DurationAggregateSelection!
              someFloat: FloatAggregateSelection!
              someID: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someInt: IntAggregateSelection!
              someLocalDateTime: LocalDateTimeAggregateSelection!
              someLocalTime: LocalTimeAggregateSelection!
              someString: StringAggregateSelection!
              someTime: TimeAggregateSelection!
            }

            type PostUserLikesNodeAggregateSelection {
              someBigInt: BigIntAggregateSelection!
              someDateTime: DateTimeAggregateSelection!
              someDuration: DurationAggregateSelection!
              someFloat: FloatAggregateSelection!
              someID: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someInt: IntAggregateSelection!
              someLocalDateTime: LocalDateTimeAggregateSelection!
              someLocalTime: LocalTimeAggregateSelection!
              someString: StringAggregateSelection!
              someTime: TimeAggregateSelection!
            }

            input PostWhere {
              AND: [PostWhere!]
              NOT: PostWhere
              OR: [PostWhere!]
              likesAggregate: PostLikesAggregateInput
              \\"\\"\\"
              Return Posts where all of the related PostLikesConnections match this filter
              \\"\\"\\"
              likesConnection_ALL: PostLikesConnectionWhere
              \\"\\"\\"
              Return Posts where none of the related PostLikesConnections match this filter
              \\"\\"\\"
              likesConnection_NONE: PostLikesConnectionWhere
              \\"\\"\\"
              Return Posts where one of the related PostLikesConnections match this filter
              \\"\\"\\"
              likesConnection_SINGLE: PostLikesConnectionWhere
              \\"\\"\\"
              Return Posts where some of the related PostLikesConnections match this filter
              \\"\\"\\"
              likesConnection_SOME: PostLikesConnectionWhere
              \\"\\"\\"Return Posts where all of the related Users match this filter\\"\\"\\"
              likes_ALL: UserWhere
              \\"\\"\\"Return Posts where none of the related Users match this filter\\"\\"\\"
              likes_NONE: UserWhere
              \\"\\"\\"Return Posts where one of the related Users match this filter\\"\\"\\"
              likes_SINGLE: UserWhere
              \\"\\"\\"Return Posts where some of the related Users match this filter\\"\\"\\"
              likes_SOME: UserWhere
              someID: ID @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someID_CONTAINS: ID
              someID_ENDS_WITH: ID
              someID_EQ: ID
              someID_IN: [ID]
              someID_STARTS_WITH: ID
              title: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              title_CONTAINS: String
              title_ENDS_WITH: String
              title_EQ: String
              title_IN: [String]
              title_STARTS_WITH: String
            }

            type PostsConnection {
              edges: [PostEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Query {
              posts(limit: Int, offset: Int, options: PostOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [PostSort!], where: PostWhere): [Post!]!
              postsAggregate(where: PostWhere): PostAggregateSelection!
              postsConnection(after: String, first: Int, sort: [PostSort!], where: PostWhere): PostsConnection!
              users(limit: Int, offset: Int, options: UserOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [UserSort!], where: UserWhere): [User!]!
              usersAggregate(where: UserWhere): UserAggregateSelection!
              usersConnection(after: String, first: Int, sort: [UserSort!], where: UserWhere): UsersConnection!
            }

            \\"\\"\\"An enum for sorting in either ascending or descending order.\\"\\"\\"
            enum SortDirection {
              \\"\\"\\"Sort by field values in ascending order.\\"\\"\\"
              ASC
              \\"\\"\\"Sort by field values in descending order.\\"\\"\\"
              DESC
            }

            type StringAggregateSelection {
              longest: String
              shortest: String
            }

            \\"\\"\\"A time, represented as an RFC3339 time string\\"\\"\\"
            scalar Time

            type TimeAggregateSelection {
              max: Time
              min: Time
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

            type UpdatePostsMutationResponse {
              info: UpdateInfo!
              posts: [Post!]!
            }

            type UpdateUsersMutationResponse {
              info: UpdateInfo!
              users: [User!]!
            }

            type User {
              someBigInt: BigInt
              someDateTime: DateTime
              someDuration: Duration
              someFloat: Float
              someID: ID
              someInt: Int
              someLocalDateTime: LocalDateTime
              someLocalTime: LocalTime
              someString: String
              someTime: Time
            }

            type UserAggregateSelection {
              count: Int!
              someBigInt: BigIntAggregateSelection!
              someDateTime: DateTimeAggregateSelection!
              someDuration: DurationAggregateSelection!
              someFloat: FloatAggregateSelection!
              someID: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              someInt: IntAggregateSelection!
              someLocalDateTime: LocalDateTimeAggregateSelection!
              someLocalTime: LocalTimeAggregateSelection!
              someString: StringAggregateSelection!
              someTime: TimeAggregateSelection!
            }

            input UserConnectWhere {
              node: UserWhere!
            }

            input UserCreateInput {
              someBigInt: BigInt
              someDateTime: DateTime
              someDuration: Duration
              someFloat: Float
              someID: ID
              someInt: Int
              someLocalDateTime: LocalDateTime
              someLocalTime: LocalTime
              someString: String
              someTime: Time
            }

            type UserEdge {
              cursor: String!
              node: User!
            }

            input UserOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more UserSort objects to sort Users by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [UserSort!]
            }

            \\"\\"\\"
            Fields to sort Users by. The order in which sorts are applied is not guaranteed when specifying many fields in one UserSort object.
            \\"\\"\\"
            input UserSort {
              someBigInt: SortDirection
              someDateTime: SortDirection
              someDuration: SortDirection
              someFloat: SortDirection
              someID: SortDirection
              someInt: SortDirection
              someLocalDateTime: SortDirection
              someLocalTime: SortDirection
              someString: SortDirection
              someTime: SortDirection
            }

            input UserUpdateInput {
              someBigInt: BigInt @deprecated(reason: \\"Please use the explicit _SET field\\")
              someBigInt_DECREMENT: BigInt
              someBigInt_INCREMENT: BigInt
              someBigInt_SET: BigInt
              someDateTime: DateTime @deprecated(reason: \\"Please use the explicit _SET field\\")
              someDateTime_SET: DateTime
              someDuration: Duration @deprecated(reason: \\"Please use the explicit _SET field\\")
              someDuration_SET: Duration
              someFloat: Float @deprecated(reason: \\"Please use the explicit _SET field\\")
              someFloat_ADD: Float
              someFloat_DIVIDE: Float
              someFloat_MULTIPLY: Float
              someFloat_SET: Float
              someFloat_SUBTRACT: Float
              someID: ID @deprecated(reason: \\"Please use the explicit _SET field\\")
              someID_SET: ID
              someInt: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              someInt_DECREMENT: Int
              someInt_INCREMENT: Int
              someInt_SET: Int
              someLocalDateTime: LocalDateTime @deprecated(reason: \\"Please use the explicit _SET field\\")
              someLocalDateTime_SET: LocalDateTime
              someLocalTime: LocalTime @deprecated(reason: \\"Please use the explicit _SET field\\")
              someLocalTime_SET: LocalTime
              someString: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              someString_SET: String
              someTime: Time @deprecated(reason: \\"Please use the explicit _SET field\\")
              someTime_SET: Time
            }

            input UserWhere {
              AND: [UserWhere!]
              NOT: UserWhere
              OR: [UserWhere!]
              someBigInt: BigInt @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someBigInt_EQ: BigInt
              someBigInt_GT: BigInt
              someBigInt_GTE: BigInt
              someBigInt_IN: [BigInt]
              someBigInt_LT: BigInt
              someBigInt_LTE: BigInt
              someDateTime: DateTime @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someDateTime_EQ: DateTime
              someDateTime_GT: DateTime
              someDateTime_GTE: DateTime
              someDateTime_IN: [DateTime]
              someDateTime_LT: DateTime
              someDateTime_LTE: DateTime
              someDuration: Duration @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someDuration_EQ: Duration
              someDuration_GT: Duration
              someDuration_GTE: Duration
              someDuration_IN: [Duration]
              someDuration_LT: Duration
              someDuration_LTE: Duration
              someFloat: Float @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someFloat_EQ: Float
              someFloat_GT: Float
              someFloat_GTE: Float
              someFloat_IN: [Float]
              someFloat_LT: Float
              someFloat_LTE: Float
              someID: ID @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someID_CONTAINS: ID
              someID_ENDS_WITH: ID
              someID_EQ: ID
              someID_IN: [ID]
              someID_STARTS_WITH: ID
              someInt: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someInt_EQ: Int
              someInt_GT: Int
              someInt_GTE: Int
              someInt_IN: [Int]
              someInt_LT: Int
              someInt_LTE: Int
              someLocalDateTime: LocalDateTime @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someLocalDateTime_EQ: LocalDateTime
              someLocalDateTime_GT: LocalDateTime
              someLocalDateTime_GTE: LocalDateTime
              someLocalDateTime_IN: [LocalDateTime]
              someLocalDateTime_LT: LocalDateTime
              someLocalDateTime_LTE: LocalDateTime
              someLocalTime: LocalTime @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someLocalTime_EQ: LocalTime
              someLocalTime_GT: LocalTime
              someLocalTime_GTE: LocalTime
              someLocalTime_IN: [LocalTime]
              someLocalTime_LT: LocalTime
              someLocalTime_LTE: LocalTime
              someString: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someString_CONTAINS: String
              someString_ENDS_WITH: String
              someString_EQ: String
              someString_IN: [String]
              someString_STARTS_WITH: String
              someTime: Time @deprecated(reason: \\"Please use the explicit _EQ version\\")
              someTime_EQ: Time
              someTime_GT: Time
              someTime_GTE: Time
              someTime_IN: [Time]
              someTime_LT: Time
              someTime_LTE: Time
            }

            type UsersConnection {
              edges: [UserEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }"
        `);
    });
});
