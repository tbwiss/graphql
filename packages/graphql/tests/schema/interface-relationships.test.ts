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

describe("Interface Relationships", () => {
    test("Interface Relationships - single", async () => {
        const typeDefs = gql`
            interface Production {
                title: String!
            }

            type Movie implements Production @node {
                title: String!
                runtime: Int!
            }

            type Series implements Production @node {
                title: String!
                episodes: Int!
            }

            type ActedIn @relationshipProperties {
                screenTime: Int!
            }

            type Actor @node {
                name: String!
                actedIn: [Production!]! @relationship(type: "ACTED_IN", direction: OUT, properties: "ActedIn")
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
            The edge properties for the following fields:
            * Actor.actedIn
            \\"\\"\\"
            type ActedIn {
              screenTime: Int!
            }

            input ActedInAggregationWhereInput {
              AND: [ActedInAggregationWhereInput!]
              NOT: ActedInAggregationWhereInput
              OR: [ActedInAggregationWhereInput!]
              screenTime_AVERAGE_EQUAL: Float
              screenTime_AVERAGE_GT: Float
              screenTime_AVERAGE_GTE: Float
              screenTime_AVERAGE_LT: Float
              screenTime_AVERAGE_LTE: Float
              screenTime_MAX_EQUAL: Int
              screenTime_MAX_GT: Int
              screenTime_MAX_GTE: Int
              screenTime_MAX_LT: Int
              screenTime_MAX_LTE: Int
              screenTime_MIN_EQUAL: Int
              screenTime_MIN_GT: Int
              screenTime_MIN_GTE: Int
              screenTime_MIN_LT: Int
              screenTime_MIN_LTE: Int
              screenTime_SUM_EQUAL: Int
              screenTime_SUM_GT: Int
              screenTime_SUM_GTE: Int
              screenTime_SUM_LT: Int
              screenTime_SUM_LTE: Int
            }

            input ActedInCreateInput {
              screenTime: Int!
            }

            input ActedInSort {
              screenTime: SortDirection
            }

            input ActedInUpdateInput {
              screenTime: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              screenTime_DECREMENT: Int
              screenTime_INCREMENT: Int
              screenTime_SET: Int
            }

            input ActedInWhere {
              AND: [ActedInWhere!]
              NOT: ActedInWhere
              OR: [ActedInWhere!]
              screenTime: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              screenTime_EQ: Int
              screenTime_GT: Int
              screenTime_GTE: Int
              screenTime_IN: [Int!]
              screenTime_LT: Int
              screenTime_LTE: Int
            }

            type Actor {
              actedIn(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: ProductionOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ProductionSort!], where: ProductionWhere): [Production!]!
              actedInAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: ProductionWhere): ActorProductionActedInAggregationSelection
              actedInConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [ActorActedInConnectionSort!], where: ActorActedInConnectionWhere): ActorActedInConnection!
              name: String!
            }

            input ActorActedInAggregateInput {
              AND: [ActorActedInAggregateInput!]
              NOT: ActorActedInAggregateInput
              OR: [ActorActedInAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: ActedInAggregationWhereInput
              node: ActorActedInNodeAggregationWhereInput
            }

            input ActorActedInConnectFieldInput {
              edge: ActedInCreateInput!
              where: ProductionConnectWhere
            }

            type ActorActedInConnection {
              edges: [ActorActedInRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input ActorActedInConnectionSort {
              edge: ActedInSort
              node: ProductionSort
            }

            input ActorActedInConnectionWhere {
              AND: [ActorActedInConnectionWhere!]
              NOT: ActorActedInConnectionWhere
              OR: [ActorActedInConnectionWhere!]
              edge: ActedInWhere
              node: ProductionWhere
            }

            input ActorActedInCreateFieldInput {
              edge: ActedInCreateInput!
              node: ProductionCreateInput!
            }

            input ActorActedInDeleteFieldInput {
              where: ActorActedInConnectionWhere
            }

            input ActorActedInDisconnectFieldInput {
              where: ActorActedInConnectionWhere
            }

            input ActorActedInFieldInput {
              connect: [ActorActedInConnectFieldInput!]
              create: [ActorActedInCreateFieldInput!]
            }

            input ActorActedInNodeAggregationWhereInput {
              AND: [ActorActedInNodeAggregationWhereInput!]
              NOT: ActorActedInNodeAggregationWhereInput
              OR: [ActorActedInNodeAggregationWhereInput!]
              title_AVERAGE_LENGTH_EQUAL: Float
              title_AVERAGE_LENGTH_GT: Float
              title_AVERAGE_LENGTH_GTE: Float
              title_AVERAGE_LENGTH_LT: Float
              title_AVERAGE_LENGTH_LTE: Float
              title_LONGEST_LENGTH_EQUAL: Int
              title_LONGEST_LENGTH_GT: Int
              title_LONGEST_LENGTH_GTE: Int
              title_LONGEST_LENGTH_LT: Int
              title_LONGEST_LENGTH_LTE: Int
              title_SHORTEST_LENGTH_EQUAL: Int
              title_SHORTEST_LENGTH_GT: Int
              title_SHORTEST_LENGTH_GTE: Int
              title_SHORTEST_LENGTH_LT: Int
              title_SHORTEST_LENGTH_LTE: Int
            }

            type ActorActedInRelationship {
              cursor: String!
              node: Production!
              properties: ActedIn!
            }

            input ActorActedInUpdateConnectionInput {
              edge: ActedInUpdateInput
              node: ProductionUpdateInput
            }

            input ActorActedInUpdateFieldInput {
              connect: [ActorActedInConnectFieldInput!]
              create: [ActorActedInCreateFieldInput!]
              delete: [ActorActedInDeleteFieldInput!]
              disconnect: [ActorActedInDisconnectFieldInput!]
              update: ActorActedInUpdateConnectionInput
              where: ActorActedInConnectionWhere
            }

            type ActorAggregateSelection {
              count: Int!
              name: StringAggregateSelection!
            }

            input ActorCreateInput {
              actedIn: ActorActedInFieldInput
              name: String!
            }

            input ActorDeleteInput {
              actedIn: [ActorActedInDeleteFieldInput!]
            }

            type ActorEdge {
              cursor: String!
              node: Actor!
            }

            input ActorOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more ActorSort objects to sort Actors by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [ActorSort!]
            }

            type ActorProductionActedInAggregationSelection {
              count: Int!
              edge: ActorProductionActedInEdgeAggregateSelection
              node: ActorProductionActedInNodeAggregateSelection
            }

            type ActorProductionActedInEdgeAggregateSelection {
              screenTime: IntAggregateSelection!
            }

            type ActorProductionActedInNodeAggregateSelection {
              title: StringAggregateSelection!
            }

            \\"\\"\\"
            Fields to sort Actors by. The order in which sorts are applied is not guaranteed when specifying many fields in one ActorSort object.
            \\"\\"\\"
            input ActorSort {
              name: SortDirection
            }

            input ActorUpdateInput {
              actedIn: [ActorActedInUpdateFieldInput!]
              name: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              name_SET: String
            }

            input ActorWhere {
              AND: [ActorWhere!]
              NOT: ActorWhere
              OR: [ActorWhere!]
              actedInAggregate: ActorActedInAggregateInput
              \\"\\"\\"
              Return Actors where all of the related ActorActedInConnections match this filter
              \\"\\"\\"
              actedInConnection_ALL: ActorActedInConnectionWhere
              \\"\\"\\"
              Return Actors where none of the related ActorActedInConnections match this filter
              \\"\\"\\"
              actedInConnection_NONE: ActorActedInConnectionWhere
              \\"\\"\\"
              Return Actors where one of the related ActorActedInConnections match this filter
              \\"\\"\\"
              actedInConnection_SINGLE: ActorActedInConnectionWhere
              \\"\\"\\"
              Return Actors where some of the related ActorActedInConnections match this filter
              \\"\\"\\"
              actedInConnection_SOME: ActorActedInConnectionWhere
              \\"\\"\\"Return Actors where all of the related Productions match this filter\\"\\"\\"
              actedIn_ALL: ProductionWhere
              \\"\\"\\"Return Actors where none of the related Productions match this filter\\"\\"\\"
              actedIn_NONE: ProductionWhere
              \\"\\"\\"Return Actors where one of the related Productions match this filter\\"\\"\\"
              actedIn_SINGLE: ProductionWhere
              \\"\\"\\"Return Actors where some of the related Productions match this filter\\"\\"\\"
              actedIn_SOME: ProductionWhere
              name: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              name_CONTAINS: String
              name_ENDS_WITH: String
              name_EQ: String
              name_IN: [String!]
              name_STARTS_WITH: String
            }

            type ActorsConnection {
              edges: [ActorEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type CreateActorsMutationResponse {
              actors: [Actor!]!
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

            type CreateSeriesMutationResponse {
              info: CreateInfo!
              series: [Series!]!
            }

            \\"\\"\\"
            Information about the number of nodes and relationships deleted during a delete mutation
            \\"\\"\\"
            type DeleteInfo {
              nodesDeleted: Int!
              relationshipsDeleted: Int!
            }

            type IntAggregateSelection {
              average: Float
              max: Int
              min: Int
              sum: Int
            }

            type Movie implements Production {
              runtime: Int!
              title: String!
            }

            type MovieAggregateSelection {
              count: Int!
              runtime: IntAggregateSelection!
              title: StringAggregateSelection!
            }

            input MovieCreateInput {
              runtime: Int!
              title: String!
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
              runtime: SortDirection
              title: SortDirection
            }

            input MovieUpdateInput {
              runtime: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              runtime_DECREMENT: Int
              runtime_INCREMENT: Int
              runtime_SET: Int
              title: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              title_SET: String
            }

            input MovieWhere {
              AND: [MovieWhere!]
              NOT: MovieWhere
              OR: [MovieWhere!]
              runtime: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              runtime_EQ: Int
              runtime_GT: Int
              runtime_GTE: Int
              runtime_IN: [Int!]
              runtime_LT: Int
              runtime_LTE: Int
              title: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              title_CONTAINS: String
              title_ENDS_WITH: String
              title_EQ: String
              title_IN: [String!]
              title_STARTS_WITH: String
            }

            type MoviesConnection {
              edges: [MovieEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Mutation {
              createActors(input: [ActorCreateInput!]!): CreateActorsMutationResponse!
              createMovies(input: [MovieCreateInput!]!): CreateMoviesMutationResponse!
              createSeries(input: [SeriesCreateInput!]!): CreateSeriesMutationResponse!
              deleteActors(delete: ActorDeleteInput, where: ActorWhere): DeleteInfo!
              deleteMovies(where: MovieWhere): DeleteInfo!
              deleteSeries(where: SeriesWhere): DeleteInfo!
              updateActors(update: ActorUpdateInput, where: ActorWhere): UpdateActorsMutationResponse!
              updateMovies(update: MovieUpdateInput, where: MovieWhere): UpdateMoviesMutationResponse!
              updateSeries(update: SeriesUpdateInput, where: SeriesWhere): UpdateSeriesMutationResponse!
            }

            \\"\\"\\"Pagination information (Relay)\\"\\"\\"
            type PageInfo {
              endCursor: String
              hasNextPage: Boolean!
              hasPreviousPage: Boolean!
              startCursor: String
            }

            interface Production {
              title: String!
            }

            type ProductionAggregateSelection {
              count: Int!
              title: StringAggregateSelection!
            }

            input ProductionConnectWhere {
              node: ProductionWhere!
            }

            input ProductionCreateInput {
              Movie: MovieCreateInput
              Series: SeriesCreateInput
            }

            type ProductionEdge {
              cursor: String!
              node: Production!
            }

            enum ProductionImplementation {
              Movie
              Series
            }

            input ProductionOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more ProductionSort objects to sort Productions by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [ProductionSort!]
            }

            \\"\\"\\"
            Fields to sort Productions by. The order in which sorts are applied is not guaranteed when specifying many fields in one ProductionSort object.
            \\"\\"\\"
            input ProductionSort {
              title: SortDirection
            }

            input ProductionUpdateInput {
              title: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              title_SET: String
            }

            input ProductionWhere {
              AND: [ProductionWhere!]
              NOT: ProductionWhere
              OR: [ProductionWhere!]
              title: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              title_CONTAINS: String
              title_ENDS_WITH: String
              title_EQ: String
              title_IN: [String!]
              title_STARTS_WITH: String
              typename: [ProductionImplementation!]
              typename_IN: [ProductionImplementation!] @deprecated(reason: \\"The typename_IN filter is deprecated, please use the typename filter instead\\")
            }

            type ProductionsConnection {
              edges: [ProductionEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Query {
              actors(limit: Int, offset: Int, options: ActorOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ActorSort!], where: ActorWhere): [Actor!]!
              actorsAggregate(where: ActorWhere): ActorAggregateSelection!
              actorsConnection(after: String, first: Int, sort: [ActorSort!], where: ActorWhere): ActorsConnection!
              movies(limit: Int, offset: Int, options: MovieOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [MovieSort!], where: MovieWhere): [Movie!]!
              moviesAggregate(where: MovieWhere): MovieAggregateSelection!
              moviesConnection(after: String, first: Int, sort: [MovieSort!], where: MovieWhere): MoviesConnection!
              productions(limit: Int, offset: Int, options: ProductionOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ProductionSort!], where: ProductionWhere): [Production!]!
              productionsAggregate(where: ProductionWhere): ProductionAggregateSelection!
              productionsConnection(after: String, first: Int, sort: [ProductionSort!], where: ProductionWhere): ProductionsConnection!
              series(limit: Int, offset: Int, options: SeriesOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [SeriesSort!], where: SeriesWhere): [Series!]!
              seriesAggregate(where: SeriesWhere): SeriesAggregateSelection!
              seriesConnection(after: String, first: Int, sort: [SeriesSort!], where: SeriesWhere): SeriesConnection!
            }

            type Series implements Production {
              episodes: Int!
              title: String!
            }

            type SeriesAggregateSelection {
              count: Int!
              episodes: IntAggregateSelection!
              title: StringAggregateSelection!
            }

            type SeriesConnection {
              edges: [SeriesEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input SeriesCreateInput {
              episodes: Int!
              title: String!
            }

            type SeriesEdge {
              cursor: String!
              node: Series!
            }

            input SeriesOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more SeriesSort objects to sort Series by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [SeriesSort!]
            }

            \\"\\"\\"
            Fields to sort Series by. The order in which sorts are applied is not guaranteed when specifying many fields in one SeriesSort object.
            \\"\\"\\"
            input SeriesSort {
              episodes: SortDirection
              title: SortDirection
            }

            input SeriesUpdateInput {
              episodes: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              episodes_DECREMENT: Int
              episodes_INCREMENT: Int
              episodes_SET: Int
              title: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              title_SET: String
            }

            input SeriesWhere {
              AND: [SeriesWhere!]
              NOT: SeriesWhere
              OR: [SeriesWhere!]
              episodes: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              episodes_EQ: Int
              episodes_GT: Int
              episodes_GTE: Int
              episodes_IN: [Int!]
              episodes_LT: Int
              episodes_LTE: Int
              title: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              title_CONTAINS: String
              title_ENDS_WITH: String
              title_EQ: String
              title_IN: [String!]
              title_STARTS_WITH: String
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

            type UpdateActorsMutationResponse {
              actors: [Actor!]!
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
            }

            type UpdateSeriesMutationResponse {
              info: UpdateInfo!
              series: [Series!]!
            }"
        `);
    });

    test("Interface Relationships - multiple - same relationship implementation", async () => {
        const typeDefs = gql`
            type Episode @node {
                runtime: Int!
                series: Series! @relationship(type: "HAS_EPISODE", direction: IN)
            }

            interface Production {
                title: String!
                actors: [Actor!]! @declareRelationship
            }

            type Movie implements Production @node {
                title: String!
                runtime: Int!
                actors: [Actor!]! @relationship(type: "ACTED_IN", direction: IN, properties: "ActedIn")
            }

            type Series implements Production @node {
                title: String!
                episodeCount: Int!
                episodes: [Episode!]! @relationship(type: "HAS_EPISODE", direction: OUT)
                actors: [Actor!]! @relationship(type: "ACTED_IN", direction: IN, properties: "ActedIn")
            }

            type ActedIn @relationshipProperties {
                screenTime: Int!
            }

            type Actor @node {
                name: String!
                actedIn: [Production!]! @relationship(type: "ACTED_IN", direction: OUT, properties: "ActedIn")
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
            The edge properties for the following fields:
            * Movie.actors
            * Series.actors
            * Actor.actedIn
            \\"\\"\\"
            type ActedIn {
              screenTime: Int!
            }

            input ActedInAggregationWhereInput {
              AND: [ActedInAggregationWhereInput!]
              NOT: ActedInAggregationWhereInput
              OR: [ActedInAggregationWhereInput!]
              screenTime_AVERAGE_EQUAL: Float
              screenTime_AVERAGE_GT: Float
              screenTime_AVERAGE_GTE: Float
              screenTime_AVERAGE_LT: Float
              screenTime_AVERAGE_LTE: Float
              screenTime_MAX_EQUAL: Int
              screenTime_MAX_GT: Int
              screenTime_MAX_GTE: Int
              screenTime_MAX_LT: Int
              screenTime_MAX_LTE: Int
              screenTime_MIN_EQUAL: Int
              screenTime_MIN_GT: Int
              screenTime_MIN_GTE: Int
              screenTime_MIN_LT: Int
              screenTime_MIN_LTE: Int
              screenTime_SUM_EQUAL: Int
              screenTime_SUM_GT: Int
              screenTime_SUM_GTE: Int
              screenTime_SUM_LT: Int
              screenTime_SUM_LTE: Int
            }

            input ActedInCreateInput {
              screenTime: Int!
            }

            input ActedInSort {
              screenTime: SortDirection
            }

            input ActedInUpdateInput {
              screenTime: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              screenTime_DECREMENT: Int
              screenTime_INCREMENT: Int
              screenTime_SET: Int
            }

            input ActedInWhere {
              AND: [ActedInWhere!]
              NOT: ActedInWhere
              OR: [ActedInWhere!]
              screenTime: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              screenTime_EQ: Int
              screenTime_GT: Int
              screenTime_GTE: Int
              screenTime_IN: [Int!]
              screenTime_LT: Int
              screenTime_LTE: Int
            }

            type Actor {
              actedIn(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: ProductionOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ProductionSort!], where: ProductionWhere): [Production!]!
              actedInAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: ProductionWhere): ActorProductionActedInAggregationSelection
              actedInConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [ActorActedInConnectionSort!], where: ActorActedInConnectionWhere): ActorActedInConnection!
              name: String!
            }

            input ActorActedInAggregateInput {
              AND: [ActorActedInAggregateInput!]
              NOT: ActorActedInAggregateInput
              OR: [ActorActedInAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: ActedInAggregationWhereInput
              node: ActorActedInNodeAggregationWhereInput
            }

            input ActorActedInConnectFieldInput {
              connect: ProductionConnectInput
              edge: ActedInCreateInput!
              where: ProductionConnectWhere
            }

            type ActorActedInConnection {
              edges: [ActorActedInRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input ActorActedInConnectionSort {
              edge: ActedInSort
              node: ProductionSort
            }

            input ActorActedInConnectionWhere {
              AND: [ActorActedInConnectionWhere!]
              NOT: ActorActedInConnectionWhere
              OR: [ActorActedInConnectionWhere!]
              edge: ActedInWhere
              node: ProductionWhere
            }

            input ActorActedInCreateFieldInput {
              edge: ActedInCreateInput!
              node: ProductionCreateInput!
            }

            input ActorActedInDeleteFieldInput {
              delete: ProductionDeleteInput
              where: ActorActedInConnectionWhere
            }

            input ActorActedInDisconnectFieldInput {
              disconnect: ProductionDisconnectInput
              where: ActorActedInConnectionWhere
            }

            input ActorActedInFieldInput {
              connect: [ActorActedInConnectFieldInput!]
              create: [ActorActedInCreateFieldInput!]
            }

            input ActorActedInNodeAggregationWhereInput {
              AND: [ActorActedInNodeAggregationWhereInput!]
              NOT: ActorActedInNodeAggregationWhereInput
              OR: [ActorActedInNodeAggregationWhereInput!]
              title_AVERAGE_LENGTH_EQUAL: Float
              title_AVERAGE_LENGTH_GT: Float
              title_AVERAGE_LENGTH_GTE: Float
              title_AVERAGE_LENGTH_LT: Float
              title_AVERAGE_LENGTH_LTE: Float
              title_LONGEST_LENGTH_EQUAL: Int
              title_LONGEST_LENGTH_GT: Int
              title_LONGEST_LENGTH_GTE: Int
              title_LONGEST_LENGTH_LT: Int
              title_LONGEST_LENGTH_LTE: Int
              title_SHORTEST_LENGTH_EQUAL: Int
              title_SHORTEST_LENGTH_GT: Int
              title_SHORTEST_LENGTH_GTE: Int
              title_SHORTEST_LENGTH_LT: Int
              title_SHORTEST_LENGTH_LTE: Int
            }

            type ActorActedInRelationship {
              cursor: String!
              node: Production!
              properties: ActedIn!
            }

            input ActorActedInUpdateConnectionInput {
              edge: ActedInUpdateInput
              node: ProductionUpdateInput
            }

            input ActorActedInUpdateFieldInput {
              connect: [ActorActedInConnectFieldInput!]
              create: [ActorActedInCreateFieldInput!]
              delete: [ActorActedInDeleteFieldInput!]
              disconnect: [ActorActedInDisconnectFieldInput!]
              update: ActorActedInUpdateConnectionInput
              where: ActorActedInConnectionWhere
            }

            type ActorAggregateSelection {
              count: Int!
              name: StringAggregateSelection!
            }

            input ActorConnectInput {
              actedIn: [ActorActedInConnectFieldInput!]
            }

            input ActorConnectWhere {
              node: ActorWhere!
            }

            input ActorCreateInput {
              actedIn: ActorActedInFieldInput
              name: String!
            }

            input ActorDeleteInput {
              actedIn: [ActorActedInDeleteFieldInput!]
            }

            input ActorDisconnectInput {
              actedIn: [ActorActedInDisconnectFieldInput!]
            }

            type ActorEdge {
              cursor: String!
              node: Actor!
            }

            input ActorOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more ActorSort objects to sort Actors by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [ActorSort!]
            }

            type ActorProductionActedInAggregationSelection {
              count: Int!
              edge: ActorProductionActedInEdgeAggregateSelection
              node: ActorProductionActedInNodeAggregateSelection
            }

            type ActorProductionActedInEdgeAggregateSelection {
              screenTime: IntAggregateSelection!
            }

            type ActorProductionActedInNodeAggregateSelection {
              title: StringAggregateSelection!
            }

            \\"\\"\\"
            Fields to sort Actors by. The order in which sorts are applied is not guaranteed when specifying many fields in one ActorSort object.
            \\"\\"\\"
            input ActorSort {
              name: SortDirection
            }

            input ActorUpdateInput {
              actedIn: [ActorActedInUpdateFieldInput!]
              name: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              name_SET: String
            }

            input ActorWhere {
              AND: [ActorWhere!]
              NOT: ActorWhere
              OR: [ActorWhere!]
              actedInAggregate: ActorActedInAggregateInput
              \\"\\"\\"
              Return Actors where all of the related ActorActedInConnections match this filter
              \\"\\"\\"
              actedInConnection_ALL: ActorActedInConnectionWhere
              \\"\\"\\"
              Return Actors where none of the related ActorActedInConnections match this filter
              \\"\\"\\"
              actedInConnection_NONE: ActorActedInConnectionWhere
              \\"\\"\\"
              Return Actors where one of the related ActorActedInConnections match this filter
              \\"\\"\\"
              actedInConnection_SINGLE: ActorActedInConnectionWhere
              \\"\\"\\"
              Return Actors where some of the related ActorActedInConnections match this filter
              \\"\\"\\"
              actedInConnection_SOME: ActorActedInConnectionWhere
              \\"\\"\\"Return Actors where all of the related Productions match this filter\\"\\"\\"
              actedIn_ALL: ProductionWhere
              \\"\\"\\"Return Actors where none of the related Productions match this filter\\"\\"\\"
              actedIn_NONE: ProductionWhere
              \\"\\"\\"Return Actors where one of the related Productions match this filter\\"\\"\\"
              actedIn_SINGLE: ProductionWhere
              \\"\\"\\"Return Actors where some of the related Productions match this filter\\"\\"\\"
              actedIn_SOME: ProductionWhere
              name: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              name_CONTAINS: String
              name_ENDS_WITH: String
              name_EQ: String
              name_IN: [String!]
              name_STARTS_WITH: String
            }

            type ActorsConnection {
              edges: [ActorEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type CreateActorsMutationResponse {
              actors: [Actor!]!
              info: CreateInfo!
            }

            type CreateEpisodesMutationResponse {
              episodes: [Episode!]!
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

            type CreateSeriesMutationResponse {
              info: CreateInfo!
              series: [Series!]!
            }

            \\"\\"\\"
            Information about the number of nodes and relationships deleted during a delete mutation
            \\"\\"\\"
            type DeleteInfo {
              nodesDeleted: Int!
              relationshipsDeleted: Int!
            }

            type Episode {
              runtime: Int!
              series(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: SeriesOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [SeriesSort!], where: SeriesWhere): Series!
              seriesAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: SeriesWhere): EpisodeSeriesSeriesAggregationSelection
              seriesConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [EpisodeSeriesConnectionSort!], where: EpisodeSeriesConnectionWhere): EpisodeSeriesConnection!
            }

            type EpisodeAggregateSelection {
              count: Int!
              runtime: IntAggregateSelection!
            }

            input EpisodeConnectInput {
              series: EpisodeSeriesConnectFieldInput
            }

            input EpisodeConnectWhere {
              node: EpisodeWhere!
            }

            input EpisodeCreateInput {
              runtime: Int!
              series: EpisodeSeriesFieldInput
            }

            input EpisodeDeleteInput {
              series: EpisodeSeriesDeleteFieldInput
            }

            input EpisodeDisconnectInput {
              series: EpisodeSeriesDisconnectFieldInput
            }

            type EpisodeEdge {
              cursor: String!
              node: Episode!
            }

            input EpisodeOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more EpisodeSort objects to sort Episodes by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [EpisodeSort!]
            }

            input EpisodeSeriesAggregateInput {
              AND: [EpisodeSeriesAggregateInput!]
              NOT: EpisodeSeriesAggregateInput
              OR: [EpisodeSeriesAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              node: EpisodeSeriesNodeAggregationWhereInput
            }

            input EpisodeSeriesConnectFieldInput {
              connect: SeriesConnectInput
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: SeriesConnectWhere
            }

            type EpisodeSeriesConnection {
              edges: [EpisodeSeriesRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input EpisodeSeriesConnectionSort {
              node: SeriesSort
            }

            input EpisodeSeriesConnectionWhere {
              AND: [EpisodeSeriesConnectionWhere!]
              NOT: EpisodeSeriesConnectionWhere
              OR: [EpisodeSeriesConnectionWhere!]
              node: SeriesWhere
            }

            input EpisodeSeriesCreateFieldInput {
              node: SeriesCreateInput!
            }

            input EpisodeSeriesDeleteFieldInput {
              delete: SeriesDeleteInput
              where: EpisodeSeriesConnectionWhere
            }

            input EpisodeSeriesDisconnectFieldInput {
              disconnect: SeriesDisconnectInput
              where: EpisodeSeriesConnectionWhere
            }

            input EpisodeSeriesFieldInput {
              connect: EpisodeSeriesConnectFieldInput
              create: EpisodeSeriesCreateFieldInput
            }

            input EpisodeSeriesNodeAggregationWhereInput {
              AND: [EpisodeSeriesNodeAggregationWhereInput!]
              NOT: EpisodeSeriesNodeAggregationWhereInput
              OR: [EpisodeSeriesNodeAggregationWhereInput!]
              episodeCount_AVERAGE_EQUAL: Float
              episodeCount_AVERAGE_GT: Float
              episodeCount_AVERAGE_GTE: Float
              episodeCount_AVERAGE_LT: Float
              episodeCount_AVERAGE_LTE: Float
              episodeCount_MAX_EQUAL: Int
              episodeCount_MAX_GT: Int
              episodeCount_MAX_GTE: Int
              episodeCount_MAX_LT: Int
              episodeCount_MAX_LTE: Int
              episodeCount_MIN_EQUAL: Int
              episodeCount_MIN_GT: Int
              episodeCount_MIN_GTE: Int
              episodeCount_MIN_LT: Int
              episodeCount_MIN_LTE: Int
              episodeCount_SUM_EQUAL: Int
              episodeCount_SUM_GT: Int
              episodeCount_SUM_GTE: Int
              episodeCount_SUM_LT: Int
              episodeCount_SUM_LTE: Int
              title_AVERAGE_LENGTH_EQUAL: Float
              title_AVERAGE_LENGTH_GT: Float
              title_AVERAGE_LENGTH_GTE: Float
              title_AVERAGE_LENGTH_LT: Float
              title_AVERAGE_LENGTH_LTE: Float
              title_LONGEST_LENGTH_EQUAL: Int
              title_LONGEST_LENGTH_GT: Int
              title_LONGEST_LENGTH_GTE: Int
              title_LONGEST_LENGTH_LT: Int
              title_LONGEST_LENGTH_LTE: Int
              title_SHORTEST_LENGTH_EQUAL: Int
              title_SHORTEST_LENGTH_GT: Int
              title_SHORTEST_LENGTH_GTE: Int
              title_SHORTEST_LENGTH_LT: Int
              title_SHORTEST_LENGTH_LTE: Int
            }

            type EpisodeSeriesRelationship {
              cursor: String!
              node: Series!
            }

            type EpisodeSeriesSeriesAggregationSelection {
              count: Int!
              node: EpisodeSeriesSeriesNodeAggregateSelection
            }

            type EpisodeSeriesSeriesNodeAggregateSelection {
              episodeCount: IntAggregateSelection!
              title: StringAggregateSelection!
            }

            input EpisodeSeriesUpdateConnectionInput {
              node: SeriesUpdateInput
            }

            input EpisodeSeriesUpdateFieldInput {
              connect: EpisodeSeriesConnectFieldInput
              create: EpisodeSeriesCreateFieldInput
              delete: EpisodeSeriesDeleteFieldInput
              disconnect: EpisodeSeriesDisconnectFieldInput
              update: EpisodeSeriesUpdateConnectionInput
              where: EpisodeSeriesConnectionWhere
            }

            \\"\\"\\"
            Fields to sort Episodes by. The order in which sorts are applied is not guaranteed when specifying many fields in one EpisodeSort object.
            \\"\\"\\"
            input EpisodeSort {
              runtime: SortDirection
            }

            input EpisodeUpdateInput {
              runtime: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              runtime_DECREMENT: Int
              runtime_INCREMENT: Int
              runtime_SET: Int
              series: EpisodeSeriesUpdateFieldInput
            }

            input EpisodeWhere {
              AND: [EpisodeWhere!]
              NOT: EpisodeWhere
              OR: [EpisodeWhere!]
              runtime: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              runtime_EQ: Int
              runtime_GT: Int
              runtime_GTE: Int
              runtime_IN: [Int!]
              runtime_LT: Int
              runtime_LTE: Int
              series: SeriesWhere
              seriesAggregate: EpisodeSeriesAggregateInput
              seriesConnection: EpisodeSeriesConnectionWhere
            }

            type EpisodesConnection {
              edges: [EpisodeEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type IntAggregateSelection {
              average: Float
              max: Int
              min: Int
              sum: Int
            }

            type Movie implements Production {
              actors(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: ActorOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ActorSort!], where: ActorWhere): [Actor!]!
              actorsAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: ActorWhere): MovieActorActorsAggregationSelection
              actorsConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [ProductionActorsConnectionSort!], where: ProductionActorsConnectionWhere): ProductionActorsConnection!
              runtime: Int!
              title: String!
            }

            type MovieActorActorsAggregationSelection {
              count: Int!
              edge: MovieActorActorsEdgeAggregateSelection
              node: MovieActorActorsNodeAggregateSelection
            }

            type MovieActorActorsEdgeAggregateSelection {
              screenTime: IntAggregateSelection!
            }

            type MovieActorActorsNodeAggregateSelection {
              name: StringAggregateSelection!
            }

            input MovieActorsAggregateInput {
              AND: [MovieActorsAggregateInput!]
              NOT: MovieActorsAggregateInput
              OR: [MovieActorsAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: ActedInAggregationWhereInput
              node: MovieActorsNodeAggregationWhereInput
            }

            input MovieActorsConnectFieldInput {
              connect: [ActorConnectInput!]
              edge: ActedInCreateInput!
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: ActorConnectWhere
            }

            input MovieActorsCreateFieldInput {
              edge: ActedInCreateInput!
              node: ActorCreateInput!
            }

            input MovieActorsFieldInput {
              connect: [MovieActorsConnectFieldInput!]
              create: [MovieActorsCreateFieldInput!]
            }

            input MovieActorsNodeAggregationWhereInput {
              AND: [MovieActorsNodeAggregationWhereInput!]
              NOT: MovieActorsNodeAggregationWhereInput
              OR: [MovieActorsNodeAggregationWhereInput!]
              name_AVERAGE_LENGTH_EQUAL: Float
              name_AVERAGE_LENGTH_GT: Float
              name_AVERAGE_LENGTH_GTE: Float
              name_AVERAGE_LENGTH_LT: Float
              name_AVERAGE_LENGTH_LTE: Float
              name_LONGEST_LENGTH_EQUAL: Int
              name_LONGEST_LENGTH_GT: Int
              name_LONGEST_LENGTH_GTE: Int
              name_LONGEST_LENGTH_LT: Int
              name_LONGEST_LENGTH_LTE: Int
              name_SHORTEST_LENGTH_EQUAL: Int
              name_SHORTEST_LENGTH_GT: Int
              name_SHORTEST_LENGTH_GTE: Int
              name_SHORTEST_LENGTH_LT: Int
              name_SHORTEST_LENGTH_LTE: Int
            }

            input MovieActorsUpdateConnectionInput {
              edge: ActedInUpdateInput
              node: ActorUpdateInput
            }

            input MovieActorsUpdateFieldInput {
              connect: [MovieActorsConnectFieldInput!]
              create: [MovieActorsCreateFieldInput!]
              delete: [ProductionActorsDeleteFieldInput!]
              disconnect: [ProductionActorsDisconnectFieldInput!]
              update: MovieActorsUpdateConnectionInput
              where: ProductionActorsConnectionWhere
            }

            type MovieAggregateSelection {
              count: Int!
              runtime: IntAggregateSelection!
              title: StringAggregateSelection!
            }

            input MovieCreateInput {
              actors: MovieActorsFieldInput
              runtime: Int!
              title: String!
            }

            input MovieDeleteInput {
              actors: [ProductionActorsDeleteFieldInput!]
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
              runtime: SortDirection
              title: SortDirection
            }

            input MovieUpdateInput {
              actors: [MovieActorsUpdateFieldInput!]
              runtime: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              runtime_DECREMENT: Int
              runtime_INCREMENT: Int
              runtime_SET: Int
              title: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              title_SET: String
            }

            input MovieWhere {
              AND: [MovieWhere!]
              NOT: MovieWhere
              OR: [MovieWhere!]
              actorsAggregate: MovieActorsAggregateInput
              \\"\\"\\"
              Return Movies where all of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_ALL: ProductionActorsConnectionWhere
              \\"\\"\\"
              Return Movies where none of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_NONE: ProductionActorsConnectionWhere
              \\"\\"\\"
              Return Movies where one of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_SINGLE: ProductionActorsConnectionWhere
              \\"\\"\\"
              Return Movies where some of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_SOME: ProductionActorsConnectionWhere
              \\"\\"\\"Return Movies where all of the related Actors match this filter\\"\\"\\"
              actors_ALL: ActorWhere
              \\"\\"\\"Return Movies where none of the related Actors match this filter\\"\\"\\"
              actors_NONE: ActorWhere
              \\"\\"\\"Return Movies where one of the related Actors match this filter\\"\\"\\"
              actors_SINGLE: ActorWhere
              \\"\\"\\"Return Movies where some of the related Actors match this filter\\"\\"\\"
              actors_SOME: ActorWhere
              runtime: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              runtime_EQ: Int
              runtime_GT: Int
              runtime_GTE: Int
              runtime_IN: [Int!]
              runtime_LT: Int
              runtime_LTE: Int
              title: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              title_CONTAINS: String
              title_ENDS_WITH: String
              title_EQ: String
              title_IN: [String!]
              title_STARTS_WITH: String
            }

            type MoviesConnection {
              edges: [MovieEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Mutation {
              createActors(input: [ActorCreateInput!]!): CreateActorsMutationResponse!
              createEpisodes(input: [EpisodeCreateInput!]!): CreateEpisodesMutationResponse!
              createMovies(input: [MovieCreateInput!]!): CreateMoviesMutationResponse!
              createSeries(input: [SeriesCreateInput!]!): CreateSeriesMutationResponse!
              deleteActors(delete: ActorDeleteInput, where: ActorWhere): DeleteInfo!
              deleteEpisodes(delete: EpisodeDeleteInput, where: EpisodeWhere): DeleteInfo!
              deleteMovies(delete: MovieDeleteInput, where: MovieWhere): DeleteInfo!
              deleteSeries(delete: SeriesDeleteInput, where: SeriesWhere): DeleteInfo!
              updateActors(update: ActorUpdateInput, where: ActorWhere): UpdateActorsMutationResponse!
              updateEpisodes(update: EpisodeUpdateInput, where: EpisodeWhere): UpdateEpisodesMutationResponse!
              updateMovies(update: MovieUpdateInput, where: MovieWhere): UpdateMoviesMutationResponse!
              updateSeries(update: SeriesUpdateInput, where: SeriesWhere): UpdateSeriesMutationResponse!
            }

            \\"\\"\\"Pagination information (Relay)\\"\\"\\"
            type PageInfo {
              endCursor: String
              hasNextPage: Boolean!
              hasPreviousPage: Boolean!
              startCursor: String
            }

            interface Production {
              actors(limit: Int, offset: Int, options: ActorOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ActorSort!], where: ActorWhere): [Actor!]!
              actorsConnection(after: String, first: Int, sort: [ProductionActorsConnectionSort!], where: ProductionActorsConnectionWhere): ProductionActorsConnection!
              title: String!
            }

            input ProductionActorsAggregateInput {
              AND: [ProductionActorsAggregateInput!]
              NOT: ProductionActorsAggregateInput
              OR: [ProductionActorsAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: ProductionActorsEdgeAggregationWhereInput
              node: ProductionActorsNodeAggregationWhereInput
            }

            input ProductionActorsConnectFieldInput {
              connect: [ActorConnectInput!]
              edge: ProductionActorsEdgeCreateInput!
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: ActorConnectWhere
            }

            type ProductionActorsConnection {
              edges: [ProductionActorsRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input ProductionActorsConnectionSort {
              edge: ProductionActorsEdgeSort
              node: ActorSort
            }

            input ProductionActorsConnectionWhere {
              AND: [ProductionActorsConnectionWhere!]
              NOT: ProductionActorsConnectionWhere
              OR: [ProductionActorsConnectionWhere!]
              edge: ProductionActorsEdgeWhere
              node: ActorWhere
            }

            input ProductionActorsCreateFieldInput {
              edge: ProductionActorsEdgeCreateInput!
              node: ActorCreateInput!
            }

            input ProductionActorsDeleteFieldInput {
              delete: ActorDeleteInput
              where: ProductionActorsConnectionWhere
            }

            input ProductionActorsDisconnectFieldInput {
              disconnect: ActorDisconnectInput
              where: ProductionActorsConnectionWhere
            }

            input ProductionActorsEdgeAggregationWhereInput {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Movie
              * Series
              \\"\\"\\"
              ActedIn: ActedInAggregationWhereInput
            }

            input ProductionActorsEdgeCreateInput {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Movie
              * Series
              \\"\\"\\"
              ActedIn: ActedInCreateInput!
            }

            input ProductionActorsEdgeSort {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Movie
              * Series
              \\"\\"\\"
              ActedIn: ActedInSort
            }

            input ProductionActorsEdgeUpdateInput {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Movie
              * Series
              \\"\\"\\"
              ActedIn: ActedInUpdateInput
            }

            input ProductionActorsEdgeWhere {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Movie
              * Series
              \\"\\"\\"
              ActedIn: ActedInWhere
            }

            input ProductionActorsNodeAggregationWhereInput {
              AND: [ProductionActorsNodeAggregationWhereInput!]
              NOT: ProductionActorsNodeAggregationWhereInput
              OR: [ProductionActorsNodeAggregationWhereInput!]
              name_AVERAGE_LENGTH_EQUAL: Float
              name_AVERAGE_LENGTH_GT: Float
              name_AVERAGE_LENGTH_GTE: Float
              name_AVERAGE_LENGTH_LT: Float
              name_AVERAGE_LENGTH_LTE: Float
              name_LONGEST_LENGTH_EQUAL: Int
              name_LONGEST_LENGTH_GT: Int
              name_LONGEST_LENGTH_GTE: Int
              name_LONGEST_LENGTH_LT: Int
              name_LONGEST_LENGTH_LTE: Int
              name_SHORTEST_LENGTH_EQUAL: Int
              name_SHORTEST_LENGTH_GT: Int
              name_SHORTEST_LENGTH_GTE: Int
              name_SHORTEST_LENGTH_LT: Int
              name_SHORTEST_LENGTH_LTE: Int
            }

            type ProductionActorsRelationship {
              cursor: String!
              node: Actor!
              properties: ProductionActorsRelationshipProperties!
            }

            union ProductionActorsRelationshipProperties = ActedIn

            input ProductionActorsUpdateConnectionInput {
              edge: ProductionActorsEdgeUpdateInput
              node: ActorUpdateInput
            }

            input ProductionActorsUpdateFieldInput {
              connect: [ProductionActorsConnectFieldInput!]
              create: [ProductionActorsCreateFieldInput!]
              delete: [ProductionActorsDeleteFieldInput!]
              disconnect: [ProductionActorsDisconnectFieldInput!]
              update: ProductionActorsUpdateConnectionInput
              where: ProductionActorsConnectionWhere
            }

            type ProductionAggregateSelection {
              count: Int!
              title: StringAggregateSelection!
            }

            input ProductionConnectInput {
              actors: [ProductionActorsConnectFieldInput!]
            }

            input ProductionConnectWhere {
              node: ProductionWhere!
            }

            input ProductionCreateInput {
              Movie: MovieCreateInput
              Series: SeriesCreateInput
            }

            input ProductionDeleteInput {
              actors: [ProductionActorsDeleteFieldInput!]
            }

            input ProductionDisconnectInput {
              actors: [ProductionActorsDisconnectFieldInput!]
            }

            type ProductionEdge {
              cursor: String!
              node: Production!
            }

            enum ProductionImplementation {
              Movie
              Series
            }

            input ProductionOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more ProductionSort objects to sort Productions by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [ProductionSort!]
            }

            \\"\\"\\"
            Fields to sort Productions by. The order in which sorts are applied is not guaranteed when specifying many fields in one ProductionSort object.
            \\"\\"\\"
            input ProductionSort {
              title: SortDirection
            }

            input ProductionUpdateInput {
              actors: [ProductionActorsUpdateFieldInput!]
              title: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              title_SET: String
            }

            input ProductionWhere {
              AND: [ProductionWhere!]
              NOT: ProductionWhere
              OR: [ProductionWhere!]
              actorsAggregate: ProductionActorsAggregateInput
              \\"\\"\\"
              Return Productions where all of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_ALL: ProductionActorsConnectionWhere
              \\"\\"\\"
              Return Productions where none of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_NONE: ProductionActorsConnectionWhere
              \\"\\"\\"
              Return Productions where one of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_SINGLE: ProductionActorsConnectionWhere
              \\"\\"\\"
              Return Productions where some of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_SOME: ProductionActorsConnectionWhere
              \\"\\"\\"Return Productions where all of the related Actors match this filter\\"\\"\\"
              actors_ALL: ActorWhere
              \\"\\"\\"Return Productions where none of the related Actors match this filter\\"\\"\\"
              actors_NONE: ActorWhere
              \\"\\"\\"Return Productions where one of the related Actors match this filter\\"\\"\\"
              actors_SINGLE: ActorWhere
              \\"\\"\\"Return Productions where some of the related Actors match this filter\\"\\"\\"
              actors_SOME: ActorWhere
              title: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              title_CONTAINS: String
              title_ENDS_WITH: String
              title_EQ: String
              title_IN: [String!]
              title_STARTS_WITH: String
              typename: [ProductionImplementation!]
              typename_IN: [ProductionImplementation!] @deprecated(reason: \\"The typename_IN filter is deprecated, please use the typename filter instead\\")
            }

            type ProductionsConnection {
              edges: [ProductionEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Query {
              actors(limit: Int, offset: Int, options: ActorOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ActorSort!], where: ActorWhere): [Actor!]!
              actorsAggregate(where: ActorWhere): ActorAggregateSelection!
              actorsConnection(after: String, first: Int, sort: [ActorSort!], where: ActorWhere): ActorsConnection!
              episodes(limit: Int, offset: Int, options: EpisodeOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [EpisodeSort!], where: EpisodeWhere): [Episode!]!
              episodesAggregate(where: EpisodeWhere): EpisodeAggregateSelection!
              episodesConnection(after: String, first: Int, sort: [EpisodeSort!], where: EpisodeWhere): EpisodesConnection!
              movies(limit: Int, offset: Int, options: MovieOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [MovieSort!], where: MovieWhere): [Movie!]!
              moviesAggregate(where: MovieWhere): MovieAggregateSelection!
              moviesConnection(after: String, first: Int, sort: [MovieSort!], where: MovieWhere): MoviesConnection!
              productions(limit: Int, offset: Int, options: ProductionOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ProductionSort!], where: ProductionWhere): [Production!]!
              productionsAggregate(where: ProductionWhere): ProductionAggregateSelection!
              productionsConnection(after: String, first: Int, sort: [ProductionSort!], where: ProductionWhere): ProductionsConnection!
              series(limit: Int, offset: Int, options: SeriesOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [SeriesSort!], where: SeriesWhere): [Series!]!
              seriesAggregate(where: SeriesWhere): SeriesAggregateSelection!
              seriesConnection(after: String, first: Int, sort: [SeriesSort!], where: SeriesWhere): SeriesConnection!
            }

            type Series implements Production {
              actors(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: ActorOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ActorSort!], where: ActorWhere): [Actor!]!
              actorsAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: ActorWhere): SeriesActorActorsAggregationSelection
              actorsConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [ProductionActorsConnectionSort!], where: ProductionActorsConnectionWhere): ProductionActorsConnection!
              episodeCount: Int!
              episodes(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: EpisodeOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [EpisodeSort!], where: EpisodeWhere): [Episode!]!
              episodesAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: EpisodeWhere): SeriesEpisodeEpisodesAggregationSelection
              episodesConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [SeriesEpisodesConnectionSort!], where: SeriesEpisodesConnectionWhere): SeriesEpisodesConnection!
              title: String!
            }

            type SeriesActorActorsAggregationSelection {
              count: Int!
              edge: SeriesActorActorsEdgeAggregateSelection
              node: SeriesActorActorsNodeAggregateSelection
            }

            type SeriesActorActorsEdgeAggregateSelection {
              screenTime: IntAggregateSelection!
            }

            type SeriesActorActorsNodeAggregateSelection {
              name: StringAggregateSelection!
            }

            input SeriesActorsAggregateInput {
              AND: [SeriesActorsAggregateInput!]
              NOT: SeriesActorsAggregateInput
              OR: [SeriesActorsAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: ActedInAggregationWhereInput
              node: SeriesActorsNodeAggregationWhereInput
            }

            input SeriesActorsConnectFieldInput {
              connect: [ActorConnectInput!]
              edge: ActedInCreateInput!
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: ActorConnectWhere
            }

            input SeriesActorsCreateFieldInput {
              edge: ActedInCreateInput!
              node: ActorCreateInput!
            }

            input SeriesActorsFieldInput {
              connect: [SeriesActorsConnectFieldInput!]
              create: [SeriesActorsCreateFieldInput!]
            }

            input SeriesActorsNodeAggregationWhereInput {
              AND: [SeriesActorsNodeAggregationWhereInput!]
              NOT: SeriesActorsNodeAggregationWhereInput
              OR: [SeriesActorsNodeAggregationWhereInput!]
              name_AVERAGE_LENGTH_EQUAL: Float
              name_AVERAGE_LENGTH_GT: Float
              name_AVERAGE_LENGTH_GTE: Float
              name_AVERAGE_LENGTH_LT: Float
              name_AVERAGE_LENGTH_LTE: Float
              name_LONGEST_LENGTH_EQUAL: Int
              name_LONGEST_LENGTH_GT: Int
              name_LONGEST_LENGTH_GTE: Int
              name_LONGEST_LENGTH_LT: Int
              name_LONGEST_LENGTH_LTE: Int
              name_SHORTEST_LENGTH_EQUAL: Int
              name_SHORTEST_LENGTH_GT: Int
              name_SHORTEST_LENGTH_GTE: Int
              name_SHORTEST_LENGTH_LT: Int
              name_SHORTEST_LENGTH_LTE: Int
            }

            input SeriesActorsUpdateConnectionInput {
              edge: ActedInUpdateInput
              node: ActorUpdateInput
            }

            input SeriesActorsUpdateFieldInput {
              connect: [SeriesActorsConnectFieldInput!]
              create: [SeriesActorsCreateFieldInput!]
              delete: [ProductionActorsDeleteFieldInput!]
              disconnect: [ProductionActorsDisconnectFieldInput!]
              update: SeriesActorsUpdateConnectionInput
              where: ProductionActorsConnectionWhere
            }

            type SeriesAggregateSelection {
              count: Int!
              episodeCount: IntAggregateSelection!
              title: StringAggregateSelection!
            }

            input SeriesConnectInput {
              actors: [SeriesActorsConnectFieldInput!]
              episodes: [SeriesEpisodesConnectFieldInput!]
            }

            input SeriesConnectWhere {
              node: SeriesWhere!
            }

            type SeriesConnection {
              edges: [SeriesEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input SeriesCreateInput {
              actors: SeriesActorsFieldInput
              episodeCount: Int!
              episodes: SeriesEpisodesFieldInput
              title: String!
            }

            input SeriesDeleteInput {
              actors: [ProductionActorsDeleteFieldInput!]
              episodes: [SeriesEpisodesDeleteFieldInput!]
            }

            input SeriesDisconnectInput {
              actors: [ProductionActorsDisconnectFieldInput!]
              episodes: [SeriesEpisodesDisconnectFieldInput!]
            }

            type SeriesEdge {
              cursor: String!
              node: Series!
            }

            type SeriesEpisodeEpisodesAggregationSelection {
              count: Int!
              node: SeriesEpisodeEpisodesNodeAggregateSelection
            }

            type SeriesEpisodeEpisodesNodeAggregateSelection {
              runtime: IntAggregateSelection!
            }

            input SeriesEpisodesAggregateInput {
              AND: [SeriesEpisodesAggregateInput!]
              NOT: SeriesEpisodesAggregateInput
              OR: [SeriesEpisodesAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              node: SeriesEpisodesNodeAggregationWhereInput
            }

            input SeriesEpisodesConnectFieldInput {
              connect: [EpisodeConnectInput!]
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: EpisodeConnectWhere
            }

            type SeriesEpisodesConnection {
              edges: [SeriesEpisodesRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input SeriesEpisodesConnectionSort {
              node: EpisodeSort
            }

            input SeriesEpisodesConnectionWhere {
              AND: [SeriesEpisodesConnectionWhere!]
              NOT: SeriesEpisodesConnectionWhere
              OR: [SeriesEpisodesConnectionWhere!]
              node: EpisodeWhere
            }

            input SeriesEpisodesCreateFieldInput {
              node: EpisodeCreateInput!
            }

            input SeriesEpisodesDeleteFieldInput {
              delete: EpisodeDeleteInput
              where: SeriesEpisodesConnectionWhere
            }

            input SeriesEpisodesDisconnectFieldInput {
              disconnect: EpisodeDisconnectInput
              where: SeriesEpisodesConnectionWhere
            }

            input SeriesEpisodesFieldInput {
              connect: [SeriesEpisodesConnectFieldInput!]
              create: [SeriesEpisodesCreateFieldInput!]
            }

            input SeriesEpisodesNodeAggregationWhereInput {
              AND: [SeriesEpisodesNodeAggregationWhereInput!]
              NOT: SeriesEpisodesNodeAggregationWhereInput
              OR: [SeriesEpisodesNodeAggregationWhereInput!]
              runtime_AVERAGE_EQUAL: Float
              runtime_AVERAGE_GT: Float
              runtime_AVERAGE_GTE: Float
              runtime_AVERAGE_LT: Float
              runtime_AVERAGE_LTE: Float
              runtime_MAX_EQUAL: Int
              runtime_MAX_GT: Int
              runtime_MAX_GTE: Int
              runtime_MAX_LT: Int
              runtime_MAX_LTE: Int
              runtime_MIN_EQUAL: Int
              runtime_MIN_GT: Int
              runtime_MIN_GTE: Int
              runtime_MIN_LT: Int
              runtime_MIN_LTE: Int
              runtime_SUM_EQUAL: Int
              runtime_SUM_GT: Int
              runtime_SUM_GTE: Int
              runtime_SUM_LT: Int
              runtime_SUM_LTE: Int
            }

            type SeriesEpisodesRelationship {
              cursor: String!
              node: Episode!
            }

            input SeriesEpisodesUpdateConnectionInput {
              node: EpisodeUpdateInput
            }

            input SeriesEpisodesUpdateFieldInput {
              connect: [SeriesEpisodesConnectFieldInput!]
              create: [SeriesEpisodesCreateFieldInput!]
              delete: [SeriesEpisodesDeleteFieldInput!]
              disconnect: [SeriesEpisodesDisconnectFieldInput!]
              update: SeriesEpisodesUpdateConnectionInput
              where: SeriesEpisodesConnectionWhere
            }

            input SeriesOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more SeriesSort objects to sort Series by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [SeriesSort!]
            }

            \\"\\"\\"
            Fields to sort Series by. The order in which sorts are applied is not guaranteed when specifying many fields in one SeriesSort object.
            \\"\\"\\"
            input SeriesSort {
              episodeCount: SortDirection
              title: SortDirection
            }

            input SeriesUpdateInput {
              actors: [SeriesActorsUpdateFieldInput!]
              episodeCount: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              episodeCount_DECREMENT: Int
              episodeCount_INCREMENT: Int
              episodeCount_SET: Int
              episodes: [SeriesEpisodesUpdateFieldInput!]
              title: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              title_SET: String
            }

            input SeriesWhere {
              AND: [SeriesWhere!]
              NOT: SeriesWhere
              OR: [SeriesWhere!]
              actorsAggregate: SeriesActorsAggregateInput
              \\"\\"\\"
              Return Series where all of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_ALL: ProductionActorsConnectionWhere
              \\"\\"\\"
              Return Series where none of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_NONE: ProductionActorsConnectionWhere
              \\"\\"\\"
              Return Series where one of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_SINGLE: ProductionActorsConnectionWhere
              \\"\\"\\"
              Return Series where some of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_SOME: ProductionActorsConnectionWhere
              \\"\\"\\"Return Series where all of the related Actors match this filter\\"\\"\\"
              actors_ALL: ActorWhere
              \\"\\"\\"Return Series where none of the related Actors match this filter\\"\\"\\"
              actors_NONE: ActorWhere
              \\"\\"\\"Return Series where one of the related Actors match this filter\\"\\"\\"
              actors_SINGLE: ActorWhere
              \\"\\"\\"Return Series where some of the related Actors match this filter\\"\\"\\"
              actors_SOME: ActorWhere
              episodeCount: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              episodeCount_EQ: Int
              episodeCount_GT: Int
              episodeCount_GTE: Int
              episodeCount_IN: [Int!]
              episodeCount_LT: Int
              episodeCount_LTE: Int
              episodesAggregate: SeriesEpisodesAggregateInput
              \\"\\"\\"
              Return Series where all of the related SeriesEpisodesConnections match this filter
              \\"\\"\\"
              episodesConnection_ALL: SeriesEpisodesConnectionWhere
              \\"\\"\\"
              Return Series where none of the related SeriesEpisodesConnections match this filter
              \\"\\"\\"
              episodesConnection_NONE: SeriesEpisodesConnectionWhere
              \\"\\"\\"
              Return Series where one of the related SeriesEpisodesConnections match this filter
              \\"\\"\\"
              episodesConnection_SINGLE: SeriesEpisodesConnectionWhere
              \\"\\"\\"
              Return Series where some of the related SeriesEpisodesConnections match this filter
              \\"\\"\\"
              episodesConnection_SOME: SeriesEpisodesConnectionWhere
              \\"\\"\\"Return Series where all of the related Episodes match this filter\\"\\"\\"
              episodes_ALL: EpisodeWhere
              \\"\\"\\"Return Series where none of the related Episodes match this filter\\"\\"\\"
              episodes_NONE: EpisodeWhere
              \\"\\"\\"Return Series where one of the related Episodes match this filter\\"\\"\\"
              episodes_SINGLE: EpisodeWhere
              \\"\\"\\"Return Series where some of the related Episodes match this filter\\"\\"\\"
              episodes_SOME: EpisodeWhere
              title: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              title_CONTAINS: String
              title_ENDS_WITH: String
              title_EQ: String
              title_IN: [String!]
              title_STARTS_WITH: String
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

            type UpdateActorsMutationResponse {
              actors: [Actor!]!
              info: UpdateInfo!
            }

            type UpdateEpisodesMutationResponse {
              episodes: [Episode!]!
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
            }

            type UpdateSeriesMutationResponse {
              info: UpdateInfo!
              series: [Series!]!
            }"
        `);
    });

    test("Interface Relationships - multiple - different relationship implementations", async () => {
        const typeDefs = gql`
            type Episode @node {
                runtime: Int!
                series: Series! @relationship(type: "HAS_EPISODE", direction: IN)
            }

            interface Production {
                title: String!
                actors: [Actor!]! @declareRelationship
            }

            type Movie implements Production @node {
                title: String!
                runtime: Int!
                actors: [Actor!]! @relationship(type: "ACTED_IN", direction: IN, properties: "ActedIn")
            }

            type Series implements Production @node {
                title: String!
                episodeCount: Int!
                episodes: [Episode!]! @relationship(type: "HAS_EPISODE", direction: OUT)
                actors: [Actor!]! @relationship(type: "ACTED_IN", direction: IN, properties: "StarredIn")
            }

            type ActedIn @relationshipProperties {
                screenTime: Int!
            }

            type StarredIn @relationshipProperties {
                seasons: Int!
            }

            type Actor @node {
                name: String!
                actedIn: [Production!]! @relationship(type: "ACTED_IN", direction: OUT, properties: "ActedIn")
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
            The edge properties for the following fields:
            * Movie.actors
            * Actor.actedIn
            \\"\\"\\"
            type ActedIn {
              screenTime: Int!
            }

            input ActedInAggregationWhereInput {
              AND: [ActedInAggregationWhereInput!]
              NOT: ActedInAggregationWhereInput
              OR: [ActedInAggregationWhereInput!]
              screenTime_AVERAGE_EQUAL: Float
              screenTime_AVERAGE_GT: Float
              screenTime_AVERAGE_GTE: Float
              screenTime_AVERAGE_LT: Float
              screenTime_AVERAGE_LTE: Float
              screenTime_MAX_EQUAL: Int
              screenTime_MAX_GT: Int
              screenTime_MAX_GTE: Int
              screenTime_MAX_LT: Int
              screenTime_MAX_LTE: Int
              screenTime_MIN_EQUAL: Int
              screenTime_MIN_GT: Int
              screenTime_MIN_GTE: Int
              screenTime_MIN_LT: Int
              screenTime_MIN_LTE: Int
              screenTime_SUM_EQUAL: Int
              screenTime_SUM_GT: Int
              screenTime_SUM_GTE: Int
              screenTime_SUM_LT: Int
              screenTime_SUM_LTE: Int
            }

            input ActedInCreateInput {
              screenTime: Int!
            }

            input ActedInSort {
              screenTime: SortDirection
            }

            input ActedInUpdateInput {
              screenTime: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              screenTime_DECREMENT: Int
              screenTime_INCREMENT: Int
              screenTime_SET: Int
            }

            input ActedInWhere {
              AND: [ActedInWhere!]
              NOT: ActedInWhere
              OR: [ActedInWhere!]
              screenTime: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              screenTime_EQ: Int
              screenTime_GT: Int
              screenTime_GTE: Int
              screenTime_IN: [Int!]
              screenTime_LT: Int
              screenTime_LTE: Int
            }

            type Actor {
              actedIn(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: ProductionOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ProductionSort!], where: ProductionWhere): [Production!]!
              actedInAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: ProductionWhere): ActorProductionActedInAggregationSelection
              actedInConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [ActorActedInConnectionSort!], where: ActorActedInConnectionWhere): ActorActedInConnection!
              name: String!
            }

            input ActorActedInAggregateInput {
              AND: [ActorActedInAggregateInput!]
              NOT: ActorActedInAggregateInput
              OR: [ActorActedInAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: ActedInAggregationWhereInput
              node: ActorActedInNodeAggregationWhereInput
            }

            input ActorActedInConnectFieldInput {
              connect: ProductionConnectInput
              edge: ActedInCreateInput!
              where: ProductionConnectWhere
            }

            type ActorActedInConnection {
              edges: [ActorActedInRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input ActorActedInConnectionSort {
              edge: ActedInSort
              node: ProductionSort
            }

            input ActorActedInConnectionWhere {
              AND: [ActorActedInConnectionWhere!]
              NOT: ActorActedInConnectionWhere
              OR: [ActorActedInConnectionWhere!]
              edge: ActedInWhere
              node: ProductionWhere
            }

            input ActorActedInCreateFieldInput {
              edge: ActedInCreateInput!
              node: ProductionCreateInput!
            }

            input ActorActedInDeleteFieldInput {
              delete: ProductionDeleteInput
              where: ActorActedInConnectionWhere
            }

            input ActorActedInDisconnectFieldInput {
              disconnect: ProductionDisconnectInput
              where: ActorActedInConnectionWhere
            }

            input ActorActedInFieldInput {
              connect: [ActorActedInConnectFieldInput!]
              create: [ActorActedInCreateFieldInput!]
            }

            input ActorActedInNodeAggregationWhereInput {
              AND: [ActorActedInNodeAggregationWhereInput!]
              NOT: ActorActedInNodeAggregationWhereInput
              OR: [ActorActedInNodeAggregationWhereInput!]
              title_AVERAGE_LENGTH_EQUAL: Float
              title_AVERAGE_LENGTH_GT: Float
              title_AVERAGE_LENGTH_GTE: Float
              title_AVERAGE_LENGTH_LT: Float
              title_AVERAGE_LENGTH_LTE: Float
              title_LONGEST_LENGTH_EQUAL: Int
              title_LONGEST_LENGTH_GT: Int
              title_LONGEST_LENGTH_GTE: Int
              title_LONGEST_LENGTH_LT: Int
              title_LONGEST_LENGTH_LTE: Int
              title_SHORTEST_LENGTH_EQUAL: Int
              title_SHORTEST_LENGTH_GT: Int
              title_SHORTEST_LENGTH_GTE: Int
              title_SHORTEST_LENGTH_LT: Int
              title_SHORTEST_LENGTH_LTE: Int
            }

            type ActorActedInRelationship {
              cursor: String!
              node: Production!
              properties: ActedIn!
            }

            input ActorActedInUpdateConnectionInput {
              edge: ActedInUpdateInput
              node: ProductionUpdateInput
            }

            input ActorActedInUpdateFieldInput {
              connect: [ActorActedInConnectFieldInput!]
              create: [ActorActedInCreateFieldInput!]
              delete: [ActorActedInDeleteFieldInput!]
              disconnect: [ActorActedInDisconnectFieldInput!]
              update: ActorActedInUpdateConnectionInput
              where: ActorActedInConnectionWhere
            }

            type ActorAggregateSelection {
              count: Int!
              name: StringAggregateSelection!
            }

            input ActorConnectInput {
              actedIn: [ActorActedInConnectFieldInput!]
            }

            input ActorConnectWhere {
              node: ActorWhere!
            }

            input ActorCreateInput {
              actedIn: ActorActedInFieldInput
              name: String!
            }

            input ActorDeleteInput {
              actedIn: [ActorActedInDeleteFieldInput!]
            }

            input ActorDisconnectInput {
              actedIn: [ActorActedInDisconnectFieldInput!]
            }

            type ActorEdge {
              cursor: String!
              node: Actor!
            }

            input ActorOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more ActorSort objects to sort Actors by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [ActorSort!]
            }

            type ActorProductionActedInAggregationSelection {
              count: Int!
              edge: ActorProductionActedInEdgeAggregateSelection
              node: ActorProductionActedInNodeAggregateSelection
            }

            type ActorProductionActedInEdgeAggregateSelection {
              screenTime: IntAggregateSelection!
            }

            type ActorProductionActedInNodeAggregateSelection {
              title: StringAggregateSelection!
            }

            \\"\\"\\"
            Fields to sort Actors by. The order in which sorts are applied is not guaranteed when specifying many fields in one ActorSort object.
            \\"\\"\\"
            input ActorSort {
              name: SortDirection
            }

            input ActorUpdateInput {
              actedIn: [ActorActedInUpdateFieldInput!]
              name: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              name_SET: String
            }

            input ActorWhere {
              AND: [ActorWhere!]
              NOT: ActorWhere
              OR: [ActorWhere!]
              actedInAggregate: ActorActedInAggregateInput
              \\"\\"\\"
              Return Actors where all of the related ActorActedInConnections match this filter
              \\"\\"\\"
              actedInConnection_ALL: ActorActedInConnectionWhere
              \\"\\"\\"
              Return Actors where none of the related ActorActedInConnections match this filter
              \\"\\"\\"
              actedInConnection_NONE: ActorActedInConnectionWhere
              \\"\\"\\"
              Return Actors where one of the related ActorActedInConnections match this filter
              \\"\\"\\"
              actedInConnection_SINGLE: ActorActedInConnectionWhere
              \\"\\"\\"
              Return Actors where some of the related ActorActedInConnections match this filter
              \\"\\"\\"
              actedInConnection_SOME: ActorActedInConnectionWhere
              \\"\\"\\"Return Actors where all of the related Productions match this filter\\"\\"\\"
              actedIn_ALL: ProductionWhere
              \\"\\"\\"Return Actors where none of the related Productions match this filter\\"\\"\\"
              actedIn_NONE: ProductionWhere
              \\"\\"\\"Return Actors where one of the related Productions match this filter\\"\\"\\"
              actedIn_SINGLE: ProductionWhere
              \\"\\"\\"Return Actors where some of the related Productions match this filter\\"\\"\\"
              actedIn_SOME: ProductionWhere
              name: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              name_CONTAINS: String
              name_ENDS_WITH: String
              name_EQ: String
              name_IN: [String!]
              name_STARTS_WITH: String
            }

            type ActorsConnection {
              edges: [ActorEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type CreateActorsMutationResponse {
              actors: [Actor!]!
              info: CreateInfo!
            }

            type CreateEpisodesMutationResponse {
              episodes: [Episode!]!
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

            type CreateSeriesMutationResponse {
              info: CreateInfo!
              series: [Series!]!
            }

            \\"\\"\\"
            Information about the number of nodes and relationships deleted during a delete mutation
            \\"\\"\\"
            type DeleteInfo {
              nodesDeleted: Int!
              relationshipsDeleted: Int!
            }

            type Episode {
              runtime: Int!
              series(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: SeriesOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [SeriesSort!], where: SeriesWhere): Series!
              seriesAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: SeriesWhere): EpisodeSeriesSeriesAggregationSelection
              seriesConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [EpisodeSeriesConnectionSort!], where: EpisodeSeriesConnectionWhere): EpisodeSeriesConnection!
            }

            type EpisodeAggregateSelection {
              count: Int!
              runtime: IntAggregateSelection!
            }

            input EpisodeConnectInput {
              series: EpisodeSeriesConnectFieldInput
            }

            input EpisodeConnectWhere {
              node: EpisodeWhere!
            }

            input EpisodeCreateInput {
              runtime: Int!
              series: EpisodeSeriesFieldInput
            }

            input EpisodeDeleteInput {
              series: EpisodeSeriesDeleteFieldInput
            }

            input EpisodeDisconnectInput {
              series: EpisodeSeriesDisconnectFieldInput
            }

            type EpisodeEdge {
              cursor: String!
              node: Episode!
            }

            input EpisodeOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more EpisodeSort objects to sort Episodes by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [EpisodeSort!]
            }

            input EpisodeSeriesAggregateInput {
              AND: [EpisodeSeriesAggregateInput!]
              NOT: EpisodeSeriesAggregateInput
              OR: [EpisodeSeriesAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              node: EpisodeSeriesNodeAggregationWhereInput
            }

            input EpisodeSeriesConnectFieldInput {
              connect: SeriesConnectInput
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: SeriesConnectWhere
            }

            type EpisodeSeriesConnection {
              edges: [EpisodeSeriesRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input EpisodeSeriesConnectionSort {
              node: SeriesSort
            }

            input EpisodeSeriesConnectionWhere {
              AND: [EpisodeSeriesConnectionWhere!]
              NOT: EpisodeSeriesConnectionWhere
              OR: [EpisodeSeriesConnectionWhere!]
              node: SeriesWhere
            }

            input EpisodeSeriesCreateFieldInput {
              node: SeriesCreateInput!
            }

            input EpisodeSeriesDeleteFieldInput {
              delete: SeriesDeleteInput
              where: EpisodeSeriesConnectionWhere
            }

            input EpisodeSeriesDisconnectFieldInput {
              disconnect: SeriesDisconnectInput
              where: EpisodeSeriesConnectionWhere
            }

            input EpisodeSeriesFieldInput {
              connect: EpisodeSeriesConnectFieldInput
              create: EpisodeSeriesCreateFieldInput
            }

            input EpisodeSeriesNodeAggregationWhereInput {
              AND: [EpisodeSeriesNodeAggregationWhereInput!]
              NOT: EpisodeSeriesNodeAggregationWhereInput
              OR: [EpisodeSeriesNodeAggregationWhereInput!]
              episodeCount_AVERAGE_EQUAL: Float
              episodeCount_AVERAGE_GT: Float
              episodeCount_AVERAGE_GTE: Float
              episodeCount_AVERAGE_LT: Float
              episodeCount_AVERAGE_LTE: Float
              episodeCount_MAX_EQUAL: Int
              episodeCount_MAX_GT: Int
              episodeCount_MAX_GTE: Int
              episodeCount_MAX_LT: Int
              episodeCount_MAX_LTE: Int
              episodeCount_MIN_EQUAL: Int
              episodeCount_MIN_GT: Int
              episodeCount_MIN_GTE: Int
              episodeCount_MIN_LT: Int
              episodeCount_MIN_LTE: Int
              episodeCount_SUM_EQUAL: Int
              episodeCount_SUM_GT: Int
              episodeCount_SUM_GTE: Int
              episodeCount_SUM_LT: Int
              episodeCount_SUM_LTE: Int
              title_AVERAGE_LENGTH_EQUAL: Float
              title_AVERAGE_LENGTH_GT: Float
              title_AVERAGE_LENGTH_GTE: Float
              title_AVERAGE_LENGTH_LT: Float
              title_AVERAGE_LENGTH_LTE: Float
              title_LONGEST_LENGTH_EQUAL: Int
              title_LONGEST_LENGTH_GT: Int
              title_LONGEST_LENGTH_GTE: Int
              title_LONGEST_LENGTH_LT: Int
              title_LONGEST_LENGTH_LTE: Int
              title_SHORTEST_LENGTH_EQUAL: Int
              title_SHORTEST_LENGTH_GT: Int
              title_SHORTEST_LENGTH_GTE: Int
              title_SHORTEST_LENGTH_LT: Int
              title_SHORTEST_LENGTH_LTE: Int
            }

            type EpisodeSeriesRelationship {
              cursor: String!
              node: Series!
            }

            type EpisodeSeriesSeriesAggregationSelection {
              count: Int!
              node: EpisodeSeriesSeriesNodeAggregateSelection
            }

            type EpisodeSeriesSeriesNodeAggregateSelection {
              episodeCount: IntAggregateSelection!
              title: StringAggregateSelection!
            }

            input EpisodeSeriesUpdateConnectionInput {
              node: SeriesUpdateInput
            }

            input EpisodeSeriesUpdateFieldInput {
              connect: EpisodeSeriesConnectFieldInput
              create: EpisodeSeriesCreateFieldInput
              delete: EpisodeSeriesDeleteFieldInput
              disconnect: EpisodeSeriesDisconnectFieldInput
              update: EpisodeSeriesUpdateConnectionInput
              where: EpisodeSeriesConnectionWhere
            }

            \\"\\"\\"
            Fields to sort Episodes by. The order in which sorts are applied is not guaranteed when specifying many fields in one EpisodeSort object.
            \\"\\"\\"
            input EpisodeSort {
              runtime: SortDirection
            }

            input EpisodeUpdateInput {
              runtime: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              runtime_DECREMENT: Int
              runtime_INCREMENT: Int
              runtime_SET: Int
              series: EpisodeSeriesUpdateFieldInput
            }

            input EpisodeWhere {
              AND: [EpisodeWhere!]
              NOT: EpisodeWhere
              OR: [EpisodeWhere!]
              runtime: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              runtime_EQ: Int
              runtime_GT: Int
              runtime_GTE: Int
              runtime_IN: [Int!]
              runtime_LT: Int
              runtime_LTE: Int
              series: SeriesWhere
              seriesAggregate: EpisodeSeriesAggregateInput
              seriesConnection: EpisodeSeriesConnectionWhere
            }

            type EpisodesConnection {
              edges: [EpisodeEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type IntAggregateSelection {
              average: Float
              max: Int
              min: Int
              sum: Int
            }

            type Movie implements Production {
              actors(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: ActorOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ActorSort!], where: ActorWhere): [Actor!]!
              actorsAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: ActorWhere): MovieActorActorsAggregationSelection
              actorsConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [ProductionActorsConnectionSort!], where: ProductionActorsConnectionWhere): ProductionActorsConnection!
              runtime: Int!
              title: String!
            }

            type MovieActorActorsAggregationSelection {
              count: Int!
              edge: MovieActorActorsEdgeAggregateSelection
              node: MovieActorActorsNodeAggregateSelection
            }

            type MovieActorActorsEdgeAggregateSelection {
              screenTime: IntAggregateSelection!
            }

            type MovieActorActorsNodeAggregateSelection {
              name: StringAggregateSelection!
            }

            input MovieActorsAggregateInput {
              AND: [MovieActorsAggregateInput!]
              NOT: MovieActorsAggregateInput
              OR: [MovieActorsAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: ActedInAggregationWhereInput
              node: MovieActorsNodeAggregationWhereInput
            }

            input MovieActorsConnectFieldInput {
              connect: [ActorConnectInput!]
              edge: ActedInCreateInput!
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: ActorConnectWhere
            }

            input MovieActorsCreateFieldInput {
              edge: ActedInCreateInput!
              node: ActorCreateInput!
            }

            input MovieActorsFieldInput {
              connect: [MovieActorsConnectFieldInput!]
              create: [MovieActorsCreateFieldInput!]
            }

            input MovieActorsNodeAggregationWhereInput {
              AND: [MovieActorsNodeAggregationWhereInput!]
              NOT: MovieActorsNodeAggregationWhereInput
              OR: [MovieActorsNodeAggregationWhereInput!]
              name_AVERAGE_LENGTH_EQUAL: Float
              name_AVERAGE_LENGTH_GT: Float
              name_AVERAGE_LENGTH_GTE: Float
              name_AVERAGE_LENGTH_LT: Float
              name_AVERAGE_LENGTH_LTE: Float
              name_LONGEST_LENGTH_EQUAL: Int
              name_LONGEST_LENGTH_GT: Int
              name_LONGEST_LENGTH_GTE: Int
              name_LONGEST_LENGTH_LT: Int
              name_LONGEST_LENGTH_LTE: Int
              name_SHORTEST_LENGTH_EQUAL: Int
              name_SHORTEST_LENGTH_GT: Int
              name_SHORTEST_LENGTH_GTE: Int
              name_SHORTEST_LENGTH_LT: Int
              name_SHORTEST_LENGTH_LTE: Int
            }

            input MovieActorsUpdateConnectionInput {
              edge: ActedInUpdateInput
              node: ActorUpdateInput
            }

            input MovieActorsUpdateFieldInput {
              connect: [MovieActorsConnectFieldInput!]
              create: [MovieActorsCreateFieldInput!]
              delete: [ProductionActorsDeleteFieldInput!]
              disconnect: [ProductionActorsDisconnectFieldInput!]
              update: MovieActorsUpdateConnectionInput
              where: ProductionActorsConnectionWhere
            }

            type MovieAggregateSelection {
              count: Int!
              runtime: IntAggregateSelection!
              title: StringAggregateSelection!
            }

            input MovieCreateInput {
              actors: MovieActorsFieldInput
              runtime: Int!
              title: String!
            }

            input MovieDeleteInput {
              actors: [ProductionActorsDeleteFieldInput!]
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
              runtime: SortDirection
              title: SortDirection
            }

            input MovieUpdateInput {
              actors: [MovieActorsUpdateFieldInput!]
              runtime: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              runtime_DECREMENT: Int
              runtime_INCREMENT: Int
              runtime_SET: Int
              title: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              title_SET: String
            }

            input MovieWhere {
              AND: [MovieWhere!]
              NOT: MovieWhere
              OR: [MovieWhere!]
              actorsAggregate: MovieActorsAggregateInput
              \\"\\"\\"
              Return Movies where all of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_ALL: ProductionActorsConnectionWhere
              \\"\\"\\"
              Return Movies where none of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_NONE: ProductionActorsConnectionWhere
              \\"\\"\\"
              Return Movies where one of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_SINGLE: ProductionActorsConnectionWhere
              \\"\\"\\"
              Return Movies where some of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_SOME: ProductionActorsConnectionWhere
              \\"\\"\\"Return Movies where all of the related Actors match this filter\\"\\"\\"
              actors_ALL: ActorWhere
              \\"\\"\\"Return Movies where none of the related Actors match this filter\\"\\"\\"
              actors_NONE: ActorWhere
              \\"\\"\\"Return Movies where one of the related Actors match this filter\\"\\"\\"
              actors_SINGLE: ActorWhere
              \\"\\"\\"Return Movies where some of the related Actors match this filter\\"\\"\\"
              actors_SOME: ActorWhere
              runtime: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              runtime_EQ: Int
              runtime_GT: Int
              runtime_GTE: Int
              runtime_IN: [Int!]
              runtime_LT: Int
              runtime_LTE: Int
              title: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              title_CONTAINS: String
              title_ENDS_WITH: String
              title_EQ: String
              title_IN: [String!]
              title_STARTS_WITH: String
            }

            type MoviesConnection {
              edges: [MovieEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Mutation {
              createActors(input: [ActorCreateInput!]!): CreateActorsMutationResponse!
              createEpisodes(input: [EpisodeCreateInput!]!): CreateEpisodesMutationResponse!
              createMovies(input: [MovieCreateInput!]!): CreateMoviesMutationResponse!
              createSeries(input: [SeriesCreateInput!]!): CreateSeriesMutationResponse!
              deleteActors(delete: ActorDeleteInput, where: ActorWhere): DeleteInfo!
              deleteEpisodes(delete: EpisodeDeleteInput, where: EpisodeWhere): DeleteInfo!
              deleteMovies(delete: MovieDeleteInput, where: MovieWhere): DeleteInfo!
              deleteSeries(delete: SeriesDeleteInput, where: SeriesWhere): DeleteInfo!
              updateActors(update: ActorUpdateInput, where: ActorWhere): UpdateActorsMutationResponse!
              updateEpisodes(update: EpisodeUpdateInput, where: EpisodeWhere): UpdateEpisodesMutationResponse!
              updateMovies(update: MovieUpdateInput, where: MovieWhere): UpdateMoviesMutationResponse!
              updateSeries(update: SeriesUpdateInput, where: SeriesWhere): UpdateSeriesMutationResponse!
            }

            \\"\\"\\"Pagination information (Relay)\\"\\"\\"
            type PageInfo {
              endCursor: String
              hasNextPage: Boolean!
              hasPreviousPage: Boolean!
              startCursor: String
            }

            interface Production {
              actors(limit: Int, offset: Int, options: ActorOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ActorSort!], where: ActorWhere): [Actor!]!
              actorsConnection(after: String, first: Int, sort: [ProductionActorsConnectionSort!], where: ProductionActorsConnectionWhere): ProductionActorsConnection!
              title: String!
            }

            input ProductionActorsAggregateInput {
              AND: [ProductionActorsAggregateInput!]
              NOT: ProductionActorsAggregateInput
              OR: [ProductionActorsAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: ProductionActorsEdgeAggregationWhereInput
              node: ProductionActorsNodeAggregationWhereInput
            }

            input ProductionActorsConnectFieldInput {
              connect: [ActorConnectInput!]
              edge: ProductionActorsEdgeCreateInput!
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: ActorConnectWhere
            }

            type ProductionActorsConnection {
              edges: [ProductionActorsRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input ProductionActorsConnectionSort {
              edge: ProductionActorsEdgeSort
              node: ActorSort
            }

            input ProductionActorsConnectionWhere {
              AND: [ProductionActorsConnectionWhere!]
              NOT: ProductionActorsConnectionWhere
              OR: [ProductionActorsConnectionWhere!]
              edge: ProductionActorsEdgeWhere
              node: ActorWhere
            }

            input ProductionActorsCreateFieldInput {
              edge: ProductionActorsEdgeCreateInput!
              node: ActorCreateInput!
            }

            input ProductionActorsDeleteFieldInput {
              delete: ActorDeleteInput
              where: ProductionActorsConnectionWhere
            }

            input ProductionActorsDisconnectFieldInput {
              disconnect: ActorDisconnectInput
              where: ProductionActorsConnectionWhere
            }

            input ProductionActorsEdgeAggregationWhereInput {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Movie
              \\"\\"\\"
              ActedIn: ActedInAggregationWhereInput
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Series
              \\"\\"\\"
              StarredIn: StarredInAggregationWhereInput
            }

            input ProductionActorsEdgeCreateInput {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Movie
              \\"\\"\\"
              ActedIn: ActedInCreateInput!
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Series
              \\"\\"\\"
              StarredIn: StarredInCreateInput!
            }

            input ProductionActorsEdgeSort {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Movie
              \\"\\"\\"
              ActedIn: ActedInSort
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Series
              \\"\\"\\"
              StarredIn: StarredInSort
            }

            input ProductionActorsEdgeUpdateInput {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Movie
              \\"\\"\\"
              ActedIn: ActedInUpdateInput
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Series
              \\"\\"\\"
              StarredIn: StarredInUpdateInput
            }

            input ProductionActorsEdgeWhere {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Movie
              \\"\\"\\"
              ActedIn: ActedInWhere
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Series
              \\"\\"\\"
              StarredIn: StarredInWhere
            }

            input ProductionActorsNodeAggregationWhereInput {
              AND: [ProductionActorsNodeAggregationWhereInput!]
              NOT: ProductionActorsNodeAggregationWhereInput
              OR: [ProductionActorsNodeAggregationWhereInput!]
              name_AVERAGE_LENGTH_EQUAL: Float
              name_AVERAGE_LENGTH_GT: Float
              name_AVERAGE_LENGTH_GTE: Float
              name_AVERAGE_LENGTH_LT: Float
              name_AVERAGE_LENGTH_LTE: Float
              name_LONGEST_LENGTH_EQUAL: Int
              name_LONGEST_LENGTH_GT: Int
              name_LONGEST_LENGTH_GTE: Int
              name_LONGEST_LENGTH_LT: Int
              name_LONGEST_LENGTH_LTE: Int
              name_SHORTEST_LENGTH_EQUAL: Int
              name_SHORTEST_LENGTH_GT: Int
              name_SHORTEST_LENGTH_GTE: Int
              name_SHORTEST_LENGTH_LT: Int
              name_SHORTEST_LENGTH_LTE: Int
            }

            type ProductionActorsRelationship {
              cursor: String!
              node: Actor!
              properties: ProductionActorsRelationshipProperties!
            }

            union ProductionActorsRelationshipProperties = ActedIn | StarredIn

            input ProductionActorsUpdateConnectionInput {
              edge: ProductionActorsEdgeUpdateInput
              node: ActorUpdateInput
            }

            input ProductionActorsUpdateFieldInput {
              connect: [ProductionActorsConnectFieldInput!]
              create: [ProductionActorsCreateFieldInput!]
              delete: [ProductionActorsDeleteFieldInput!]
              disconnect: [ProductionActorsDisconnectFieldInput!]
              update: ProductionActorsUpdateConnectionInput
              where: ProductionActorsConnectionWhere
            }

            type ProductionAggregateSelection {
              count: Int!
              title: StringAggregateSelection!
            }

            input ProductionConnectInput {
              actors: [ProductionActorsConnectFieldInput!]
            }

            input ProductionConnectWhere {
              node: ProductionWhere!
            }

            input ProductionCreateInput {
              Movie: MovieCreateInput
              Series: SeriesCreateInput
            }

            input ProductionDeleteInput {
              actors: [ProductionActorsDeleteFieldInput!]
            }

            input ProductionDisconnectInput {
              actors: [ProductionActorsDisconnectFieldInput!]
            }

            type ProductionEdge {
              cursor: String!
              node: Production!
            }

            enum ProductionImplementation {
              Movie
              Series
            }

            input ProductionOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more ProductionSort objects to sort Productions by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [ProductionSort!]
            }

            \\"\\"\\"
            Fields to sort Productions by. The order in which sorts are applied is not guaranteed when specifying many fields in one ProductionSort object.
            \\"\\"\\"
            input ProductionSort {
              title: SortDirection
            }

            input ProductionUpdateInput {
              actors: [ProductionActorsUpdateFieldInput!]
              title: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              title_SET: String
            }

            input ProductionWhere {
              AND: [ProductionWhere!]
              NOT: ProductionWhere
              OR: [ProductionWhere!]
              actorsAggregate: ProductionActorsAggregateInput
              \\"\\"\\"
              Return Productions where all of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_ALL: ProductionActorsConnectionWhere
              \\"\\"\\"
              Return Productions where none of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_NONE: ProductionActorsConnectionWhere
              \\"\\"\\"
              Return Productions where one of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_SINGLE: ProductionActorsConnectionWhere
              \\"\\"\\"
              Return Productions where some of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_SOME: ProductionActorsConnectionWhere
              \\"\\"\\"Return Productions where all of the related Actors match this filter\\"\\"\\"
              actors_ALL: ActorWhere
              \\"\\"\\"Return Productions where none of the related Actors match this filter\\"\\"\\"
              actors_NONE: ActorWhere
              \\"\\"\\"Return Productions where one of the related Actors match this filter\\"\\"\\"
              actors_SINGLE: ActorWhere
              \\"\\"\\"Return Productions where some of the related Actors match this filter\\"\\"\\"
              actors_SOME: ActorWhere
              title: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              title_CONTAINS: String
              title_ENDS_WITH: String
              title_EQ: String
              title_IN: [String!]
              title_STARTS_WITH: String
              typename: [ProductionImplementation!]
              typename_IN: [ProductionImplementation!] @deprecated(reason: \\"The typename_IN filter is deprecated, please use the typename filter instead\\")
            }

            type ProductionsConnection {
              edges: [ProductionEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Query {
              actors(limit: Int, offset: Int, options: ActorOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ActorSort!], where: ActorWhere): [Actor!]!
              actorsAggregate(where: ActorWhere): ActorAggregateSelection!
              actorsConnection(after: String, first: Int, sort: [ActorSort!], where: ActorWhere): ActorsConnection!
              episodes(limit: Int, offset: Int, options: EpisodeOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [EpisodeSort!], where: EpisodeWhere): [Episode!]!
              episodesAggregate(where: EpisodeWhere): EpisodeAggregateSelection!
              episodesConnection(after: String, first: Int, sort: [EpisodeSort!], where: EpisodeWhere): EpisodesConnection!
              movies(limit: Int, offset: Int, options: MovieOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [MovieSort!], where: MovieWhere): [Movie!]!
              moviesAggregate(where: MovieWhere): MovieAggregateSelection!
              moviesConnection(after: String, first: Int, sort: [MovieSort!], where: MovieWhere): MoviesConnection!
              productions(limit: Int, offset: Int, options: ProductionOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ProductionSort!], where: ProductionWhere): [Production!]!
              productionsAggregate(where: ProductionWhere): ProductionAggregateSelection!
              productionsConnection(after: String, first: Int, sort: [ProductionSort!], where: ProductionWhere): ProductionsConnection!
              series(limit: Int, offset: Int, options: SeriesOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [SeriesSort!], where: SeriesWhere): [Series!]!
              seriesAggregate(where: SeriesWhere): SeriesAggregateSelection!
              seriesConnection(after: String, first: Int, sort: [SeriesSort!], where: SeriesWhere): SeriesConnection!
            }

            type Series implements Production {
              actors(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: ActorOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ActorSort!], where: ActorWhere): [Actor!]!
              actorsAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: ActorWhere): SeriesActorActorsAggregationSelection
              actorsConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [ProductionActorsConnectionSort!], where: ProductionActorsConnectionWhere): ProductionActorsConnection!
              episodeCount: Int!
              episodes(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: EpisodeOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [EpisodeSort!], where: EpisodeWhere): [Episode!]!
              episodesAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: EpisodeWhere): SeriesEpisodeEpisodesAggregationSelection
              episodesConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [SeriesEpisodesConnectionSort!], where: SeriesEpisodesConnectionWhere): SeriesEpisodesConnection!
              title: String!
            }

            type SeriesActorActorsAggregationSelection {
              count: Int!
              edge: SeriesActorActorsEdgeAggregateSelection
              node: SeriesActorActorsNodeAggregateSelection
            }

            type SeriesActorActorsEdgeAggregateSelection {
              seasons: IntAggregateSelection!
            }

            type SeriesActorActorsNodeAggregateSelection {
              name: StringAggregateSelection!
            }

            input SeriesActorsAggregateInput {
              AND: [SeriesActorsAggregateInput!]
              NOT: SeriesActorsAggregateInput
              OR: [SeriesActorsAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: StarredInAggregationWhereInput
              node: SeriesActorsNodeAggregationWhereInput
            }

            input SeriesActorsConnectFieldInput {
              connect: [ActorConnectInput!]
              edge: StarredInCreateInput!
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: ActorConnectWhere
            }

            input SeriesActorsCreateFieldInput {
              edge: StarredInCreateInput!
              node: ActorCreateInput!
            }

            input SeriesActorsFieldInput {
              connect: [SeriesActorsConnectFieldInput!]
              create: [SeriesActorsCreateFieldInput!]
            }

            input SeriesActorsNodeAggregationWhereInput {
              AND: [SeriesActorsNodeAggregationWhereInput!]
              NOT: SeriesActorsNodeAggregationWhereInput
              OR: [SeriesActorsNodeAggregationWhereInput!]
              name_AVERAGE_LENGTH_EQUAL: Float
              name_AVERAGE_LENGTH_GT: Float
              name_AVERAGE_LENGTH_GTE: Float
              name_AVERAGE_LENGTH_LT: Float
              name_AVERAGE_LENGTH_LTE: Float
              name_LONGEST_LENGTH_EQUAL: Int
              name_LONGEST_LENGTH_GT: Int
              name_LONGEST_LENGTH_GTE: Int
              name_LONGEST_LENGTH_LT: Int
              name_LONGEST_LENGTH_LTE: Int
              name_SHORTEST_LENGTH_EQUAL: Int
              name_SHORTEST_LENGTH_GT: Int
              name_SHORTEST_LENGTH_GTE: Int
              name_SHORTEST_LENGTH_LT: Int
              name_SHORTEST_LENGTH_LTE: Int
            }

            input SeriesActorsUpdateConnectionInput {
              edge: StarredInUpdateInput
              node: ActorUpdateInput
            }

            input SeriesActorsUpdateFieldInput {
              connect: [SeriesActorsConnectFieldInput!]
              create: [SeriesActorsCreateFieldInput!]
              delete: [ProductionActorsDeleteFieldInput!]
              disconnect: [ProductionActorsDisconnectFieldInput!]
              update: SeriesActorsUpdateConnectionInput
              where: ProductionActorsConnectionWhere
            }

            type SeriesAggregateSelection {
              count: Int!
              episodeCount: IntAggregateSelection!
              title: StringAggregateSelection!
            }

            input SeriesConnectInput {
              actors: [SeriesActorsConnectFieldInput!]
              episodes: [SeriesEpisodesConnectFieldInput!]
            }

            input SeriesConnectWhere {
              node: SeriesWhere!
            }

            type SeriesConnection {
              edges: [SeriesEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input SeriesCreateInput {
              actors: SeriesActorsFieldInput
              episodeCount: Int!
              episodes: SeriesEpisodesFieldInput
              title: String!
            }

            input SeriesDeleteInput {
              actors: [ProductionActorsDeleteFieldInput!]
              episodes: [SeriesEpisodesDeleteFieldInput!]
            }

            input SeriesDisconnectInput {
              actors: [ProductionActorsDisconnectFieldInput!]
              episodes: [SeriesEpisodesDisconnectFieldInput!]
            }

            type SeriesEdge {
              cursor: String!
              node: Series!
            }

            type SeriesEpisodeEpisodesAggregationSelection {
              count: Int!
              node: SeriesEpisodeEpisodesNodeAggregateSelection
            }

            type SeriesEpisodeEpisodesNodeAggregateSelection {
              runtime: IntAggregateSelection!
            }

            input SeriesEpisodesAggregateInput {
              AND: [SeriesEpisodesAggregateInput!]
              NOT: SeriesEpisodesAggregateInput
              OR: [SeriesEpisodesAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              node: SeriesEpisodesNodeAggregationWhereInput
            }

            input SeriesEpisodesConnectFieldInput {
              connect: [EpisodeConnectInput!]
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: EpisodeConnectWhere
            }

            type SeriesEpisodesConnection {
              edges: [SeriesEpisodesRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input SeriesEpisodesConnectionSort {
              node: EpisodeSort
            }

            input SeriesEpisodesConnectionWhere {
              AND: [SeriesEpisodesConnectionWhere!]
              NOT: SeriesEpisodesConnectionWhere
              OR: [SeriesEpisodesConnectionWhere!]
              node: EpisodeWhere
            }

            input SeriesEpisodesCreateFieldInput {
              node: EpisodeCreateInput!
            }

            input SeriesEpisodesDeleteFieldInput {
              delete: EpisodeDeleteInput
              where: SeriesEpisodesConnectionWhere
            }

            input SeriesEpisodesDisconnectFieldInput {
              disconnect: EpisodeDisconnectInput
              where: SeriesEpisodesConnectionWhere
            }

            input SeriesEpisodesFieldInput {
              connect: [SeriesEpisodesConnectFieldInput!]
              create: [SeriesEpisodesCreateFieldInput!]
            }

            input SeriesEpisodesNodeAggregationWhereInput {
              AND: [SeriesEpisodesNodeAggregationWhereInput!]
              NOT: SeriesEpisodesNodeAggregationWhereInput
              OR: [SeriesEpisodesNodeAggregationWhereInput!]
              runtime_AVERAGE_EQUAL: Float
              runtime_AVERAGE_GT: Float
              runtime_AVERAGE_GTE: Float
              runtime_AVERAGE_LT: Float
              runtime_AVERAGE_LTE: Float
              runtime_MAX_EQUAL: Int
              runtime_MAX_GT: Int
              runtime_MAX_GTE: Int
              runtime_MAX_LT: Int
              runtime_MAX_LTE: Int
              runtime_MIN_EQUAL: Int
              runtime_MIN_GT: Int
              runtime_MIN_GTE: Int
              runtime_MIN_LT: Int
              runtime_MIN_LTE: Int
              runtime_SUM_EQUAL: Int
              runtime_SUM_GT: Int
              runtime_SUM_GTE: Int
              runtime_SUM_LT: Int
              runtime_SUM_LTE: Int
            }

            type SeriesEpisodesRelationship {
              cursor: String!
              node: Episode!
            }

            input SeriesEpisodesUpdateConnectionInput {
              node: EpisodeUpdateInput
            }

            input SeriesEpisodesUpdateFieldInput {
              connect: [SeriesEpisodesConnectFieldInput!]
              create: [SeriesEpisodesCreateFieldInput!]
              delete: [SeriesEpisodesDeleteFieldInput!]
              disconnect: [SeriesEpisodesDisconnectFieldInput!]
              update: SeriesEpisodesUpdateConnectionInput
              where: SeriesEpisodesConnectionWhere
            }

            input SeriesOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more SeriesSort objects to sort Series by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [SeriesSort!]
            }

            \\"\\"\\"
            Fields to sort Series by. The order in which sorts are applied is not guaranteed when specifying many fields in one SeriesSort object.
            \\"\\"\\"
            input SeriesSort {
              episodeCount: SortDirection
              title: SortDirection
            }

            input SeriesUpdateInput {
              actors: [SeriesActorsUpdateFieldInput!]
              episodeCount: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              episodeCount_DECREMENT: Int
              episodeCount_INCREMENT: Int
              episodeCount_SET: Int
              episodes: [SeriesEpisodesUpdateFieldInput!]
              title: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              title_SET: String
            }

            input SeriesWhere {
              AND: [SeriesWhere!]
              NOT: SeriesWhere
              OR: [SeriesWhere!]
              actorsAggregate: SeriesActorsAggregateInput
              \\"\\"\\"
              Return Series where all of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_ALL: ProductionActorsConnectionWhere
              \\"\\"\\"
              Return Series where none of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_NONE: ProductionActorsConnectionWhere
              \\"\\"\\"
              Return Series where one of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_SINGLE: ProductionActorsConnectionWhere
              \\"\\"\\"
              Return Series where some of the related ProductionActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_SOME: ProductionActorsConnectionWhere
              \\"\\"\\"Return Series where all of the related Actors match this filter\\"\\"\\"
              actors_ALL: ActorWhere
              \\"\\"\\"Return Series where none of the related Actors match this filter\\"\\"\\"
              actors_NONE: ActorWhere
              \\"\\"\\"Return Series where one of the related Actors match this filter\\"\\"\\"
              actors_SINGLE: ActorWhere
              \\"\\"\\"Return Series where some of the related Actors match this filter\\"\\"\\"
              actors_SOME: ActorWhere
              episodeCount: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              episodeCount_EQ: Int
              episodeCount_GT: Int
              episodeCount_GTE: Int
              episodeCount_IN: [Int!]
              episodeCount_LT: Int
              episodeCount_LTE: Int
              episodesAggregate: SeriesEpisodesAggregateInput
              \\"\\"\\"
              Return Series where all of the related SeriesEpisodesConnections match this filter
              \\"\\"\\"
              episodesConnection_ALL: SeriesEpisodesConnectionWhere
              \\"\\"\\"
              Return Series where none of the related SeriesEpisodesConnections match this filter
              \\"\\"\\"
              episodesConnection_NONE: SeriesEpisodesConnectionWhere
              \\"\\"\\"
              Return Series where one of the related SeriesEpisodesConnections match this filter
              \\"\\"\\"
              episodesConnection_SINGLE: SeriesEpisodesConnectionWhere
              \\"\\"\\"
              Return Series where some of the related SeriesEpisodesConnections match this filter
              \\"\\"\\"
              episodesConnection_SOME: SeriesEpisodesConnectionWhere
              \\"\\"\\"Return Series where all of the related Episodes match this filter\\"\\"\\"
              episodes_ALL: EpisodeWhere
              \\"\\"\\"Return Series where none of the related Episodes match this filter\\"\\"\\"
              episodes_NONE: EpisodeWhere
              \\"\\"\\"Return Series where one of the related Episodes match this filter\\"\\"\\"
              episodes_SINGLE: EpisodeWhere
              \\"\\"\\"Return Series where some of the related Episodes match this filter\\"\\"\\"
              episodes_SOME: EpisodeWhere
              title: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              title_CONTAINS: String
              title_ENDS_WITH: String
              title_EQ: String
              title_IN: [String!]
              title_STARTS_WITH: String
            }

            \\"\\"\\"An enum for sorting in either ascending or descending order.\\"\\"\\"
            enum SortDirection {
              \\"\\"\\"Sort by field values in ascending order.\\"\\"\\"
              ASC
              \\"\\"\\"Sort by field values in descending order.\\"\\"\\"
              DESC
            }

            \\"\\"\\"
            The edge properties for the following fields:
            * Series.actors
            \\"\\"\\"
            type StarredIn {
              seasons: Int!
            }

            input StarredInAggregationWhereInput {
              AND: [StarredInAggregationWhereInput!]
              NOT: StarredInAggregationWhereInput
              OR: [StarredInAggregationWhereInput!]
              seasons_AVERAGE_EQUAL: Float
              seasons_AVERAGE_GT: Float
              seasons_AVERAGE_GTE: Float
              seasons_AVERAGE_LT: Float
              seasons_AVERAGE_LTE: Float
              seasons_MAX_EQUAL: Int
              seasons_MAX_GT: Int
              seasons_MAX_GTE: Int
              seasons_MAX_LT: Int
              seasons_MAX_LTE: Int
              seasons_MIN_EQUAL: Int
              seasons_MIN_GT: Int
              seasons_MIN_GTE: Int
              seasons_MIN_LT: Int
              seasons_MIN_LTE: Int
              seasons_SUM_EQUAL: Int
              seasons_SUM_GT: Int
              seasons_SUM_GTE: Int
              seasons_SUM_LT: Int
              seasons_SUM_LTE: Int
            }

            input StarredInCreateInput {
              seasons: Int!
            }

            input StarredInSort {
              seasons: SortDirection
            }

            input StarredInUpdateInput {
              seasons: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              seasons_DECREMENT: Int
              seasons_INCREMENT: Int
              seasons_SET: Int
            }

            input StarredInWhere {
              AND: [StarredInWhere!]
              NOT: StarredInWhere
              OR: [StarredInWhere!]
              seasons: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              seasons_EQ: Int
              seasons_GT: Int
              seasons_GTE: Int
              seasons_IN: [Int!]
              seasons_LT: Int
              seasons_LTE: Int
            }

            type StringAggregateSelection {
              longest: String
              shortest: String
            }

            type UpdateActorsMutationResponse {
              actors: [Actor!]!
              info: UpdateInfo!
            }

            type UpdateEpisodesMutationResponse {
              episodes: [Episode!]!
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
            }

            type UpdateSeriesMutationResponse {
              info: UpdateInfo!
              series: [Series!]!
            }"
        `);
    });

    test("Interface Relationships - nested interface relationships", async () => {
        const typeDefs = gql`
            interface Interface1 {
                field1: String!
                interface2: [Interface2!]! @declareRelationship
            }

            interface Interface2 {
                field2: String
            }

            type Type1Interface1 implements Interface1 @node {
                field1: String!
                interface2: [Interface2!]! @relationship(type: "INTERFACE_TWO", direction: OUT)
            }

            type Type2Interface1 implements Interface1 @node {
                field1: String!
                interface2: [Interface2!]! @relationship(type: "INTERFACE_TWO", direction: OUT)
            }

            type Type1Interface2 implements Interface2 @node {
                field2: String!
            }

            type Type2Interface2 implements Interface2 @node {
                field2: String!
            }

            type Type1 @node {
                field1: String!
                interface1: [Interface1!]! @relationship(type: "INTERFACE_ONE", direction: OUT)
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

            type CreateType1Interface1sMutationResponse {
              info: CreateInfo!
              type1Interface1s: [Type1Interface1!]!
            }

            type CreateType1Interface2sMutationResponse {
              info: CreateInfo!
              type1Interface2s: [Type1Interface2!]!
            }

            type CreateType1sMutationResponse {
              info: CreateInfo!
              type1s: [Type1!]!
            }

            type CreateType2Interface1sMutationResponse {
              info: CreateInfo!
              type2Interface1s: [Type2Interface1!]!
            }

            type CreateType2Interface2sMutationResponse {
              info: CreateInfo!
              type2Interface2s: [Type2Interface2!]!
            }

            \\"\\"\\"
            Information about the number of nodes and relationships deleted during a delete mutation
            \\"\\"\\"
            type DeleteInfo {
              nodesDeleted: Int!
              relationshipsDeleted: Int!
            }

            interface Interface1 {
              field1: String!
              interface2(limit: Int, offset: Int, options: Interface2Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Interface2Sort!], where: Interface2Where): [Interface2!]!
              interface2Connection(after: String, first: Int, sort: [Interface1Interface2ConnectionSort!], where: Interface1Interface2ConnectionWhere): Interface1Interface2Connection!
            }

            type Interface1AggregateSelection {
              count: Int!
              field1: StringAggregateSelection!
            }

            input Interface1ConnectInput {
              interface2: [Interface1Interface2ConnectFieldInput!]
            }

            input Interface1ConnectWhere {
              node: Interface1Where!
            }

            input Interface1CreateInput {
              Type1Interface1: Type1Interface1CreateInput
              Type2Interface1: Type2Interface1CreateInput
            }

            input Interface1DeleteInput {
              interface2: [Interface1Interface2DeleteFieldInput!]
            }

            input Interface1DisconnectInput {
              interface2: [Interface1Interface2DisconnectFieldInput!]
            }

            type Interface1Edge {
              cursor: String!
              node: Interface1!
            }

            enum Interface1Implementation {
              Type1Interface1
              Type2Interface1
            }

            input Interface1Interface2AggregateInput {
              AND: [Interface1Interface2AggregateInput!]
              NOT: Interface1Interface2AggregateInput
              OR: [Interface1Interface2AggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              node: Interface1Interface2NodeAggregationWhereInput
            }

            input Interface1Interface2ConnectFieldInput {
              where: Interface2ConnectWhere
            }

            type Interface1Interface2Connection {
              edges: [Interface1Interface2Relationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input Interface1Interface2ConnectionSort {
              node: Interface2Sort
            }

            input Interface1Interface2ConnectionWhere {
              AND: [Interface1Interface2ConnectionWhere!]
              NOT: Interface1Interface2ConnectionWhere
              OR: [Interface1Interface2ConnectionWhere!]
              node: Interface2Where
            }

            input Interface1Interface2CreateFieldInput {
              node: Interface2CreateInput!
            }

            input Interface1Interface2DeleteFieldInput {
              where: Interface1Interface2ConnectionWhere
            }

            input Interface1Interface2DisconnectFieldInput {
              where: Interface1Interface2ConnectionWhere
            }

            input Interface1Interface2NodeAggregationWhereInput {
              AND: [Interface1Interface2NodeAggregationWhereInput!]
              NOT: Interface1Interface2NodeAggregationWhereInput
              OR: [Interface1Interface2NodeAggregationWhereInput!]
              field2_AVERAGE_LENGTH_EQUAL: Float
              field2_AVERAGE_LENGTH_GT: Float
              field2_AVERAGE_LENGTH_GTE: Float
              field2_AVERAGE_LENGTH_LT: Float
              field2_AVERAGE_LENGTH_LTE: Float
              field2_LONGEST_LENGTH_EQUAL: Int
              field2_LONGEST_LENGTH_GT: Int
              field2_LONGEST_LENGTH_GTE: Int
              field2_LONGEST_LENGTH_LT: Int
              field2_LONGEST_LENGTH_LTE: Int
              field2_SHORTEST_LENGTH_EQUAL: Int
              field2_SHORTEST_LENGTH_GT: Int
              field2_SHORTEST_LENGTH_GTE: Int
              field2_SHORTEST_LENGTH_LT: Int
              field2_SHORTEST_LENGTH_LTE: Int
            }

            type Interface1Interface2Relationship {
              cursor: String!
              node: Interface2!
            }

            input Interface1Interface2UpdateConnectionInput {
              node: Interface2UpdateInput
            }

            input Interface1Interface2UpdateFieldInput {
              connect: [Interface1Interface2ConnectFieldInput!]
              create: [Interface1Interface2CreateFieldInput!]
              delete: [Interface1Interface2DeleteFieldInput!]
              disconnect: [Interface1Interface2DisconnectFieldInput!]
              update: Interface1Interface2UpdateConnectionInput
              where: Interface1Interface2ConnectionWhere
            }

            input Interface1Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Interface1Sort objects to sort Interface1s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Interface1Sort!]
            }

            \\"\\"\\"
            Fields to sort Interface1s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Interface1Sort object.
            \\"\\"\\"
            input Interface1Sort {
              field1: SortDirection
            }

            input Interface1UpdateInput {
              field1: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field1_SET: String
              interface2: [Interface1Interface2UpdateFieldInput!]
            }

            input Interface1Where {
              AND: [Interface1Where!]
              NOT: Interface1Where
              OR: [Interface1Where!]
              field1: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field1_CONTAINS: String
              field1_ENDS_WITH: String
              field1_EQ: String
              field1_IN: [String!]
              field1_STARTS_WITH: String
              interface2Aggregate: Interface1Interface2AggregateInput
              \\"\\"\\"
              Return Interface1s where all of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_ALL: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Interface1s where none of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_NONE: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Interface1s where one of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_SINGLE: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Interface1s where some of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_SOME: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Interface1s where all of the related Interface2s match this filter
              \\"\\"\\"
              interface2_ALL: Interface2Where
              \\"\\"\\"
              Return Interface1s where none of the related Interface2s match this filter
              \\"\\"\\"
              interface2_NONE: Interface2Where
              \\"\\"\\"
              Return Interface1s where one of the related Interface2s match this filter
              \\"\\"\\"
              interface2_SINGLE: Interface2Where
              \\"\\"\\"
              Return Interface1s where some of the related Interface2s match this filter
              \\"\\"\\"
              interface2_SOME: Interface2Where
              typename: [Interface1Implementation!]
              typename_IN: [Interface1Implementation!] @deprecated(reason: \\"The typename_IN filter is deprecated, please use the typename filter instead\\")
            }

            type Interface1sConnection {
              edges: [Interface1Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            interface Interface2 {
              field2: String
            }

            type Interface2AggregateSelection {
              count: Int!
              field2: StringAggregateSelection!
            }

            input Interface2ConnectWhere {
              node: Interface2Where!
            }

            input Interface2CreateInput {
              Type1Interface2: Type1Interface2CreateInput
              Type2Interface2: Type2Interface2CreateInput
            }

            type Interface2Edge {
              cursor: String!
              node: Interface2!
            }

            enum Interface2Implementation {
              Type1Interface2
              Type2Interface2
            }

            input Interface2Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Interface2Sort objects to sort Interface2s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Interface2Sort!]
            }

            \\"\\"\\"
            Fields to sort Interface2s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Interface2Sort object.
            \\"\\"\\"
            input Interface2Sort {
              field2: SortDirection
            }

            input Interface2UpdateInput {
              field2: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field2_SET: String
            }

            input Interface2Where {
              AND: [Interface2Where!]
              NOT: Interface2Where
              OR: [Interface2Where!]
              field2: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field2_CONTAINS: String
              field2_ENDS_WITH: String
              field2_EQ: String
              field2_IN: [String]
              field2_STARTS_WITH: String
              typename: [Interface2Implementation!]
              typename_IN: [Interface2Implementation!] @deprecated(reason: \\"The typename_IN filter is deprecated, please use the typename filter instead\\")
            }

            type Interface2sConnection {
              edges: [Interface2Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Mutation {
              createType1Interface1s(input: [Type1Interface1CreateInput!]!): CreateType1Interface1sMutationResponse!
              createType1Interface2s(input: [Type1Interface2CreateInput!]!): CreateType1Interface2sMutationResponse!
              createType1s(input: [Type1CreateInput!]!): CreateType1sMutationResponse!
              createType2Interface1s(input: [Type2Interface1CreateInput!]!): CreateType2Interface1sMutationResponse!
              createType2Interface2s(input: [Type2Interface2CreateInput!]!): CreateType2Interface2sMutationResponse!
              deleteType1Interface1s(delete: Type1Interface1DeleteInput, where: Type1Interface1Where): DeleteInfo!
              deleteType1Interface2s(where: Type1Interface2Where): DeleteInfo!
              deleteType1s(delete: Type1DeleteInput, where: Type1Where): DeleteInfo!
              deleteType2Interface1s(delete: Type2Interface1DeleteInput, where: Type2Interface1Where): DeleteInfo!
              deleteType2Interface2s(where: Type2Interface2Where): DeleteInfo!
              updateType1Interface1s(update: Type1Interface1UpdateInput, where: Type1Interface1Where): UpdateType1Interface1sMutationResponse!
              updateType1Interface2s(update: Type1Interface2UpdateInput, where: Type1Interface2Where): UpdateType1Interface2sMutationResponse!
              updateType1s(update: Type1UpdateInput, where: Type1Where): UpdateType1sMutationResponse!
              updateType2Interface1s(update: Type2Interface1UpdateInput, where: Type2Interface1Where): UpdateType2Interface1sMutationResponse!
              updateType2Interface2s(update: Type2Interface2UpdateInput, where: Type2Interface2Where): UpdateType2Interface2sMutationResponse!
            }

            \\"\\"\\"Pagination information (Relay)\\"\\"\\"
            type PageInfo {
              endCursor: String
              hasNextPage: Boolean!
              hasPreviousPage: Boolean!
              startCursor: String
            }

            type Query {
              interface1s(limit: Int, offset: Int, options: Interface1Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Interface1Sort!], where: Interface1Where): [Interface1!]!
              interface1sAggregate(where: Interface1Where): Interface1AggregateSelection!
              interface1sConnection(after: String, first: Int, sort: [Interface1Sort!], where: Interface1Where): Interface1sConnection!
              interface2s(limit: Int, offset: Int, options: Interface2Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Interface2Sort!], where: Interface2Where): [Interface2!]!
              interface2sAggregate(where: Interface2Where): Interface2AggregateSelection!
              interface2sConnection(after: String, first: Int, sort: [Interface2Sort!], where: Interface2Where): Interface2sConnection!
              type1Interface1s(limit: Int, offset: Int, options: Type1Interface1Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Type1Interface1Sort!], where: Type1Interface1Where): [Type1Interface1!]!
              type1Interface1sAggregate(where: Type1Interface1Where): Type1Interface1AggregateSelection!
              type1Interface1sConnection(after: String, first: Int, sort: [Type1Interface1Sort!], where: Type1Interface1Where): Type1Interface1sConnection!
              type1Interface2s(limit: Int, offset: Int, options: Type1Interface2Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Type1Interface2Sort!], where: Type1Interface2Where): [Type1Interface2!]!
              type1Interface2sAggregate(where: Type1Interface2Where): Type1Interface2AggregateSelection!
              type1Interface2sConnection(after: String, first: Int, sort: [Type1Interface2Sort!], where: Type1Interface2Where): Type1Interface2sConnection!
              type1s(limit: Int, offset: Int, options: Type1Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Type1Sort!], where: Type1Where): [Type1!]!
              type1sAggregate(where: Type1Where): Type1AggregateSelection!
              type1sConnection(after: String, first: Int, sort: [Type1Sort!], where: Type1Where): Type1sConnection!
              type2Interface1s(limit: Int, offset: Int, options: Type2Interface1Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Type2Interface1Sort!], where: Type2Interface1Where): [Type2Interface1!]!
              type2Interface1sAggregate(where: Type2Interface1Where): Type2Interface1AggregateSelection!
              type2Interface1sConnection(after: String, first: Int, sort: [Type2Interface1Sort!], where: Type2Interface1Where): Type2Interface1sConnection!
              type2Interface2s(limit: Int, offset: Int, options: Type2Interface2Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Type2Interface2Sort!], where: Type2Interface2Where): [Type2Interface2!]!
              type2Interface2sAggregate(where: Type2Interface2Where): Type2Interface2AggregateSelection!
              type2Interface2sConnection(after: String, first: Int, sort: [Type2Interface2Sort!], where: Type2Interface2Where): Type2Interface2sConnection!
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

            type Type1 {
              field1: String!
              interface1(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: Interface1Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Interface1Sort!], where: Interface1Where): [Interface1!]!
              interface1Aggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: Interface1Where): Type1Interface1Interface1AggregationSelection
              interface1Connection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [Type1Interface1ConnectionSort!], where: Type1Interface1ConnectionWhere): Type1Interface1Connection!
            }

            type Type1AggregateSelection {
              count: Int!
              field1: StringAggregateSelection!
            }

            input Type1CreateInput {
              field1: String!
              interface1: Type1Interface1FieldInput
            }

            input Type1DeleteInput {
              interface1: [Type1Interface1DeleteFieldInput!]
            }

            type Type1Edge {
              cursor: String!
              node: Type1!
            }

            type Type1Interface1 implements Interface1 {
              field1: String!
              interface2(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: Interface2Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Interface2Sort!], where: Interface2Where): [Interface2!]!
              interface2Aggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: Interface2Where): Type1Interface1Interface2Interface2AggregationSelection
              interface2Connection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [Interface1Interface2ConnectionSort!], where: Interface1Interface2ConnectionWhere): Interface1Interface2Connection!
            }

            input Type1Interface1AggregateInput {
              AND: [Type1Interface1AggregateInput!]
              NOT: Type1Interface1AggregateInput
              OR: [Type1Interface1AggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              node: Type1Interface1NodeAggregationWhereInput
            }

            type Type1Interface1AggregateSelection {
              count: Int!
              field1: StringAggregateSelection!
            }

            input Type1Interface1ConnectFieldInput {
              connect: Interface1ConnectInput
              where: Interface1ConnectWhere
            }

            type Type1Interface1Connection {
              edges: [Type1Interface1Relationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input Type1Interface1ConnectionSort {
              node: Interface1Sort
            }

            input Type1Interface1ConnectionWhere {
              AND: [Type1Interface1ConnectionWhere!]
              NOT: Type1Interface1ConnectionWhere
              OR: [Type1Interface1ConnectionWhere!]
              node: Interface1Where
            }

            input Type1Interface1CreateFieldInput {
              node: Interface1CreateInput!
            }

            input Type1Interface1CreateInput {
              field1: String!
              interface2: Type1Interface1Interface2FieldInput
            }

            input Type1Interface1DeleteFieldInput {
              delete: Interface1DeleteInput
              where: Type1Interface1ConnectionWhere
            }

            input Type1Interface1DeleteInput {
              interface2: [Type1Interface1Interface2DeleteFieldInput!]
            }

            input Type1Interface1DisconnectFieldInput {
              disconnect: Interface1DisconnectInput
              where: Type1Interface1ConnectionWhere
            }

            type Type1Interface1Edge {
              cursor: String!
              node: Type1Interface1!
            }

            input Type1Interface1FieldInput {
              connect: [Type1Interface1ConnectFieldInput!]
              create: [Type1Interface1CreateFieldInput!]
            }

            type Type1Interface1Interface1AggregationSelection {
              count: Int!
              node: Type1Interface1Interface1NodeAggregateSelection
            }

            type Type1Interface1Interface1NodeAggregateSelection {
              field1: StringAggregateSelection!
            }

            input Type1Interface1Interface2AggregateInput {
              AND: [Type1Interface1Interface2AggregateInput!]
              NOT: Type1Interface1Interface2AggregateInput
              OR: [Type1Interface1Interface2AggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              node: Type1Interface1Interface2NodeAggregationWhereInput
            }

            input Type1Interface1Interface2ConnectFieldInput {
              where: Interface2ConnectWhere
            }

            input Type1Interface1Interface2CreateFieldInput {
              node: Interface2CreateInput!
            }

            input Type1Interface1Interface2DeleteFieldInput {
              where: Interface1Interface2ConnectionWhere
            }

            input Type1Interface1Interface2DisconnectFieldInput {
              where: Interface1Interface2ConnectionWhere
            }

            input Type1Interface1Interface2FieldInput {
              connect: [Type1Interface1Interface2ConnectFieldInput!]
              create: [Type1Interface1Interface2CreateFieldInput!]
            }

            type Type1Interface1Interface2Interface2AggregationSelection {
              count: Int!
              node: Type1Interface1Interface2Interface2NodeAggregateSelection
            }

            type Type1Interface1Interface2Interface2NodeAggregateSelection {
              field2: StringAggregateSelection!
            }

            input Type1Interface1Interface2NodeAggregationWhereInput {
              AND: [Type1Interface1Interface2NodeAggregationWhereInput!]
              NOT: Type1Interface1Interface2NodeAggregationWhereInput
              OR: [Type1Interface1Interface2NodeAggregationWhereInput!]
              field2_AVERAGE_LENGTH_EQUAL: Float
              field2_AVERAGE_LENGTH_GT: Float
              field2_AVERAGE_LENGTH_GTE: Float
              field2_AVERAGE_LENGTH_LT: Float
              field2_AVERAGE_LENGTH_LTE: Float
              field2_LONGEST_LENGTH_EQUAL: Int
              field2_LONGEST_LENGTH_GT: Int
              field2_LONGEST_LENGTH_GTE: Int
              field2_LONGEST_LENGTH_LT: Int
              field2_LONGEST_LENGTH_LTE: Int
              field2_SHORTEST_LENGTH_EQUAL: Int
              field2_SHORTEST_LENGTH_GT: Int
              field2_SHORTEST_LENGTH_GTE: Int
              field2_SHORTEST_LENGTH_LT: Int
              field2_SHORTEST_LENGTH_LTE: Int
            }

            input Type1Interface1Interface2UpdateConnectionInput {
              node: Interface2UpdateInput
            }

            input Type1Interface1Interface2UpdateFieldInput {
              connect: [Type1Interface1Interface2ConnectFieldInput!]
              create: [Type1Interface1Interface2CreateFieldInput!]
              delete: [Type1Interface1Interface2DeleteFieldInput!]
              disconnect: [Type1Interface1Interface2DisconnectFieldInput!]
              update: Type1Interface1Interface2UpdateConnectionInput
              where: Interface1Interface2ConnectionWhere
            }

            input Type1Interface1NodeAggregationWhereInput {
              AND: [Type1Interface1NodeAggregationWhereInput!]
              NOT: Type1Interface1NodeAggregationWhereInput
              OR: [Type1Interface1NodeAggregationWhereInput!]
              field1_AVERAGE_LENGTH_EQUAL: Float
              field1_AVERAGE_LENGTH_GT: Float
              field1_AVERAGE_LENGTH_GTE: Float
              field1_AVERAGE_LENGTH_LT: Float
              field1_AVERAGE_LENGTH_LTE: Float
              field1_LONGEST_LENGTH_EQUAL: Int
              field1_LONGEST_LENGTH_GT: Int
              field1_LONGEST_LENGTH_GTE: Int
              field1_LONGEST_LENGTH_LT: Int
              field1_LONGEST_LENGTH_LTE: Int
              field1_SHORTEST_LENGTH_EQUAL: Int
              field1_SHORTEST_LENGTH_GT: Int
              field1_SHORTEST_LENGTH_GTE: Int
              field1_SHORTEST_LENGTH_LT: Int
              field1_SHORTEST_LENGTH_LTE: Int
            }

            input Type1Interface1Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Type1Interface1Sort objects to sort Type1Interface1s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Type1Interface1Sort!]
            }

            type Type1Interface1Relationship {
              cursor: String!
              node: Interface1!
            }

            \\"\\"\\"
            Fields to sort Type1Interface1s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Type1Interface1Sort object.
            \\"\\"\\"
            input Type1Interface1Sort {
              field1: SortDirection
            }

            input Type1Interface1UpdateConnectionInput {
              node: Interface1UpdateInput
            }

            input Type1Interface1UpdateFieldInput {
              connect: [Type1Interface1ConnectFieldInput!]
              create: [Type1Interface1CreateFieldInput!]
              delete: [Type1Interface1DeleteFieldInput!]
              disconnect: [Type1Interface1DisconnectFieldInput!]
              update: Type1Interface1UpdateConnectionInput
              where: Type1Interface1ConnectionWhere
            }

            input Type1Interface1UpdateInput {
              field1: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field1_SET: String
              interface2: [Type1Interface1Interface2UpdateFieldInput!]
            }

            input Type1Interface1Where {
              AND: [Type1Interface1Where!]
              NOT: Type1Interface1Where
              OR: [Type1Interface1Where!]
              field1: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field1_CONTAINS: String
              field1_ENDS_WITH: String
              field1_EQ: String
              field1_IN: [String!]
              field1_STARTS_WITH: String
              interface2Aggregate: Type1Interface1Interface2AggregateInput
              \\"\\"\\"
              Return Type1Interface1s where all of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_ALL: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type1Interface1s where none of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_NONE: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type1Interface1s where one of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_SINGLE: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type1Interface1s where some of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_SOME: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type1Interface1s where all of the related Interface2s match this filter
              \\"\\"\\"
              interface2_ALL: Interface2Where
              \\"\\"\\"
              Return Type1Interface1s where none of the related Interface2s match this filter
              \\"\\"\\"
              interface2_NONE: Interface2Where
              \\"\\"\\"
              Return Type1Interface1s where one of the related Interface2s match this filter
              \\"\\"\\"
              interface2_SINGLE: Interface2Where
              \\"\\"\\"
              Return Type1Interface1s where some of the related Interface2s match this filter
              \\"\\"\\"
              interface2_SOME: Interface2Where
            }

            type Type1Interface1sConnection {
              edges: [Type1Interface1Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Type1Interface2 implements Interface2 {
              field2: String!
            }

            type Type1Interface2AggregateSelection {
              count: Int!
              field2: StringAggregateSelection!
            }

            input Type1Interface2CreateInput {
              field2: String!
            }

            type Type1Interface2Edge {
              cursor: String!
              node: Type1Interface2!
            }

            input Type1Interface2Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Type1Interface2Sort objects to sort Type1Interface2s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Type1Interface2Sort!]
            }

            \\"\\"\\"
            Fields to sort Type1Interface2s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Type1Interface2Sort object.
            \\"\\"\\"
            input Type1Interface2Sort {
              field2: SortDirection
            }

            input Type1Interface2UpdateInput {
              field2: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field2_SET: String
            }

            input Type1Interface2Where {
              AND: [Type1Interface2Where!]
              NOT: Type1Interface2Where
              OR: [Type1Interface2Where!]
              field2: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field2_CONTAINS: String
              field2_ENDS_WITH: String
              field2_EQ: String
              field2_IN: [String!]
              field2_STARTS_WITH: String
            }

            type Type1Interface2sConnection {
              edges: [Type1Interface2Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input Type1Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Type1Sort objects to sort Type1s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Type1Sort!]
            }

            \\"\\"\\"
            Fields to sort Type1s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Type1Sort object.
            \\"\\"\\"
            input Type1Sort {
              field1: SortDirection
            }

            input Type1UpdateInput {
              field1: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field1_SET: String
              interface1: [Type1Interface1UpdateFieldInput!]
            }

            input Type1Where {
              AND: [Type1Where!]
              NOT: Type1Where
              OR: [Type1Where!]
              field1: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field1_CONTAINS: String
              field1_ENDS_WITH: String
              field1_EQ: String
              field1_IN: [String!]
              field1_STARTS_WITH: String
              interface1Aggregate: Type1Interface1AggregateInput
              \\"\\"\\"
              Return Type1s where all of the related Type1Interface1Connections match this filter
              \\"\\"\\"
              interface1Connection_ALL: Type1Interface1ConnectionWhere
              \\"\\"\\"
              Return Type1s where none of the related Type1Interface1Connections match this filter
              \\"\\"\\"
              interface1Connection_NONE: Type1Interface1ConnectionWhere
              \\"\\"\\"
              Return Type1s where one of the related Type1Interface1Connections match this filter
              \\"\\"\\"
              interface1Connection_SINGLE: Type1Interface1ConnectionWhere
              \\"\\"\\"
              Return Type1s where some of the related Type1Interface1Connections match this filter
              \\"\\"\\"
              interface1Connection_SOME: Type1Interface1ConnectionWhere
              \\"\\"\\"Return Type1s where all of the related Interface1s match this filter\\"\\"\\"
              interface1_ALL: Interface1Where
              \\"\\"\\"Return Type1s where none of the related Interface1s match this filter\\"\\"\\"
              interface1_NONE: Interface1Where
              \\"\\"\\"Return Type1s where one of the related Interface1s match this filter\\"\\"\\"
              interface1_SINGLE: Interface1Where
              \\"\\"\\"Return Type1s where some of the related Interface1s match this filter\\"\\"\\"
              interface1_SOME: Interface1Where
            }

            type Type1sConnection {
              edges: [Type1Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Type2Interface1 implements Interface1 {
              field1: String!
              interface2(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: Interface2Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Interface2Sort!], where: Interface2Where): [Interface2!]!
              interface2Aggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: Interface2Where): Type2Interface1Interface2Interface2AggregationSelection
              interface2Connection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [Interface1Interface2ConnectionSort!], where: Interface1Interface2ConnectionWhere): Interface1Interface2Connection!
            }

            type Type2Interface1AggregateSelection {
              count: Int!
              field1: StringAggregateSelection!
            }

            input Type2Interface1CreateInput {
              field1: String!
              interface2: Type2Interface1Interface2FieldInput
            }

            input Type2Interface1DeleteInput {
              interface2: [Type2Interface1Interface2DeleteFieldInput!]
            }

            type Type2Interface1Edge {
              cursor: String!
              node: Type2Interface1!
            }

            input Type2Interface1Interface2AggregateInput {
              AND: [Type2Interface1Interface2AggregateInput!]
              NOT: Type2Interface1Interface2AggregateInput
              OR: [Type2Interface1Interface2AggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              node: Type2Interface1Interface2NodeAggregationWhereInput
            }

            input Type2Interface1Interface2ConnectFieldInput {
              where: Interface2ConnectWhere
            }

            input Type2Interface1Interface2CreateFieldInput {
              node: Interface2CreateInput!
            }

            input Type2Interface1Interface2DeleteFieldInput {
              where: Interface1Interface2ConnectionWhere
            }

            input Type2Interface1Interface2DisconnectFieldInput {
              where: Interface1Interface2ConnectionWhere
            }

            input Type2Interface1Interface2FieldInput {
              connect: [Type2Interface1Interface2ConnectFieldInput!]
              create: [Type2Interface1Interface2CreateFieldInput!]
            }

            type Type2Interface1Interface2Interface2AggregationSelection {
              count: Int!
              node: Type2Interface1Interface2Interface2NodeAggregateSelection
            }

            type Type2Interface1Interface2Interface2NodeAggregateSelection {
              field2: StringAggregateSelection!
            }

            input Type2Interface1Interface2NodeAggregationWhereInput {
              AND: [Type2Interface1Interface2NodeAggregationWhereInput!]
              NOT: Type2Interface1Interface2NodeAggregationWhereInput
              OR: [Type2Interface1Interface2NodeAggregationWhereInput!]
              field2_AVERAGE_LENGTH_EQUAL: Float
              field2_AVERAGE_LENGTH_GT: Float
              field2_AVERAGE_LENGTH_GTE: Float
              field2_AVERAGE_LENGTH_LT: Float
              field2_AVERAGE_LENGTH_LTE: Float
              field2_LONGEST_LENGTH_EQUAL: Int
              field2_LONGEST_LENGTH_GT: Int
              field2_LONGEST_LENGTH_GTE: Int
              field2_LONGEST_LENGTH_LT: Int
              field2_LONGEST_LENGTH_LTE: Int
              field2_SHORTEST_LENGTH_EQUAL: Int
              field2_SHORTEST_LENGTH_GT: Int
              field2_SHORTEST_LENGTH_GTE: Int
              field2_SHORTEST_LENGTH_LT: Int
              field2_SHORTEST_LENGTH_LTE: Int
            }

            input Type2Interface1Interface2UpdateConnectionInput {
              node: Interface2UpdateInput
            }

            input Type2Interface1Interface2UpdateFieldInput {
              connect: [Type2Interface1Interface2ConnectFieldInput!]
              create: [Type2Interface1Interface2CreateFieldInput!]
              delete: [Type2Interface1Interface2DeleteFieldInput!]
              disconnect: [Type2Interface1Interface2DisconnectFieldInput!]
              update: Type2Interface1Interface2UpdateConnectionInput
              where: Interface1Interface2ConnectionWhere
            }

            input Type2Interface1Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Type2Interface1Sort objects to sort Type2Interface1s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Type2Interface1Sort!]
            }

            \\"\\"\\"
            Fields to sort Type2Interface1s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Type2Interface1Sort object.
            \\"\\"\\"
            input Type2Interface1Sort {
              field1: SortDirection
            }

            input Type2Interface1UpdateInput {
              field1: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field1_SET: String
              interface2: [Type2Interface1Interface2UpdateFieldInput!]
            }

            input Type2Interface1Where {
              AND: [Type2Interface1Where!]
              NOT: Type2Interface1Where
              OR: [Type2Interface1Where!]
              field1: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field1_CONTAINS: String
              field1_ENDS_WITH: String
              field1_EQ: String
              field1_IN: [String!]
              field1_STARTS_WITH: String
              interface2Aggregate: Type2Interface1Interface2AggregateInput
              \\"\\"\\"
              Return Type2Interface1s where all of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_ALL: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type2Interface1s where none of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_NONE: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type2Interface1s where one of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_SINGLE: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type2Interface1s where some of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_SOME: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type2Interface1s where all of the related Interface2s match this filter
              \\"\\"\\"
              interface2_ALL: Interface2Where
              \\"\\"\\"
              Return Type2Interface1s where none of the related Interface2s match this filter
              \\"\\"\\"
              interface2_NONE: Interface2Where
              \\"\\"\\"
              Return Type2Interface1s where one of the related Interface2s match this filter
              \\"\\"\\"
              interface2_SINGLE: Interface2Where
              \\"\\"\\"
              Return Type2Interface1s where some of the related Interface2s match this filter
              \\"\\"\\"
              interface2_SOME: Interface2Where
            }

            type Type2Interface1sConnection {
              edges: [Type2Interface1Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Type2Interface2 implements Interface2 {
              field2: String!
            }

            type Type2Interface2AggregateSelection {
              count: Int!
              field2: StringAggregateSelection!
            }

            input Type2Interface2CreateInput {
              field2: String!
            }

            type Type2Interface2Edge {
              cursor: String!
              node: Type2Interface2!
            }

            input Type2Interface2Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Type2Interface2Sort objects to sort Type2Interface2s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Type2Interface2Sort!]
            }

            \\"\\"\\"
            Fields to sort Type2Interface2s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Type2Interface2Sort object.
            \\"\\"\\"
            input Type2Interface2Sort {
              field2: SortDirection
            }

            input Type2Interface2UpdateInput {
              field2: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field2_SET: String
            }

            input Type2Interface2Where {
              AND: [Type2Interface2Where!]
              NOT: Type2Interface2Where
              OR: [Type2Interface2Where!]
              field2: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field2_CONTAINS: String
              field2_ENDS_WITH: String
              field2_EQ: String
              field2_IN: [String!]
              field2_STARTS_WITH: String
            }

            type Type2Interface2sConnection {
              edges: [Type2Interface2Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
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

            type UpdateType1Interface1sMutationResponse {
              info: UpdateInfo!
              type1Interface1s: [Type1Interface1!]!
            }

            type UpdateType1Interface2sMutationResponse {
              info: UpdateInfo!
              type1Interface2s: [Type1Interface2!]!
            }

            type UpdateType1sMutationResponse {
              info: UpdateInfo!
              type1s: [Type1!]!
            }

            type UpdateType2Interface1sMutationResponse {
              info: UpdateInfo!
              type2Interface1s: [Type2Interface1!]!
            }

            type UpdateType2Interface2sMutationResponse {
              info: UpdateInfo!
              type2Interface2s: [Type2Interface2!]!
            }"
        `);

        // expect(() => {
        //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
        //     const neoSchema = new Neo4jGraphQL({ typeDefs });
        // }).toThrowError("Nested interface relationship fields are not supported: Interface1.interface2");
    });

    test("Interface Relationships - nested interface relationships - with same properties", async () => {
        const typeDefs = gql`
            interface Interface1 {
                field1: String!
                interface2: [Interface2!]! @declareRelationship
            }

            interface Interface2 {
                field2: String
            }

            type Type1Interface1 implements Interface1 @node {
                field1: String!
                interface2: [Interface2!]! @relationship(type: "INTERFACE_TWO", direction: OUT, properties: "Props")
            }

            type Type2Interface1 implements Interface1 @node {
                field1: String!
                interface2: [Interface2!]! @relationship(type: "INTERFACE_TWO", direction: OUT, properties: "Props")
            }

            type Type1Interface2 implements Interface2 @node {
                field2: String!
            }

            type Type2Interface2 implements Interface2 @node {
                field2: String!
            }

            type Type1 @node {
                field1: String!
                interface1: [Interface1!]! @relationship(type: "INTERFACE_ONE", direction: OUT)
            }

            type Props @relationshipProperties {
                propsField: Int!
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

            type CreateType1Interface1sMutationResponse {
              info: CreateInfo!
              type1Interface1s: [Type1Interface1!]!
            }

            type CreateType1Interface2sMutationResponse {
              info: CreateInfo!
              type1Interface2s: [Type1Interface2!]!
            }

            type CreateType1sMutationResponse {
              info: CreateInfo!
              type1s: [Type1!]!
            }

            type CreateType2Interface1sMutationResponse {
              info: CreateInfo!
              type2Interface1s: [Type2Interface1!]!
            }

            type CreateType2Interface2sMutationResponse {
              info: CreateInfo!
              type2Interface2s: [Type2Interface2!]!
            }

            \\"\\"\\"
            Information about the number of nodes and relationships deleted during a delete mutation
            \\"\\"\\"
            type DeleteInfo {
              nodesDeleted: Int!
              relationshipsDeleted: Int!
            }

            type IntAggregateSelection {
              average: Float
              max: Int
              min: Int
              sum: Int
            }

            interface Interface1 {
              field1: String!
              interface2(limit: Int, offset: Int, options: Interface2Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Interface2Sort!], where: Interface2Where): [Interface2!]!
              interface2Connection(after: String, first: Int, sort: [Interface1Interface2ConnectionSort!], where: Interface1Interface2ConnectionWhere): Interface1Interface2Connection!
            }

            type Interface1AggregateSelection {
              count: Int!
              field1: StringAggregateSelection!
            }

            input Interface1ConnectInput {
              interface2: [Interface1Interface2ConnectFieldInput!]
            }

            input Interface1ConnectWhere {
              node: Interface1Where!
            }

            input Interface1CreateInput {
              Type1Interface1: Type1Interface1CreateInput
              Type2Interface1: Type2Interface1CreateInput
            }

            input Interface1DeleteInput {
              interface2: [Interface1Interface2DeleteFieldInput!]
            }

            input Interface1DisconnectInput {
              interface2: [Interface1Interface2DisconnectFieldInput!]
            }

            type Interface1Edge {
              cursor: String!
              node: Interface1!
            }

            enum Interface1Implementation {
              Type1Interface1
              Type2Interface1
            }

            input Interface1Interface2AggregateInput {
              AND: [Interface1Interface2AggregateInput!]
              NOT: Interface1Interface2AggregateInput
              OR: [Interface1Interface2AggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: Interface1Interface2EdgeAggregationWhereInput
              node: Interface1Interface2NodeAggregationWhereInput
            }

            input Interface1Interface2ConnectFieldInput {
              edge: Interface1Interface2EdgeCreateInput!
              where: Interface2ConnectWhere
            }

            type Interface1Interface2Connection {
              edges: [Interface1Interface2Relationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input Interface1Interface2ConnectionSort {
              edge: Interface1Interface2EdgeSort
              node: Interface2Sort
            }

            input Interface1Interface2ConnectionWhere {
              AND: [Interface1Interface2ConnectionWhere!]
              NOT: Interface1Interface2ConnectionWhere
              OR: [Interface1Interface2ConnectionWhere!]
              edge: Interface1Interface2EdgeWhere
              node: Interface2Where
            }

            input Interface1Interface2CreateFieldInput {
              edge: Interface1Interface2EdgeCreateInput!
              node: Interface2CreateInput!
            }

            input Interface1Interface2DeleteFieldInput {
              where: Interface1Interface2ConnectionWhere
            }

            input Interface1Interface2DisconnectFieldInput {
              where: Interface1Interface2ConnectionWhere
            }

            input Interface1Interface2EdgeAggregationWhereInput {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Type1Interface1
              * Type2Interface1
              \\"\\"\\"
              Props: PropsAggregationWhereInput
            }

            input Interface1Interface2EdgeCreateInput {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Type1Interface1
              * Type2Interface1
              \\"\\"\\"
              Props: PropsCreateInput!
            }

            input Interface1Interface2EdgeSort {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Type1Interface1
              * Type2Interface1
              \\"\\"\\"
              Props: PropsSort
            }

            input Interface1Interface2EdgeUpdateInput {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Type1Interface1
              * Type2Interface1
              \\"\\"\\"
              Props: PropsUpdateInput
            }

            input Interface1Interface2EdgeWhere {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Type1Interface1
              * Type2Interface1
              \\"\\"\\"
              Props: PropsWhere
            }

            input Interface1Interface2NodeAggregationWhereInput {
              AND: [Interface1Interface2NodeAggregationWhereInput!]
              NOT: Interface1Interface2NodeAggregationWhereInput
              OR: [Interface1Interface2NodeAggregationWhereInput!]
              field2_AVERAGE_LENGTH_EQUAL: Float
              field2_AVERAGE_LENGTH_GT: Float
              field2_AVERAGE_LENGTH_GTE: Float
              field2_AVERAGE_LENGTH_LT: Float
              field2_AVERAGE_LENGTH_LTE: Float
              field2_LONGEST_LENGTH_EQUAL: Int
              field2_LONGEST_LENGTH_GT: Int
              field2_LONGEST_LENGTH_GTE: Int
              field2_LONGEST_LENGTH_LT: Int
              field2_LONGEST_LENGTH_LTE: Int
              field2_SHORTEST_LENGTH_EQUAL: Int
              field2_SHORTEST_LENGTH_GT: Int
              field2_SHORTEST_LENGTH_GTE: Int
              field2_SHORTEST_LENGTH_LT: Int
              field2_SHORTEST_LENGTH_LTE: Int
            }

            type Interface1Interface2Relationship {
              cursor: String!
              node: Interface2!
              properties: Interface1Interface2RelationshipProperties!
            }

            union Interface1Interface2RelationshipProperties = Props

            input Interface1Interface2UpdateConnectionInput {
              edge: Interface1Interface2EdgeUpdateInput
              node: Interface2UpdateInput
            }

            input Interface1Interface2UpdateFieldInput {
              connect: [Interface1Interface2ConnectFieldInput!]
              create: [Interface1Interface2CreateFieldInput!]
              delete: [Interface1Interface2DeleteFieldInput!]
              disconnect: [Interface1Interface2DisconnectFieldInput!]
              update: Interface1Interface2UpdateConnectionInput
              where: Interface1Interface2ConnectionWhere
            }

            input Interface1Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Interface1Sort objects to sort Interface1s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Interface1Sort!]
            }

            \\"\\"\\"
            Fields to sort Interface1s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Interface1Sort object.
            \\"\\"\\"
            input Interface1Sort {
              field1: SortDirection
            }

            input Interface1UpdateInput {
              field1: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field1_SET: String
              interface2: [Interface1Interface2UpdateFieldInput!]
            }

            input Interface1Where {
              AND: [Interface1Where!]
              NOT: Interface1Where
              OR: [Interface1Where!]
              field1: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field1_CONTAINS: String
              field1_ENDS_WITH: String
              field1_EQ: String
              field1_IN: [String!]
              field1_STARTS_WITH: String
              interface2Aggregate: Interface1Interface2AggregateInput
              \\"\\"\\"
              Return Interface1s where all of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_ALL: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Interface1s where none of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_NONE: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Interface1s where one of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_SINGLE: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Interface1s where some of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_SOME: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Interface1s where all of the related Interface2s match this filter
              \\"\\"\\"
              interface2_ALL: Interface2Where
              \\"\\"\\"
              Return Interface1s where none of the related Interface2s match this filter
              \\"\\"\\"
              interface2_NONE: Interface2Where
              \\"\\"\\"
              Return Interface1s where one of the related Interface2s match this filter
              \\"\\"\\"
              interface2_SINGLE: Interface2Where
              \\"\\"\\"
              Return Interface1s where some of the related Interface2s match this filter
              \\"\\"\\"
              interface2_SOME: Interface2Where
              typename: [Interface1Implementation!]
              typename_IN: [Interface1Implementation!] @deprecated(reason: \\"The typename_IN filter is deprecated, please use the typename filter instead\\")
            }

            type Interface1sConnection {
              edges: [Interface1Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            interface Interface2 {
              field2: String
            }

            type Interface2AggregateSelection {
              count: Int!
              field2: StringAggregateSelection!
            }

            input Interface2ConnectWhere {
              node: Interface2Where!
            }

            input Interface2CreateInput {
              Type1Interface2: Type1Interface2CreateInput
              Type2Interface2: Type2Interface2CreateInput
            }

            type Interface2Edge {
              cursor: String!
              node: Interface2!
            }

            enum Interface2Implementation {
              Type1Interface2
              Type2Interface2
            }

            input Interface2Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Interface2Sort objects to sort Interface2s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Interface2Sort!]
            }

            \\"\\"\\"
            Fields to sort Interface2s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Interface2Sort object.
            \\"\\"\\"
            input Interface2Sort {
              field2: SortDirection
            }

            input Interface2UpdateInput {
              field2: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field2_SET: String
            }

            input Interface2Where {
              AND: [Interface2Where!]
              NOT: Interface2Where
              OR: [Interface2Where!]
              field2: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field2_CONTAINS: String
              field2_ENDS_WITH: String
              field2_EQ: String
              field2_IN: [String]
              field2_STARTS_WITH: String
              typename: [Interface2Implementation!]
              typename_IN: [Interface2Implementation!] @deprecated(reason: \\"The typename_IN filter is deprecated, please use the typename filter instead\\")
            }

            type Interface2sConnection {
              edges: [Interface2Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Mutation {
              createType1Interface1s(input: [Type1Interface1CreateInput!]!): CreateType1Interface1sMutationResponse!
              createType1Interface2s(input: [Type1Interface2CreateInput!]!): CreateType1Interface2sMutationResponse!
              createType1s(input: [Type1CreateInput!]!): CreateType1sMutationResponse!
              createType2Interface1s(input: [Type2Interface1CreateInput!]!): CreateType2Interface1sMutationResponse!
              createType2Interface2s(input: [Type2Interface2CreateInput!]!): CreateType2Interface2sMutationResponse!
              deleteType1Interface1s(delete: Type1Interface1DeleteInput, where: Type1Interface1Where): DeleteInfo!
              deleteType1Interface2s(where: Type1Interface2Where): DeleteInfo!
              deleteType1s(delete: Type1DeleteInput, where: Type1Where): DeleteInfo!
              deleteType2Interface1s(delete: Type2Interface1DeleteInput, where: Type2Interface1Where): DeleteInfo!
              deleteType2Interface2s(where: Type2Interface2Where): DeleteInfo!
              updateType1Interface1s(update: Type1Interface1UpdateInput, where: Type1Interface1Where): UpdateType1Interface1sMutationResponse!
              updateType1Interface2s(update: Type1Interface2UpdateInput, where: Type1Interface2Where): UpdateType1Interface2sMutationResponse!
              updateType1s(update: Type1UpdateInput, where: Type1Where): UpdateType1sMutationResponse!
              updateType2Interface1s(update: Type2Interface1UpdateInput, where: Type2Interface1Where): UpdateType2Interface1sMutationResponse!
              updateType2Interface2s(update: Type2Interface2UpdateInput, where: Type2Interface2Where): UpdateType2Interface2sMutationResponse!
            }

            \\"\\"\\"Pagination information (Relay)\\"\\"\\"
            type PageInfo {
              endCursor: String
              hasNextPage: Boolean!
              hasPreviousPage: Boolean!
              startCursor: String
            }

            \\"\\"\\"
            The edge properties for the following fields:
            * Type1Interface1.interface2
            * Type2Interface1.interface2
            \\"\\"\\"
            type Props {
              propsField: Int!
            }

            input PropsAggregationWhereInput {
              AND: [PropsAggregationWhereInput!]
              NOT: PropsAggregationWhereInput
              OR: [PropsAggregationWhereInput!]
              propsField_AVERAGE_EQUAL: Float
              propsField_AVERAGE_GT: Float
              propsField_AVERAGE_GTE: Float
              propsField_AVERAGE_LT: Float
              propsField_AVERAGE_LTE: Float
              propsField_MAX_EQUAL: Int
              propsField_MAX_GT: Int
              propsField_MAX_GTE: Int
              propsField_MAX_LT: Int
              propsField_MAX_LTE: Int
              propsField_MIN_EQUAL: Int
              propsField_MIN_GT: Int
              propsField_MIN_GTE: Int
              propsField_MIN_LT: Int
              propsField_MIN_LTE: Int
              propsField_SUM_EQUAL: Int
              propsField_SUM_GT: Int
              propsField_SUM_GTE: Int
              propsField_SUM_LT: Int
              propsField_SUM_LTE: Int
            }

            input PropsCreateInput {
              propsField: Int!
            }

            input PropsSort {
              propsField: SortDirection
            }

            input PropsUpdateInput {
              propsField: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              propsField_DECREMENT: Int
              propsField_INCREMENT: Int
              propsField_SET: Int
            }

            input PropsWhere {
              AND: [PropsWhere!]
              NOT: PropsWhere
              OR: [PropsWhere!]
              propsField: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              propsField_EQ: Int
              propsField_GT: Int
              propsField_GTE: Int
              propsField_IN: [Int!]
              propsField_LT: Int
              propsField_LTE: Int
            }

            type Query {
              interface1s(limit: Int, offset: Int, options: Interface1Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Interface1Sort!], where: Interface1Where): [Interface1!]!
              interface1sAggregate(where: Interface1Where): Interface1AggregateSelection!
              interface1sConnection(after: String, first: Int, sort: [Interface1Sort!], where: Interface1Where): Interface1sConnection!
              interface2s(limit: Int, offset: Int, options: Interface2Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Interface2Sort!], where: Interface2Where): [Interface2!]!
              interface2sAggregate(where: Interface2Where): Interface2AggregateSelection!
              interface2sConnection(after: String, first: Int, sort: [Interface2Sort!], where: Interface2Where): Interface2sConnection!
              type1Interface1s(limit: Int, offset: Int, options: Type1Interface1Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Type1Interface1Sort!], where: Type1Interface1Where): [Type1Interface1!]!
              type1Interface1sAggregate(where: Type1Interface1Where): Type1Interface1AggregateSelection!
              type1Interface1sConnection(after: String, first: Int, sort: [Type1Interface1Sort!], where: Type1Interface1Where): Type1Interface1sConnection!
              type1Interface2s(limit: Int, offset: Int, options: Type1Interface2Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Type1Interface2Sort!], where: Type1Interface2Where): [Type1Interface2!]!
              type1Interface2sAggregate(where: Type1Interface2Where): Type1Interface2AggregateSelection!
              type1Interface2sConnection(after: String, first: Int, sort: [Type1Interface2Sort!], where: Type1Interface2Where): Type1Interface2sConnection!
              type1s(limit: Int, offset: Int, options: Type1Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Type1Sort!], where: Type1Where): [Type1!]!
              type1sAggregate(where: Type1Where): Type1AggregateSelection!
              type1sConnection(after: String, first: Int, sort: [Type1Sort!], where: Type1Where): Type1sConnection!
              type2Interface1s(limit: Int, offset: Int, options: Type2Interface1Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Type2Interface1Sort!], where: Type2Interface1Where): [Type2Interface1!]!
              type2Interface1sAggregate(where: Type2Interface1Where): Type2Interface1AggregateSelection!
              type2Interface1sConnection(after: String, first: Int, sort: [Type2Interface1Sort!], where: Type2Interface1Where): Type2Interface1sConnection!
              type2Interface2s(limit: Int, offset: Int, options: Type2Interface2Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Type2Interface2Sort!], where: Type2Interface2Where): [Type2Interface2!]!
              type2Interface2sAggregate(where: Type2Interface2Where): Type2Interface2AggregateSelection!
              type2Interface2sConnection(after: String, first: Int, sort: [Type2Interface2Sort!], where: Type2Interface2Where): Type2Interface2sConnection!
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

            type Type1 {
              field1: String!
              interface1(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: Interface1Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Interface1Sort!], where: Interface1Where): [Interface1!]!
              interface1Aggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: Interface1Where): Type1Interface1Interface1AggregationSelection
              interface1Connection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [Type1Interface1ConnectionSort!], where: Type1Interface1ConnectionWhere): Type1Interface1Connection!
            }

            type Type1AggregateSelection {
              count: Int!
              field1: StringAggregateSelection!
            }

            input Type1CreateInput {
              field1: String!
              interface1: Type1Interface1FieldInput
            }

            input Type1DeleteInput {
              interface1: [Type1Interface1DeleteFieldInput!]
            }

            type Type1Edge {
              cursor: String!
              node: Type1!
            }

            type Type1Interface1 implements Interface1 {
              field1: String!
              interface2(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: Interface2Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Interface2Sort!], where: Interface2Where): [Interface2!]!
              interface2Aggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: Interface2Where): Type1Interface1Interface2Interface2AggregationSelection
              interface2Connection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [Interface1Interface2ConnectionSort!], where: Interface1Interface2ConnectionWhere): Interface1Interface2Connection!
            }

            input Type1Interface1AggregateInput {
              AND: [Type1Interface1AggregateInput!]
              NOT: Type1Interface1AggregateInput
              OR: [Type1Interface1AggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              node: Type1Interface1NodeAggregationWhereInput
            }

            type Type1Interface1AggregateSelection {
              count: Int!
              field1: StringAggregateSelection!
            }

            input Type1Interface1ConnectFieldInput {
              connect: Interface1ConnectInput
              where: Interface1ConnectWhere
            }

            type Type1Interface1Connection {
              edges: [Type1Interface1Relationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input Type1Interface1ConnectionSort {
              node: Interface1Sort
            }

            input Type1Interface1ConnectionWhere {
              AND: [Type1Interface1ConnectionWhere!]
              NOT: Type1Interface1ConnectionWhere
              OR: [Type1Interface1ConnectionWhere!]
              node: Interface1Where
            }

            input Type1Interface1CreateFieldInput {
              node: Interface1CreateInput!
            }

            input Type1Interface1CreateInput {
              field1: String!
              interface2: Type1Interface1Interface2FieldInput
            }

            input Type1Interface1DeleteFieldInput {
              delete: Interface1DeleteInput
              where: Type1Interface1ConnectionWhere
            }

            input Type1Interface1DeleteInput {
              interface2: [Type1Interface1Interface2DeleteFieldInput!]
            }

            input Type1Interface1DisconnectFieldInput {
              disconnect: Interface1DisconnectInput
              where: Type1Interface1ConnectionWhere
            }

            type Type1Interface1Edge {
              cursor: String!
              node: Type1Interface1!
            }

            input Type1Interface1FieldInput {
              connect: [Type1Interface1ConnectFieldInput!]
              create: [Type1Interface1CreateFieldInput!]
            }

            type Type1Interface1Interface1AggregationSelection {
              count: Int!
              node: Type1Interface1Interface1NodeAggregateSelection
            }

            type Type1Interface1Interface1NodeAggregateSelection {
              field1: StringAggregateSelection!
            }

            input Type1Interface1Interface2AggregateInput {
              AND: [Type1Interface1Interface2AggregateInput!]
              NOT: Type1Interface1Interface2AggregateInput
              OR: [Type1Interface1Interface2AggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: PropsAggregationWhereInput
              node: Type1Interface1Interface2NodeAggregationWhereInput
            }

            input Type1Interface1Interface2ConnectFieldInput {
              edge: PropsCreateInput!
              where: Interface2ConnectWhere
            }

            input Type1Interface1Interface2CreateFieldInput {
              edge: PropsCreateInput!
              node: Interface2CreateInput!
            }

            input Type1Interface1Interface2DeleteFieldInput {
              where: Interface1Interface2ConnectionWhere
            }

            input Type1Interface1Interface2DisconnectFieldInput {
              where: Interface1Interface2ConnectionWhere
            }

            input Type1Interface1Interface2FieldInput {
              connect: [Type1Interface1Interface2ConnectFieldInput!]
              create: [Type1Interface1Interface2CreateFieldInput!]
            }

            type Type1Interface1Interface2Interface2AggregationSelection {
              count: Int!
              edge: Type1Interface1Interface2Interface2EdgeAggregateSelection
              node: Type1Interface1Interface2Interface2NodeAggregateSelection
            }

            type Type1Interface1Interface2Interface2EdgeAggregateSelection {
              propsField: IntAggregateSelection!
            }

            type Type1Interface1Interface2Interface2NodeAggregateSelection {
              field2: StringAggregateSelection!
            }

            input Type1Interface1Interface2NodeAggregationWhereInput {
              AND: [Type1Interface1Interface2NodeAggregationWhereInput!]
              NOT: Type1Interface1Interface2NodeAggregationWhereInput
              OR: [Type1Interface1Interface2NodeAggregationWhereInput!]
              field2_AVERAGE_LENGTH_EQUAL: Float
              field2_AVERAGE_LENGTH_GT: Float
              field2_AVERAGE_LENGTH_GTE: Float
              field2_AVERAGE_LENGTH_LT: Float
              field2_AVERAGE_LENGTH_LTE: Float
              field2_LONGEST_LENGTH_EQUAL: Int
              field2_LONGEST_LENGTH_GT: Int
              field2_LONGEST_LENGTH_GTE: Int
              field2_LONGEST_LENGTH_LT: Int
              field2_LONGEST_LENGTH_LTE: Int
              field2_SHORTEST_LENGTH_EQUAL: Int
              field2_SHORTEST_LENGTH_GT: Int
              field2_SHORTEST_LENGTH_GTE: Int
              field2_SHORTEST_LENGTH_LT: Int
              field2_SHORTEST_LENGTH_LTE: Int
            }

            input Type1Interface1Interface2UpdateConnectionInput {
              edge: PropsUpdateInput
              node: Interface2UpdateInput
            }

            input Type1Interface1Interface2UpdateFieldInput {
              connect: [Type1Interface1Interface2ConnectFieldInput!]
              create: [Type1Interface1Interface2CreateFieldInput!]
              delete: [Type1Interface1Interface2DeleteFieldInput!]
              disconnect: [Type1Interface1Interface2DisconnectFieldInput!]
              update: Type1Interface1Interface2UpdateConnectionInput
              where: Interface1Interface2ConnectionWhere
            }

            input Type1Interface1NodeAggregationWhereInput {
              AND: [Type1Interface1NodeAggregationWhereInput!]
              NOT: Type1Interface1NodeAggregationWhereInput
              OR: [Type1Interface1NodeAggregationWhereInput!]
              field1_AVERAGE_LENGTH_EQUAL: Float
              field1_AVERAGE_LENGTH_GT: Float
              field1_AVERAGE_LENGTH_GTE: Float
              field1_AVERAGE_LENGTH_LT: Float
              field1_AVERAGE_LENGTH_LTE: Float
              field1_LONGEST_LENGTH_EQUAL: Int
              field1_LONGEST_LENGTH_GT: Int
              field1_LONGEST_LENGTH_GTE: Int
              field1_LONGEST_LENGTH_LT: Int
              field1_LONGEST_LENGTH_LTE: Int
              field1_SHORTEST_LENGTH_EQUAL: Int
              field1_SHORTEST_LENGTH_GT: Int
              field1_SHORTEST_LENGTH_GTE: Int
              field1_SHORTEST_LENGTH_LT: Int
              field1_SHORTEST_LENGTH_LTE: Int
            }

            input Type1Interface1Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Type1Interface1Sort objects to sort Type1Interface1s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Type1Interface1Sort!]
            }

            type Type1Interface1Relationship {
              cursor: String!
              node: Interface1!
            }

            \\"\\"\\"
            Fields to sort Type1Interface1s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Type1Interface1Sort object.
            \\"\\"\\"
            input Type1Interface1Sort {
              field1: SortDirection
            }

            input Type1Interface1UpdateConnectionInput {
              node: Interface1UpdateInput
            }

            input Type1Interface1UpdateFieldInput {
              connect: [Type1Interface1ConnectFieldInput!]
              create: [Type1Interface1CreateFieldInput!]
              delete: [Type1Interface1DeleteFieldInput!]
              disconnect: [Type1Interface1DisconnectFieldInput!]
              update: Type1Interface1UpdateConnectionInput
              where: Type1Interface1ConnectionWhere
            }

            input Type1Interface1UpdateInput {
              field1: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field1_SET: String
              interface2: [Type1Interface1Interface2UpdateFieldInput!]
            }

            input Type1Interface1Where {
              AND: [Type1Interface1Where!]
              NOT: Type1Interface1Where
              OR: [Type1Interface1Where!]
              field1: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field1_CONTAINS: String
              field1_ENDS_WITH: String
              field1_EQ: String
              field1_IN: [String!]
              field1_STARTS_WITH: String
              interface2Aggregate: Type1Interface1Interface2AggregateInput
              \\"\\"\\"
              Return Type1Interface1s where all of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_ALL: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type1Interface1s where none of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_NONE: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type1Interface1s where one of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_SINGLE: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type1Interface1s where some of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_SOME: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type1Interface1s where all of the related Interface2s match this filter
              \\"\\"\\"
              interface2_ALL: Interface2Where
              \\"\\"\\"
              Return Type1Interface1s where none of the related Interface2s match this filter
              \\"\\"\\"
              interface2_NONE: Interface2Where
              \\"\\"\\"
              Return Type1Interface1s where one of the related Interface2s match this filter
              \\"\\"\\"
              interface2_SINGLE: Interface2Where
              \\"\\"\\"
              Return Type1Interface1s where some of the related Interface2s match this filter
              \\"\\"\\"
              interface2_SOME: Interface2Where
            }

            type Type1Interface1sConnection {
              edges: [Type1Interface1Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Type1Interface2 implements Interface2 {
              field2: String!
            }

            type Type1Interface2AggregateSelection {
              count: Int!
              field2: StringAggregateSelection!
            }

            input Type1Interface2CreateInput {
              field2: String!
            }

            type Type1Interface2Edge {
              cursor: String!
              node: Type1Interface2!
            }

            input Type1Interface2Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Type1Interface2Sort objects to sort Type1Interface2s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Type1Interface2Sort!]
            }

            \\"\\"\\"
            Fields to sort Type1Interface2s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Type1Interface2Sort object.
            \\"\\"\\"
            input Type1Interface2Sort {
              field2: SortDirection
            }

            input Type1Interface2UpdateInput {
              field2: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field2_SET: String
            }

            input Type1Interface2Where {
              AND: [Type1Interface2Where!]
              NOT: Type1Interface2Where
              OR: [Type1Interface2Where!]
              field2: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field2_CONTAINS: String
              field2_ENDS_WITH: String
              field2_EQ: String
              field2_IN: [String!]
              field2_STARTS_WITH: String
            }

            type Type1Interface2sConnection {
              edges: [Type1Interface2Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input Type1Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Type1Sort objects to sort Type1s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Type1Sort!]
            }

            \\"\\"\\"
            Fields to sort Type1s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Type1Sort object.
            \\"\\"\\"
            input Type1Sort {
              field1: SortDirection
            }

            input Type1UpdateInput {
              field1: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field1_SET: String
              interface1: [Type1Interface1UpdateFieldInput!]
            }

            input Type1Where {
              AND: [Type1Where!]
              NOT: Type1Where
              OR: [Type1Where!]
              field1: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field1_CONTAINS: String
              field1_ENDS_WITH: String
              field1_EQ: String
              field1_IN: [String!]
              field1_STARTS_WITH: String
              interface1Aggregate: Type1Interface1AggregateInput
              \\"\\"\\"
              Return Type1s where all of the related Type1Interface1Connections match this filter
              \\"\\"\\"
              interface1Connection_ALL: Type1Interface1ConnectionWhere
              \\"\\"\\"
              Return Type1s where none of the related Type1Interface1Connections match this filter
              \\"\\"\\"
              interface1Connection_NONE: Type1Interface1ConnectionWhere
              \\"\\"\\"
              Return Type1s where one of the related Type1Interface1Connections match this filter
              \\"\\"\\"
              interface1Connection_SINGLE: Type1Interface1ConnectionWhere
              \\"\\"\\"
              Return Type1s where some of the related Type1Interface1Connections match this filter
              \\"\\"\\"
              interface1Connection_SOME: Type1Interface1ConnectionWhere
              \\"\\"\\"Return Type1s where all of the related Interface1s match this filter\\"\\"\\"
              interface1_ALL: Interface1Where
              \\"\\"\\"Return Type1s where none of the related Interface1s match this filter\\"\\"\\"
              interface1_NONE: Interface1Where
              \\"\\"\\"Return Type1s where one of the related Interface1s match this filter\\"\\"\\"
              interface1_SINGLE: Interface1Where
              \\"\\"\\"Return Type1s where some of the related Interface1s match this filter\\"\\"\\"
              interface1_SOME: Interface1Where
            }

            type Type1sConnection {
              edges: [Type1Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Type2Interface1 implements Interface1 {
              field1: String!
              interface2(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: Interface2Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Interface2Sort!], where: Interface2Where): [Interface2!]!
              interface2Aggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: Interface2Where): Type2Interface1Interface2Interface2AggregationSelection
              interface2Connection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [Interface1Interface2ConnectionSort!], where: Interface1Interface2ConnectionWhere): Interface1Interface2Connection!
            }

            type Type2Interface1AggregateSelection {
              count: Int!
              field1: StringAggregateSelection!
            }

            input Type2Interface1CreateInput {
              field1: String!
              interface2: Type2Interface1Interface2FieldInput
            }

            input Type2Interface1DeleteInput {
              interface2: [Type2Interface1Interface2DeleteFieldInput!]
            }

            type Type2Interface1Edge {
              cursor: String!
              node: Type2Interface1!
            }

            input Type2Interface1Interface2AggregateInput {
              AND: [Type2Interface1Interface2AggregateInput!]
              NOT: Type2Interface1Interface2AggregateInput
              OR: [Type2Interface1Interface2AggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: PropsAggregationWhereInput
              node: Type2Interface1Interface2NodeAggregationWhereInput
            }

            input Type2Interface1Interface2ConnectFieldInput {
              edge: PropsCreateInput!
              where: Interface2ConnectWhere
            }

            input Type2Interface1Interface2CreateFieldInput {
              edge: PropsCreateInput!
              node: Interface2CreateInput!
            }

            input Type2Interface1Interface2DeleteFieldInput {
              where: Interface1Interface2ConnectionWhere
            }

            input Type2Interface1Interface2DisconnectFieldInput {
              where: Interface1Interface2ConnectionWhere
            }

            input Type2Interface1Interface2FieldInput {
              connect: [Type2Interface1Interface2ConnectFieldInput!]
              create: [Type2Interface1Interface2CreateFieldInput!]
            }

            type Type2Interface1Interface2Interface2AggregationSelection {
              count: Int!
              edge: Type2Interface1Interface2Interface2EdgeAggregateSelection
              node: Type2Interface1Interface2Interface2NodeAggregateSelection
            }

            type Type2Interface1Interface2Interface2EdgeAggregateSelection {
              propsField: IntAggregateSelection!
            }

            type Type2Interface1Interface2Interface2NodeAggregateSelection {
              field2: StringAggregateSelection!
            }

            input Type2Interface1Interface2NodeAggregationWhereInput {
              AND: [Type2Interface1Interface2NodeAggregationWhereInput!]
              NOT: Type2Interface1Interface2NodeAggregationWhereInput
              OR: [Type2Interface1Interface2NodeAggregationWhereInput!]
              field2_AVERAGE_LENGTH_EQUAL: Float
              field2_AVERAGE_LENGTH_GT: Float
              field2_AVERAGE_LENGTH_GTE: Float
              field2_AVERAGE_LENGTH_LT: Float
              field2_AVERAGE_LENGTH_LTE: Float
              field2_LONGEST_LENGTH_EQUAL: Int
              field2_LONGEST_LENGTH_GT: Int
              field2_LONGEST_LENGTH_GTE: Int
              field2_LONGEST_LENGTH_LT: Int
              field2_LONGEST_LENGTH_LTE: Int
              field2_SHORTEST_LENGTH_EQUAL: Int
              field2_SHORTEST_LENGTH_GT: Int
              field2_SHORTEST_LENGTH_GTE: Int
              field2_SHORTEST_LENGTH_LT: Int
              field2_SHORTEST_LENGTH_LTE: Int
            }

            input Type2Interface1Interface2UpdateConnectionInput {
              edge: PropsUpdateInput
              node: Interface2UpdateInput
            }

            input Type2Interface1Interface2UpdateFieldInput {
              connect: [Type2Interface1Interface2ConnectFieldInput!]
              create: [Type2Interface1Interface2CreateFieldInput!]
              delete: [Type2Interface1Interface2DeleteFieldInput!]
              disconnect: [Type2Interface1Interface2DisconnectFieldInput!]
              update: Type2Interface1Interface2UpdateConnectionInput
              where: Interface1Interface2ConnectionWhere
            }

            input Type2Interface1Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Type2Interface1Sort objects to sort Type2Interface1s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Type2Interface1Sort!]
            }

            \\"\\"\\"
            Fields to sort Type2Interface1s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Type2Interface1Sort object.
            \\"\\"\\"
            input Type2Interface1Sort {
              field1: SortDirection
            }

            input Type2Interface1UpdateInput {
              field1: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field1_SET: String
              interface2: [Type2Interface1Interface2UpdateFieldInput!]
            }

            input Type2Interface1Where {
              AND: [Type2Interface1Where!]
              NOT: Type2Interface1Where
              OR: [Type2Interface1Where!]
              field1: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field1_CONTAINS: String
              field1_ENDS_WITH: String
              field1_EQ: String
              field1_IN: [String!]
              field1_STARTS_WITH: String
              interface2Aggregate: Type2Interface1Interface2AggregateInput
              \\"\\"\\"
              Return Type2Interface1s where all of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_ALL: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type2Interface1s where none of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_NONE: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type2Interface1s where one of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_SINGLE: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type2Interface1s where some of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_SOME: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type2Interface1s where all of the related Interface2s match this filter
              \\"\\"\\"
              interface2_ALL: Interface2Where
              \\"\\"\\"
              Return Type2Interface1s where none of the related Interface2s match this filter
              \\"\\"\\"
              interface2_NONE: Interface2Where
              \\"\\"\\"
              Return Type2Interface1s where one of the related Interface2s match this filter
              \\"\\"\\"
              interface2_SINGLE: Interface2Where
              \\"\\"\\"
              Return Type2Interface1s where some of the related Interface2s match this filter
              \\"\\"\\"
              interface2_SOME: Interface2Where
            }

            type Type2Interface1sConnection {
              edges: [Type2Interface1Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Type2Interface2 implements Interface2 {
              field2: String!
            }

            type Type2Interface2AggregateSelection {
              count: Int!
              field2: StringAggregateSelection!
            }

            input Type2Interface2CreateInput {
              field2: String!
            }

            type Type2Interface2Edge {
              cursor: String!
              node: Type2Interface2!
            }

            input Type2Interface2Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Type2Interface2Sort objects to sort Type2Interface2s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Type2Interface2Sort!]
            }

            \\"\\"\\"
            Fields to sort Type2Interface2s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Type2Interface2Sort object.
            \\"\\"\\"
            input Type2Interface2Sort {
              field2: SortDirection
            }

            input Type2Interface2UpdateInput {
              field2: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field2_SET: String
            }

            input Type2Interface2Where {
              AND: [Type2Interface2Where!]
              NOT: Type2Interface2Where
              OR: [Type2Interface2Where!]
              field2: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field2_CONTAINS: String
              field2_ENDS_WITH: String
              field2_EQ: String
              field2_IN: [String!]
              field2_STARTS_WITH: String
            }

            type Type2Interface2sConnection {
              edges: [Type2Interface2Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
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

            type UpdateType1Interface1sMutationResponse {
              info: UpdateInfo!
              type1Interface1s: [Type1Interface1!]!
            }

            type UpdateType1Interface2sMutationResponse {
              info: UpdateInfo!
              type1Interface2s: [Type1Interface2!]!
            }

            type UpdateType1sMutationResponse {
              info: UpdateInfo!
              type1s: [Type1!]!
            }

            type UpdateType2Interface1sMutationResponse {
              info: UpdateInfo!
              type2Interface1s: [Type2Interface1!]!
            }

            type UpdateType2Interface2sMutationResponse {
              info: UpdateInfo!
              type2Interface2s: [Type2Interface2!]!
            }"
        `);

        // expect(() => {
        //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
        //     const neoSchema = new Neo4jGraphQL({ typeDefs });
        // }).toThrowError("Nested interface relationship fields are not supported: Interface1.interface2");
    });

    test("Interface Relationships - nested interface relationships - different relationship implementations", async () => {
        const typeDefs = gql`
            interface Interface1 {
                field1: String!
                interface2: [Interface2!]! @declareRelationship
            }

            interface Interface2 {
                field2: String
            }

            type Type1Interface1 implements Interface1 @node {
                field1: String!
                interface2: [Interface2!]!
                    @relationship(type: "INTERFACE_TWO", direction: OUT, properties: "Type1Props")
            }

            type Type2Interface1 implements Interface1 @node {
                field1: String!
                interface2: [Interface2!]!
                    @relationship(type: "INTERFACE_TWO", direction: OUT, properties: "Type2Props")
            }

            type Type1Interface2 implements Interface2 @node {
                field2: String!
            }

            type Type2Interface2 implements Interface2 @node {
                field2: String!
            }

            type Type1 @node {
                field1: String!
                interface1: [Interface1!]! @relationship(type: "INTERFACE_ONE", direction: OUT)
            }

            type Type1Props @relationshipProperties {
                type1Field: Int!
            }

            type Type2Props @relationshipProperties {
                type2Field: Int!
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

            type CreateType1Interface1sMutationResponse {
              info: CreateInfo!
              type1Interface1s: [Type1Interface1!]!
            }

            type CreateType1Interface2sMutationResponse {
              info: CreateInfo!
              type1Interface2s: [Type1Interface2!]!
            }

            type CreateType1sMutationResponse {
              info: CreateInfo!
              type1s: [Type1!]!
            }

            type CreateType2Interface1sMutationResponse {
              info: CreateInfo!
              type2Interface1s: [Type2Interface1!]!
            }

            type CreateType2Interface2sMutationResponse {
              info: CreateInfo!
              type2Interface2s: [Type2Interface2!]!
            }

            \\"\\"\\"
            Information about the number of nodes and relationships deleted during a delete mutation
            \\"\\"\\"
            type DeleteInfo {
              nodesDeleted: Int!
              relationshipsDeleted: Int!
            }

            type IntAggregateSelection {
              average: Float
              max: Int
              min: Int
              sum: Int
            }

            interface Interface1 {
              field1: String!
              interface2(limit: Int, offset: Int, options: Interface2Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Interface2Sort!], where: Interface2Where): [Interface2!]!
              interface2Connection(after: String, first: Int, sort: [Interface1Interface2ConnectionSort!], where: Interface1Interface2ConnectionWhere): Interface1Interface2Connection!
            }

            type Interface1AggregateSelection {
              count: Int!
              field1: StringAggregateSelection!
            }

            input Interface1ConnectInput {
              interface2: [Interface1Interface2ConnectFieldInput!]
            }

            input Interface1ConnectWhere {
              node: Interface1Where!
            }

            input Interface1CreateInput {
              Type1Interface1: Type1Interface1CreateInput
              Type2Interface1: Type2Interface1CreateInput
            }

            input Interface1DeleteInput {
              interface2: [Interface1Interface2DeleteFieldInput!]
            }

            input Interface1DisconnectInput {
              interface2: [Interface1Interface2DisconnectFieldInput!]
            }

            type Interface1Edge {
              cursor: String!
              node: Interface1!
            }

            enum Interface1Implementation {
              Type1Interface1
              Type2Interface1
            }

            input Interface1Interface2AggregateInput {
              AND: [Interface1Interface2AggregateInput!]
              NOT: Interface1Interface2AggregateInput
              OR: [Interface1Interface2AggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: Interface1Interface2EdgeAggregationWhereInput
              node: Interface1Interface2NodeAggregationWhereInput
            }

            input Interface1Interface2ConnectFieldInput {
              edge: Interface1Interface2EdgeCreateInput!
              where: Interface2ConnectWhere
            }

            type Interface1Interface2Connection {
              edges: [Interface1Interface2Relationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input Interface1Interface2ConnectionSort {
              edge: Interface1Interface2EdgeSort
              node: Interface2Sort
            }

            input Interface1Interface2ConnectionWhere {
              AND: [Interface1Interface2ConnectionWhere!]
              NOT: Interface1Interface2ConnectionWhere
              OR: [Interface1Interface2ConnectionWhere!]
              edge: Interface1Interface2EdgeWhere
              node: Interface2Where
            }

            input Interface1Interface2CreateFieldInput {
              edge: Interface1Interface2EdgeCreateInput!
              node: Interface2CreateInput!
            }

            input Interface1Interface2DeleteFieldInput {
              where: Interface1Interface2ConnectionWhere
            }

            input Interface1Interface2DisconnectFieldInput {
              where: Interface1Interface2ConnectionWhere
            }

            input Interface1Interface2EdgeAggregationWhereInput {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Type1Interface1
              \\"\\"\\"
              Type1Props: Type1PropsAggregationWhereInput
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Type2Interface1
              \\"\\"\\"
              Type2Props: Type2PropsAggregationWhereInput
            }

            input Interface1Interface2EdgeCreateInput {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Type1Interface1
              \\"\\"\\"
              Type1Props: Type1PropsCreateInput!
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Type2Interface1
              \\"\\"\\"
              Type2Props: Type2PropsCreateInput!
            }

            input Interface1Interface2EdgeSort {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Type1Interface1
              \\"\\"\\"
              Type1Props: Type1PropsSort
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Type2Interface1
              \\"\\"\\"
              Type2Props: Type2PropsSort
            }

            input Interface1Interface2EdgeUpdateInput {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Type1Interface1
              \\"\\"\\"
              Type1Props: Type1PropsUpdateInput
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Type2Interface1
              \\"\\"\\"
              Type2Props: Type2PropsUpdateInput
            }

            input Interface1Interface2EdgeWhere {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Type1Interface1
              \\"\\"\\"
              Type1Props: Type1PropsWhere
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Type2Interface1
              \\"\\"\\"
              Type2Props: Type2PropsWhere
            }

            input Interface1Interface2NodeAggregationWhereInput {
              AND: [Interface1Interface2NodeAggregationWhereInput!]
              NOT: Interface1Interface2NodeAggregationWhereInput
              OR: [Interface1Interface2NodeAggregationWhereInput!]
              field2_AVERAGE_LENGTH_EQUAL: Float
              field2_AVERAGE_LENGTH_GT: Float
              field2_AVERAGE_LENGTH_GTE: Float
              field2_AVERAGE_LENGTH_LT: Float
              field2_AVERAGE_LENGTH_LTE: Float
              field2_LONGEST_LENGTH_EQUAL: Int
              field2_LONGEST_LENGTH_GT: Int
              field2_LONGEST_LENGTH_GTE: Int
              field2_LONGEST_LENGTH_LT: Int
              field2_LONGEST_LENGTH_LTE: Int
              field2_SHORTEST_LENGTH_EQUAL: Int
              field2_SHORTEST_LENGTH_GT: Int
              field2_SHORTEST_LENGTH_GTE: Int
              field2_SHORTEST_LENGTH_LT: Int
              field2_SHORTEST_LENGTH_LTE: Int
            }

            type Interface1Interface2Relationship {
              cursor: String!
              node: Interface2!
              properties: Interface1Interface2RelationshipProperties!
            }

            union Interface1Interface2RelationshipProperties = Type1Props | Type2Props

            input Interface1Interface2UpdateConnectionInput {
              edge: Interface1Interface2EdgeUpdateInput
              node: Interface2UpdateInput
            }

            input Interface1Interface2UpdateFieldInput {
              connect: [Interface1Interface2ConnectFieldInput!]
              create: [Interface1Interface2CreateFieldInput!]
              delete: [Interface1Interface2DeleteFieldInput!]
              disconnect: [Interface1Interface2DisconnectFieldInput!]
              update: Interface1Interface2UpdateConnectionInput
              where: Interface1Interface2ConnectionWhere
            }

            input Interface1Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Interface1Sort objects to sort Interface1s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Interface1Sort!]
            }

            \\"\\"\\"
            Fields to sort Interface1s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Interface1Sort object.
            \\"\\"\\"
            input Interface1Sort {
              field1: SortDirection
            }

            input Interface1UpdateInput {
              field1: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field1_SET: String
              interface2: [Interface1Interface2UpdateFieldInput!]
            }

            input Interface1Where {
              AND: [Interface1Where!]
              NOT: Interface1Where
              OR: [Interface1Where!]
              field1: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field1_CONTAINS: String
              field1_ENDS_WITH: String
              field1_EQ: String
              field1_IN: [String!]
              field1_STARTS_WITH: String
              interface2Aggregate: Interface1Interface2AggregateInput
              \\"\\"\\"
              Return Interface1s where all of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_ALL: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Interface1s where none of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_NONE: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Interface1s where one of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_SINGLE: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Interface1s where some of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_SOME: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Interface1s where all of the related Interface2s match this filter
              \\"\\"\\"
              interface2_ALL: Interface2Where
              \\"\\"\\"
              Return Interface1s where none of the related Interface2s match this filter
              \\"\\"\\"
              interface2_NONE: Interface2Where
              \\"\\"\\"
              Return Interface1s where one of the related Interface2s match this filter
              \\"\\"\\"
              interface2_SINGLE: Interface2Where
              \\"\\"\\"
              Return Interface1s where some of the related Interface2s match this filter
              \\"\\"\\"
              interface2_SOME: Interface2Where
              typename: [Interface1Implementation!]
              typename_IN: [Interface1Implementation!] @deprecated(reason: \\"The typename_IN filter is deprecated, please use the typename filter instead\\")
            }

            type Interface1sConnection {
              edges: [Interface1Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            interface Interface2 {
              field2: String
            }

            type Interface2AggregateSelection {
              count: Int!
              field2: StringAggregateSelection!
            }

            input Interface2ConnectWhere {
              node: Interface2Where!
            }

            input Interface2CreateInput {
              Type1Interface2: Type1Interface2CreateInput
              Type2Interface2: Type2Interface2CreateInput
            }

            type Interface2Edge {
              cursor: String!
              node: Interface2!
            }

            enum Interface2Implementation {
              Type1Interface2
              Type2Interface2
            }

            input Interface2Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Interface2Sort objects to sort Interface2s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Interface2Sort!]
            }

            \\"\\"\\"
            Fields to sort Interface2s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Interface2Sort object.
            \\"\\"\\"
            input Interface2Sort {
              field2: SortDirection
            }

            input Interface2UpdateInput {
              field2: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field2_SET: String
            }

            input Interface2Where {
              AND: [Interface2Where!]
              NOT: Interface2Where
              OR: [Interface2Where!]
              field2: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field2_CONTAINS: String
              field2_ENDS_WITH: String
              field2_EQ: String
              field2_IN: [String]
              field2_STARTS_WITH: String
              typename: [Interface2Implementation!]
              typename_IN: [Interface2Implementation!] @deprecated(reason: \\"The typename_IN filter is deprecated, please use the typename filter instead\\")
            }

            type Interface2sConnection {
              edges: [Interface2Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Mutation {
              createType1Interface1s(input: [Type1Interface1CreateInput!]!): CreateType1Interface1sMutationResponse!
              createType1Interface2s(input: [Type1Interface2CreateInput!]!): CreateType1Interface2sMutationResponse!
              createType1s(input: [Type1CreateInput!]!): CreateType1sMutationResponse!
              createType2Interface1s(input: [Type2Interface1CreateInput!]!): CreateType2Interface1sMutationResponse!
              createType2Interface2s(input: [Type2Interface2CreateInput!]!): CreateType2Interface2sMutationResponse!
              deleteType1Interface1s(delete: Type1Interface1DeleteInput, where: Type1Interface1Where): DeleteInfo!
              deleteType1Interface2s(where: Type1Interface2Where): DeleteInfo!
              deleteType1s(delete: Type1DeleteInput, where: Type1Where): DeleteInfo!
              deleteType2Interface1s(delete: Type2Interface1DeleteInput, where: Type2Interface1Where): DeleteInfo!
              deleteType2Interface2s(where: Type2Interface2Where): DeleteInfo!
              updateType1Interface1s(update: Type1Interface1UpdateInput, where: Type1Interface1Where): UpdateType1Interface1sMutationResponse!
              updateType1Interface2s(update: Type1Interface2UpdateInput, where: Type1Interface2Where): UpdateType1Interface2sMutationResponse!
              updateType1s(update: Type1UpdateInput, where: Type1Where): UpdateType1sMutationResponse!
              updateType2Interface1s(update: Type2Interface1UpdateInput, where: Type2Interface1Where): UpdateType2Interface1sMutationResponse!
              updateType2Interface2s(update: Type2Interface2UpdateInput, where: Type2Interface2Where): UpdateType2Interface2sMutationResponse!
            }

            \\"\\"\\"Pagination information (Relay)\\"\\"\\"
            type PageInfo {
              endCursor: String
              hasNextPage: Boolean!
              hasPreviousPage: Boolean!
              startCursor: String
            }

            type Query {
              interface1s(limit: Int, offset: Int, options: Interface1Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Interface1Sort!], where: Interface1Where): [Interface1!]!
              interface1sAggregate(where: Interface1Where): Interface1AggregateSelection!
              interface1sConnection(after: String, first: Int, sort: [Interface1Sort!], where: Interface1Where): Interface1sConnection!
              interface2s(limit: Int, offset: Int, options: Interface2Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Interface2Sort!], where: Interface2Where): [Interface2!]!
              interface2sAggregate(where: Interface2Where): Interface2AggregateSelection!
              interface2sConnection(after: String, first: Int, sort: [Interface2Sort!], where: Interface2Where): Interface2sConnection!
              type1Interface1s(limit: Int, offset: Int, options: Type1Interface1Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Type1Interface1Sort!], where: Type1Interface1Where): [Type1Interface1!]!
              type1Interface1sAggregate(where: Type1Interface1Where): Type1Interface1AggregateSelection!
              type1Interface1sConnection(after: String, first: Int, sort: [Type1Interface1Sort!], where: Type1Interface1Where): Type1Interface1sConnection!
              type1Interface2s(limit: Int, offset: Int, options: Type1Interface2Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Type1Interface2Sort!], where: Type1Interface2Where): [Type1Interface2!]!
              type1Interface2sAggregate(where: Type1Interface2Where): Type1Interface2AggregateSelection!
              type1Interface2sConnection(after: String, first: Int, sort: [Type1Interface2Sort!], where: Type1Interface2Where): Type1Interface2sConnection!
              type1s(limit: Int, offset: Int, options: Type1Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Type1Sort!], where: Type1Where): [Type1!]!
              type1sAggregate(where: Type1Where): Type1AggregateSelection!
              type1sConnection(after: String, first: Int, sort: [Type1Sort!], where: Type1Where): Type1sConnection!
              type2Interface1s(limit: Int, offset: Int, options: Type2Interface1Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Type2Interface1Sort!], where: Type2Interface1Where): [Type2Interface1!]!
              type2Interface1sAggregate(where: Type2Interface1Where): Type2Interface1AggregateSelection!
              type2Interface1sConnection(after: String, first: Int, sort: [Type2Interface1Sort!], where: Type2Interface1Where): Type2Interface1sConnection!
              type2Interface2s(limit: Int, offset: Int, options: Type2Interface2Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Type2Interface2Sort!], where: Type2Interface2Where): [Type2Interface2!]!
              type2Interface2sAggregate(where: Type2Interface2Where): Type2Interface2AggregateSelection!
              type2Interface2sConnection(after: String, first: Int, sort: [Type2Interface2Sort!], where: Type2Interface2Where): Type2Interface2sConnection!
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

            type Type1 {
              field1: String!
              interface1(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: Interface1Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Interface1Sort!], where: Interface1Where): [Interface1!]!
              interface1Aggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: Interface1Where): Type1Interface1Interface1AggregationSelection
              interface1Connection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [Type1Interface1ConnectionSort!], where: Type1Interface1ConnectionWhere): Type1Interface1Connection!
            }

            type Type1AggregateSelection {
              count: Int!
              field1: StringAggregateSelection!
            }

            input Type1CreateInput {
              field1: String!
              interface1: Type1Interface1FieldInput
            }

            input Type1DeleteInput {
              interface1: [Type1Interface1DeleteFieldInput!]
            }

            type Type1Edge {
              cursor: String!
              node: Type1!
            }

            type Type1Interface1 implements Interface1 {
              field1: String!
              interface2(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: Interface2Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Interface2Sort!], where: Interface2Where): [Interface2!]!
              interface2Aggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: Interface2Where): Type1Interface1Interface2Interface2AggregationSelection
              interface2Connection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [Interface1Interface2ConnectionSort!], where: Interface1Interface2ConnectionWhere): Interface1Interface2Connection!
            }

            input Type1Interface1AggregateInput {
              AND: [Type1Interface1AggregateInput!]
              NOT: Type1Interface1AggregateInput
              OR: [Type1Interface1AggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              node: Type1Interface1NodeAggregationWhereInput
            }

            type Type1Interface1AggregateSelection {
              count: Int!
              field1: StringAggregateSelection!
            }

            input Type1Interface1ConnectFieldInput {
              connect: Interface1ConnectInput
              where: Interface1ConnectWhere
            }

            type Type1Interface1Connection {
              edges: [Type1Interface1Relationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input Type1Interface1ConnectionSort {
              node: Interface1Sort
            }

            input Type1Interface1ConnectionWhere {
              AND: [Type1Interface1ConnectionWhere!]
              NOT: Type1Interface1ConnectionWhere
              OR: [Type1Interface1ConnectionWhere!]
              node: Interface1Where
            }

            input Type1Interface1CreateFieldInput {
              node: Interface1CreateInput!
            }

            input Type1Interface1CreateInput {
              field1: String!
              interface2: Type1Interface1Interface2FieldInput
            }

            input Type1Interface1DeleteFieldInput {
              delete: Interface1DeleteInput
              where: Type1Interface1ConnectionWhere
            }

            input Type1Interface1DeleteInput {
              interface2: [Type1Interface1Interface2DeleteFieldInput!]
            }

            input Type1Interface1DisconnectFieldInput {
              disconnect: Interface1DisconnectInput
              where: Type1Interface1ConnectionWhere
            }

            type Type1Interface1Edge {
              cursor: String!
              node: Type1Interface1!
            }

            input Type1Interface1FieldInput {
              connect: [Type1Interface1ConnectFieldInput!]
              create: [Type1Interface1CreateFieldInput!]
            }

            type Type1Interface1Interface1AggregationSelection {
              count: Int!
              node: Type1Interface1Interface1NodeAggregateSelection
            }

            type Type1Interface1Interface1NodeAggregateSelection {
              field1: StringAggregateSelection!
            }

            input Type1Interface1Interface2AggregateInput {
              AND: [Type1Interface1Interface2AggregateInput!]
              NOT: Type1Interface1Interface2AggregateInput
              OR: [Type1Interface1Interface2AggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: Type1PropsAggregationWhereInput
              node: Type1Interface1Interface2NodeAggregationWhereInput
            }

            input Type1Interface1Interface2ConnectFieldInput {
              edge: Type1PropsCreateInput!
              where: Interface2ConnectWhere
            }

            input Type1Interface1Interface2CreateFieldInput {
              edge: Type1PropsCreateInput!
              node: Interface2CreateInput!
            }

            input Type1Interface1Interface2DeleteFieldInput {
              where: Interface1Interface2ConnectionWhere
            }

            input Type1Interface1Interface2DisconnectFieldInput {
              where: Interface1Interface2ConnectionWhere
            }

            input Type1Interface1Interface2FieldInput {
              connect: [Type1Interface1Interface2ConnectFieldInput!]
              create: [Type1Interface1Interface2CreateFieldInput!]
            }

            type Type1Interface1Interface2Interface2AggregationSelection {
              count: Int!
              edge: Type1Interface1Interface2Interface2EdgeAggregateSelection
              node: Type1Interface1Interface2Interface2NodeAggregateSelection
            }

            type Type1Interface1Interface2Interface2EdgeAggregateSelection {
              type1Field: IntAggregateSelection!
            }

            type Type1Interface1Interface2Interface2NodeAggregateSelection {
              field2: StringAggregateSelection!
            }

            input Type1Interface1Interface2NodeAggregationWhereInput {
              AND: [Type1Interface1Interface2NodeAggregationWhereInput!]
              NOT: Type1Interface1Interface2NodeAggregationWhereInput
              OR: [Type1Interface1Interface2NodeAggregationWhereInput!]
              field2_AVERAGE_LENGTH_EQUAL: Float
              field2_AVERAGE_LENGTH_GT: Float
              field2_AVERAGE_LENGTH_GTE: Float
              field2_AVERAGE_LENGTH_LT: Float
              field2_AVERAGE_LENGTH_LTE: Float
              field2_LONGEST_LENGTH_EQUAL: Int
              field2_LONGEST_LENGTH_GT: Int
              field2_LONGEST_LENGTH_GTE: Int
              field2_LONGEST_LENGTH_LT: Int
              field2_LONGEST_LENGTH_LTE: Int
              field2_SHORTEST_LENGTH_EQUAL: Int
              field2_SHORTEST_LENGTH_GT: Int
              field2_SHORTEST_LENGTH_GTE: Int
              field2_SHORTEST_LENGTH_LT: Int
              field2_SHORTEST_LENGTH_LTE: Int
            }

            input Type1Interface1Interface2UpdateConnectionInput {
              edge: Type1PropsUpdateInput
              node: Interface2UpdateInput
            }

            input Type1Interface1Interface2UpdateFieldInput {
              connect: [Type1Interface1Interface2ConnectFieldInput!]
              create: [Type1Interface1Interface2CreateFieldInput!]
              delete: [Type1Interface1Interface2DeleteFieldInput!]
              disconnect: [Type1Interface1Interface2DisconnectFieldInput!]
              update: Type1Interface1Interface2UpdateConnectionInput
              where: Interface1Interface2ConnectionWhere
            }

            input Type1Interface1NodeAggregationWhereInput {
              AND: [Type1Interface1NodeAggregationWhereInput!]
              NOT: Type1Interface1NodeAggregationWhereInput
              OR: [Type1Interface1NodeAggregationWhereInput!]
              field1_AVERAGE_LENGTH_EQUAL: Float
              field1_AVERAGE_LENGTH_GT: Float
              field1_AVERAGE_LENGTH_GTE: Float
              field1_AVERAGE_LENGTH_LT: Float
              field1_AVERAGE_LENGTH_LTE: Float
              field1_LONGEST_LENGTH_EQUAL: Int
              field1_LONGEST_LENGTH_GT: Int
              field1_LONGEST_LENGTH_GTE: Int
              field1_LONGEST_LENGTH_LT: Int
              field1_LONGEST_LENGTH_LTE: Int
              field1_SHORTEST_LENGTH_EQUAL: Int
              field1_SHORTEST_LENGTH_GT: Int
              field1_SHORTEST_LENGTH_GTE: Int
              field1_SHORTEST_LENGTH_LT: Int
              field1_SHORTEST_LENGTH_LTE: Int
            }

            input Type1Interface1Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Type1Interface1Sort objects to sort Type1Interface1s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Type1Interface1Sort!]
            }

            type Type1Interface1Relationship {
              cursor: String!
              node: Interface1!
            }

            \\"\\"\\"
            Fields to sort Type1Interface1s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Type1Interface1Sort object.
            \\"\\"\\"
            input Type1Interface1Sort {
              field1: SortDirection
            }

            input Type1Interface1UpdateConnectionInput {
              node: Interface1UpdateInput
            }

            input Type1Interface1UpdateFieldInput {
              connect: [Type1Interface1ConnectFieldInput!]
              create: [Type1Interface1CreateFieldInput!]
              delete: [Type1Interface1DeleteFieldInput!]
              disconnect: [Type1Interface1DisconnectFieldInput!]
              update: Type1Interface1UpdateConnectionInput
              where: Type1Interface1ConnectionWhere
            }

            input Type1Interface1UpdateInput {
              field1: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field1_SET: String
              interface2: [Type1Interface1Interface2UpdateFieldInput!]
            }

            input Type1Interface1Where {
              AND: [Type1Interface1Where!]
              NOT: Type1Interface1Where
              OR: [Type1Interface1Where!]
              field1: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field1_CONTAINS: String
              field1_ENDS_WITH: String
              field1_EQ: String
              field1_IN: [String!]
              field1_STARTS_WITH: String
              interface2Aggregate: Type1Interface1Interface2AggregateInput
              \\"\\"\\"
              Return Type1Interface1s where all of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_ALL: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type1Interface1s where none of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_NONE: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type1Interface1s where one of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_SINGLE: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type1Interface1s where some of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_SOME: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type1Interface1s where all of the related Interface2s match this filter
              \\"\\"\\"
              interface2_ALL: Interface2Where
              \\"\\"\\"
              Return Type1Interface1s where none of the related Interface2s match this filter
              \\"\\"\\"
              interface2_NONE: Interface2Where
              \\"\\"\\"
              Return Type1Interface1s where one of the related Interface2s match this filter
              \\"\\"\\"
              interface2_SINGLE: Interface2Where
              \\"\\"\\"
              Return Type1Interface1s where some of the related Interface2s match this filter
              \\"\\"\\"
              interface2_SOME: Interface2Where
            }

            type Type1Interface1sConnection {
              edges: [Type1Interface1Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Type1Interface2 implements Interface2 {
              field2: String!
            }

            type Type1Interface2AggregateSelection {
              count: Int!
              field2: StringAggregateSelection!
            }

            input Type1Interface2CreateInput {
              field2: String!
            }

            type Type1Interface2Edge {
              cursor: String!
              node: Type1Interface2!
            }

            input Type1Interface2Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Type1Interface2Sort objects to sort Type1Interface2s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Type1Interface2Sort!]
            }

            \\"\\"\\"
            Fields to sort Type1Interface2s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Type1Interface2Sort object.
            \\"\\"\\"
            input Type1Interface2Sort {
              field2: SortDirection
            }

            input Type1Interface2UpdateInput {
              field2: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field2_SET: String
            }

            input Type1Interface2Where {
              AND: [Type1Interface2Where!]
              NOT: Type1Interface2Where
              OR: [Type1Interface2Where!]
              field2: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field2_CONTAINS: String
              field2_ENDS_WITH: String
              field2_EQ: String
              field2_IN: [String!]
              field2_STARTS_WITH: String
            }

            type Type1Interface2sConnection {
              edges: [Type1Interface2Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input Type1Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Type1Sort objects to sort Type1s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Type1Sort!]
            }

            \\"\\"\\"
            The edge properties for the following fields:
            * Type1Interface1.interface2
            \\"\\"\\"
            type Type1Props {
              type1Field: Int!
            }

            input Type1PropsAggregationWhereInput {
              AND: [Type1PropsAggregationWhereInput!]
              NOT: Type1PropsAggregationWhereInput
              OR: [Type1PropsAggregationWhereInput!]
              type1Field_AVERAGE_EQUAL: Float
              type1Field_AVERAGE_GT: Float
              type1Field_AVERAGE_GTE: Float
              type1Field_AVERAGE_LT: Float
              type1Field_AVERAGE_LTE: Float
              type1Field_MAX_EQUAL: Int
              type1Field_MAX_GT: Int
              type1Field_MAX_GTE: Int
              type1Field_MAX_LT: Int
              type1Field_MAX_LTE: Int
              type1Field_MIN_EQUAL: Int
              type1Field_MIN_GT: Int
              type1Field_MIN_GTE: Int
              type1Field_MIN_LT: Int
              type1Field_MIN_LTE: Int
              type1Field_SUM_EQUAL: Int
              type1Field_SUM_GT: Int
              type1Field_SUM_GTE: Int
              type1Field_SUM_LT: Int
              type1Field_SUM_LTE: Int
            }

            input Type1PropsCreateInput {
              type1Field: Int!
            }

            input Type1PropsSort {
              type1Field: SortDirection
            }

            input Type1PropsUpdateInput {
              type1Field: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              type1Field_DECREMENT: Int
              type1Field_INCREMENT: Int
              type1Field_SET: Int
            }

            input Type1PropsWhere {
              AND: [Type1PropsWhere!]
              NOT: Type1PropsWhere
              OR: [Type1PropsWhere!]
              type1Field: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              type1Field_EQ: Int
              type1Field_GT: Int
              type1Field_GTE: Int
              type1Field_IN: [Int!]
              type1Field_LT: Int
              type1Field_LTE: Int
            }

            \\"\\"\\"
            Fields to sort Type1s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Type1Sort object.
            \\"\\"\\"
            input Type1Sort {
              field1: SortDirection
            }

            input Type1UpdateInput {
              field1: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field1_SET: String
              interface1: [Type1Interface1UpdateFieldInput!]
            }

            input Type1Where {
              AND: [Type1Where!]
              NOT: Type1Where
              OR: [Type1Where!]
              field1: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field1_CONTAINS: String
              field1_ENDS_WITH: String
              field1_EQ: String
              field1_IN: [String!]
              field1_STARTS_WITH: String
              interface1Aggregate: Type1Interface1AggregateInput
              \\"\\"\\"
              Return Type1s where all of the related Type1Interface1Connections match this filter
              \\"\\"\\"
              interface1Connection_ALL: Type1Interface1ConnectionWhere
              \\"\\"\\"
              Return Type1s where none of the related Type1Interface1Connections match this filter
              \\"\\"\\"
              interface1Connection_NONE: Type1Interface1ConnectionWhere
              \\"\\"\\"
              Return Type1s where one of the related Type1Interface1Connections match this filter
              \\"\\"\\"
              interface1Connection_SINGLE: Type1Interface1ConnectionWhere
              \\"\\"\\"
              Return Type1s where some of the related Type1Interface1Connections match this filter
              \\"\\"\\"
              interface1Connection_SOME: Type1Interface1ConnectionWhere
              \\"\\"\\"Return Type1s where all of the related Interface1s match this filter\\"\\"\\"
              interface1_ALL: Interface1Where
              \\"\\"\\"Return Type1s where none of the related Interface1s match this filter\\"\\"\\"
              interface1_NONE: Interface1Where
              \\"\\"\\"Return Type1s where one of the related Interface1s match this filter\\"\\"\\"
              interface1_SINGLE: Interface1Where
              \\"\\"\\"Return Type1s where some of the related Interface1s match this filter\\"\\"\\"
              interface1_SOME: Interface1Where
            }

            type Type1sConnection {
              edges: [Type1Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Type2Interface1 implements Interface1 {
              field1: String!
              interface2(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: Interface2Options @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [Interface2Sort!], where: Interface2Where): [Interface2!]!
              interface2Aggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: Interface2Where): Type2Interface1Interface2Interface2AggregationSelection
              interface2Connection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [Interface1Interface2ConnectionSort!], where: Interface1Interface2ConnectionWhere): Interface1Interface2Connection!
            }

            type Type2Interface1AggregateSelection {
              count: Int!
              field1: StringAggregateSelection!
            }

            input Type2Interface1CreateInput {
              field1: String!
              interface2: Type2Interface1Interface2FieldInput
            }

            input Type2Interface1DeleteInput {
              interface2: [Type2Interface1Interface2DeleteFieldInput!]
            }

            type Type2Interface1Edge {
              cursor: String!
              node: Type2Interface1!
            }

            input Type2Interface1Interface2AggregateInput {
              AND: [Type2Interface1Interface2AggregateInput!]
              NOT: Type2Interface1Interface2AggregateInput
              OR: [Type2Interface1Interface2AggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: Type2PropsAggregationWhereInput
              node: Type2Interface1Interface2NodeAggregationWhereInput
            }

            input Type2Interface1Interface2ConnectFieldInput {
              edge: Type2PropsCreateInput!
              where: Interface2ConnectWhere
            }

            input Type2Interface1Interface2CreateFieldInput {
              edge: Type2PropsCreateInput!
              node: Interface2CreateInput!
            }

            input Type2Interface1Interface2DeleteFieldInput {
              where: Interface1Interface2ConnectionWhere
            }

            input Type2Interface1Interface2DisconnectFieldInput {
              where: Interface1Interface2ConnectionWhere
            }

            input Type2Interface1Interface2FieldInput {
              connect: [Type2Interface1Interface2ConnectFieldInput!]
              create: [Type2Interface1Interface2CreateFieldInput!]
            }

            type Type2Interface1Interface2Interface2AggregationSelection {
              count: Int!
              edge: Type2Interface1Interface2Interface2EdgeAggregateSelection
              node: Type2Interface1Interface2Interface2NodeAggregateSelection
            }

            type Type2Interface1Interface2Interface2EdgeAggregateSelection {
              type2Field: IntAggregateSelection!
            }

            type Type2Interface1Interface2Interface2NodeAggregateSelection {
              field2: StringAggregateSelection!
            }

            input Type2Interface1Interface2NodeAggregationWhereInput {
              AND: [Type2Interface1Interface2NodeAggregationWhereInput!]
              NOT: Type2Interface1Interface2NodeAggregationWhereInput
              OR: [Type2Interface1Interface2NodeAggregationWhereInput!]
              field2_AVERAGE_LENGTH_EQUAL: Float
              field2_AVERAGE_LENGTH_GT: Float
              field2_AVERAGE_LENGTH_GTE: Float
              field2_AVERAGE_LENGTH_LT: Float
              field2_AVERAGE_LENGTH_LTE: Float
              field2_LONGEST_LENGTH_EQUAL: Int
              field2_LONGEST_LENGTH_GT: Int
              field2_LONGEST_LENGTH_GTE: Int
              field2_LONGEST_LENGTH_LT: Int
              field2_LONGEST_LENGTH_LTE: Int
              field2_SHORTEST_LENGTH_EQUAL: Int
              field2_SHORTEST_LENGTH_GT: Int
              field2_SHORTEST_LENGTH_GTE: Int
              field2_SHORTEST_LENGTH_LT: Int
              field2_SHORTEST_LENGTH_LTE: Int
            }

            input Type2Interface1Interface2UpdateConnectionInput {
              edge: Type2PropsUpdateInput
              node: Interface2UpdateInput
            }

            input Type2Interface1Interface2UpdateFieldInput {
              connect: [Type2Interface1Interface2ConnectFieldInput!]
              create: [Type2Interface1Interface2CreateFieldInput!]
              delete: [Type2Interface1Interface2DeleteFieldInput!]
              disconnect: [Type2Interface1Interface2DisconnectFieldInput!]
              update: Type2Interface1Interface2UpdateConnectionInput
              where: Interface1Interface2ConnectionWhere
            }

            input Type2Interface1Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Type2Interface1Sort objects to sort Type2Interface1s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Type2Interface1Sort!]
            }

            \\"\\"\\"
            Fields to sort Type2Interface1s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Type2Interface1Sort object.
            \\"\\"\\"
            input Type2Interface1Sort {
              field1: SortDirection
            }

            input Type2Interface1UpdateInput {
              field1: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field1_SET: String
              interface2: [Type2Interface1Interface2UpdateFieldInput!]
            }

            input Type2Interface1Where {
              AND: [Type2Interface1Where!]
              NOT: Type2Interface1Where
              OR: [Type2Interface1Where!]
              field1: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field1_CONTAINS: String
              field1_ENDS_WITH: String
              field1_EQ: String
              field1_IN: [String!]
              field1_STARTS_WITH: String
              interface2Aggregate: Type2Interface1Interface2AggregateInput
              \\"\\"\\"
              Return Type2Interface1s where all of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_ALL: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type2Interface1s where none of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_NONE: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type2Interface1s where one of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_SINGLE: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type2Interface1s where some of the related Interface1Interface2Connections match this filter
              \\"\\"\\"
              interface2Connection_SOME: Interface1Interface2ConnectionWhere
              \\"\\"\\"
              Return Type2Interface1s where all of the related Interface2s match this filter
              \\"\\"\\"
              interface2_ALL: Interface2Where
              \\"\\"\\"
              Return Type2Interface1s where none of the related Interface2s match this filter
              \\"\\"\\"
              interface2_NONE: Interface2Where
              \\"\\"\\"
              Return Type2Interface1s where one of the related Interface2s match this filter
              \\"\\"\\"
              interface2_SINGLE: Interface2Where
              \\"\\"\\"
              Return Type2Interface1s where some of the related Interface2s match this filter
              \\"\\"\\"
              interface2_SOME: Interface2Where
            }

            type Type2Interface1sConnection {
              edges: [Type2Interface1Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Type2Interface2 implements Interface2 {
              field2: String!
            }

            type Type2Interface2AggregateSelection {
              count: Int!
              field2: StringAggregateSelection!
            }

            input Type2Interface2CreateInput {
              field2: String!
            }

            type Type2Interface2Edge {
              cursor: String!
              node: Type2Interface2!
            }

            input Type2Interface2Options {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more Type2Interface2Sort objects to sort Type2Interface2s by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [Type2Interface2Sort!]
            }

            \\"\\"\\"
            Fields to sort Type2Interface2s by. The order in which sorts are applied is not guaranteed when specifying many fields in one Type2Interface2Sort object.
            \\"\\"\\"
            input Type2Interface2Sort {
              field2: SortDirection
            }

            input Type2Interface2UpdateInput {
              field2: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              field2_SET: String
            }

            input Type2Interface2Where {
              AND: [Type2Interface2Where!]
              NOT: Type2Interface2Where
              OR: [Type2Interface2Where!]
              field2: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              field2_CONTAINS: String
              field2_ENDS_WITH: String
              field2_EQ: String
              field2_IN: [String!]
              field2_STARTS_WITH: String
            }

            type Type2Interface2sConnection {
              edges: [Type2Interface2Edge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            \\"\\"\\"
            The edge properties for the following fields:
            * Type2Interface1.interface2
            \\"\\"\\"
            type Type2Props {
              type2Field: Int!
            }

            input Type2PropsAggregationWhereInput {
              AND: [Type2PropsAggregationWhereInput!]
              NOT: Type2PropsAggregationWhereInput
              OR: [Type2PropsAggregationWhereInput!]
              type2Field_AVERAGE_EQUAL: Float
              type2Field_AVERAGE_GT: Float
              type2Field_AVERAGE_GTE: Float
              type2Field_AVERAGE_LT: Float
              type2Field_AVERAGE_LTE: Float
              type2Field_MAX_EQUAL: Int
              type2Field_MAX_GT: Int
              type2Field_MAX_GTE: Int
              type2Field_MAX_LT: Int
              type2Field_MAX_LTE: Int
              type2Field_MIN_EQUAL: Int
              type2Field_MIN_GT: Int
              type2Field_MIN_GTE: Int
              type2Field_MIN_LT: Int
              type2Field_MIN_LTE: Int
              type2Field_SUM_EQUAL: Int
              type2Field_SUM_GT: Int
              type2Field_SUM_GTE: Int
              type2Field_SUM_LT: Int
              type2Field_SUM_LTE: Int
            }

            input Type2PropsCreateInput {
              type2Field: Int!
            }

            input Type2PropsSort {
              type2Field: SortDirection
            }

            input Type2PropsUpdateInput {
              type2Field: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              type2Field_DECREMENT: Int
              type2Field_INCREMENT: Int
              type2Field_SET: Int
            }

            input Type2PropsWhere {
              AND: [Type2PropsWhere!]
              NOT: Type2PropsWhere
              OR: [Type2PropsWhere!]
              type2Field: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              type2Field_EQ: Int
              type2Field_GT: Int
              type2Field_GTE: Int
              type2Field_IN: [Int!]
              type2Field_LT: Int
              type2Field_LTE: Int
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

            type UpdateType1Interface1sMutationResponse {
              info: UpdateInfo!
              type1Interface1s: [Type1Interface1!]!
            }

            type UpdateType1Interface2sMutationResponse {
              info: UpdateInfo!
              type1Interface2s: [Type1Interface2!]!
            }

            type UpdateType1sMutationResponse {
              info: UpdateInfo!
              type1s: [Type1!]!
            }

            type UpdateType2Interface1sMutationResponse {
              info: UpdateInfo!
              type2Interface1s: [Type2Interface1!]!
            }

            type UpdateType2Interface2sMutationResponse {
              info: UpdateInfo!
              type2Interface2s: [Type2Interface2!]!
            }"
        `);

        // expect(() => {
        //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
        //     const neoSchema = new Neo4jGraphQL({ typeDefs });
        // }).toThrowError("Nested interface relationship fields are not supported: Interface1.interface2");
    });

    test("Interface Relationships - nested relationships", async () => {
        const typeDefs = gql`
            interface Content {
                id: ID
                content: String
                creator: User! @declareRelationship
            }

            type Comment implements Content @node {
                id: ID
                content: String
                creator: User! @relationship(type: "HAS_CONTENT", direction: IN)
                post: Post! @relationship(type: "HAS_COMMENT", direction: IN)
            }

            type Post implements Content @node {
                id: ID
                content: String
                creator: User! @relationship(type: "HAS_CONTENT", direction: IN)
                comments: [Comment!]! @relationship(type: "HAS_COMMENT", direction: OUT)
            }

            type User @node {
                id: ID
                name: String
                content: [Content!]! @relationship(type: "HAS_CONTENT", direction: OUT)
            }
        `;

        const neoSchema = new Neo4jGraphQL({ typeDefs });
        const printedSchema = printSchemaWithDirectives(lexicographicSortSchema(await neoSchema.getSchema()));

        expect(printedSchema).toMatchInlineSnapshot(`
            "schema {
              query: Query
              mutation: Mutation
            }

            type Comment implements Content {
              content: String
              creator(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: UserOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [UserSort!], where: UserWhere): User!
              creatorAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: UserWhere): CommentUserCreatorAggregationSelection
              creatorConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [ContentCreatorConnectionSort!], where: ContentCreatorConnectionWhere): ContentCreatorConnection!
              id: ID
              post(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: PostOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [PostSort!], where: PostWhere): Post!
              postAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: PostWhere): CommentPostPostAggregationSelection
              postConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [CommentPostConnectionSort!], where: CommentPostConnectionWhere): CommentPostConnection!
            }

            type CommentAggregateSelection {
              content: StringAggregateSelection!
              count: Int!
              id: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
            }

            input CommentConnectInput {
              creator: CommentCreatorConnectFieldInput
              post: CommentPostConnectFieldInput
            }

            input CommentConnectWhere {
              node: CommentWhere!
            }

            input CommentCreateInput {
              content: String
              creator: CommentCreatorFieldInput
              id: ID
              post: CommentPostFieldInput
            }

            input CommentCreatorAggregateInput {
              AND: [CommentCreatorAggregateInput!]
              NOT: CommentCreatorAggregateInput
              OR: [CommentCreatorAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              node: CommentCreatorNodeAggregationWhereInput
            }

            input CommentCreatorConnectFieldInput {
              connect: UserConnectInput
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: UserConnectWhere
            }

            input CommentCreatorCreateFieldInput {
              node: UserCreateInput!
            }

            input CommentCreatorFieldInput {
              connect: CommentCreatorConnectFieldInput
              create: CommentCreatorCreateFieldInput
            }

            input CommentCreatorNodeAggregationWhereInput {
              AND: [CommentCreatorNodeAggregationWhereInput!]
              NOT: CommentCreatorNodeAggregationWhereInput
              OR: [CommentCreatorNodeAggregationWhereInput!]
              id_MAX_EQUAL: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_GT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_GTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_LT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_LTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_EQUAL: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_GT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_GTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_LT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_LTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              name_AVERAGE_LENGTH_EQUAL: Float
              name_AVERAGE_LENGTH_GT: Float
              name_AVERAGE_LENGTH_GTE: Float
              name_AVERAGE_LENGTH_LT: Float
              name_AVERAGE_LENGTH_LTE: Float
              name_LONGEST_LENGTH_EQUAL: Int
              name_LONGEST_LENGTH_GT: Int
              name_LONGEST_LENGTH_GTE: Int
              name_LONGEST_LENGTH_LT: Int
              name_LONGEST_LENGTH_LTE: Int
              name_SHORTEST_LENGTH_EQUAL: Int
              name_SHORTEST_LENGTH_GT: Int
              name_SHORTEST_LENGTH_GTE: Int
              name_SHORTEST_LENGTH_LT: Int
              name_SHORTEST_LENGTH_LTE: Int
            }

            input CommentCreatorUpdateConnectionInput {
              node: UserUpdateInput
            }

            input CommentCreatorUpdateFieldInput {
              connect: CommentCreatorConnectFieldInput
              create: CommentCreatorCreateFieldInput
              delete: ContentCreatorDeleteFieldInput
              disconnect: ContentCreatorDisconnectFieldInput
              update: CommentCreatorUpdateConnectionInput
              where: ContentCreatorConnectionWhere
            }

            input CommentDeleteInput {
              creator: ContentCreatorDeleteFieldInput
              post: CommentPostDeleteFieldInput
            }

            input CommentDisconnectInput {
              creator: ContentCreatorDisconnectFieldInput
              post: CommentPostDisconnectFieldInput
            }

            type CommentEdge {
              cursor: String!
              node: Comment!
            }

            input CommentOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more CommentSort objects to sort Comments by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [CommentSort!]
            }

            input CommentPostAggregateInput {
              AND: [CommentPostAggregateInput!]
              NOT: CommentPostAggregateInput
              OR: [CommentPostAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              node: CommentPostNodeAggregationWhereInput
            }

            input CommentPostConnectFieldInput {
              connect: PostConnectInput
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: PostConnectWhere
            }

            type CommentPostConnection {
              edges: [CommentPostRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input CommentPostConnectionSort {
              node: PostSort
            }

            input CommentPostConnectionWhere {
              AND: [CommentPostConnectionWhere!]
              NOT: CommentPostConnectionWhere
              OR: [CommentPostConnectionWhere!]
              node: PostWhere
            }

            input CommentPostCreateFieldInput {
              node: PostCreateInput!
            }

            input CommentPostDeleteFieldInput {
              delete: PostDeleteInput
              where: CommentPostConnectionWhere
            }

            input CommentPostDisconnectFieldInput {
              disconnect: PostDisconnectInput
              where: CommentPostConnectionWhere
            }

            input CommentPostFieldInput {
              connect: CommentPostConnectFieldInput
              create: CommentPostCreateFieldInput
            }

            input CommentPostNodeAggregationWhereInput {
              AND: [CommentPostNodeAggregationWhereInput!]
              NOT: CommentPostNodeAggregationWhereInput
              OR: [CommentPostNodeAggregationWhereInput!]
              content_AVERAGE_LENGTH_EQUAL: Float
              content_AVERAGE_LENGTH_GT: Float
              content_AVERAGE_LENGTH_GTE: Float
              content_AVERAGE_LENGTH_LT: Float
              content_AVERAGE_LENGTH_LTE: Float
              content_LONGEST_LENGTH_EQUAL: Int
              content_LONGEST_LENGTH_GT: Int
              content_LONGEST_LENGTH_GTE: Int
              content_LONGEST_LENGTH_LT: Int
              content_LONGEST_LENGTH_LTE: Int
              content_SHORTEST_LENGTH_EQUAL: Int
              content_SHORTEST_LENGTH_GT: Int
              content_SHORTEST_LENGTH_GTE: Int
              content_SHORTEST_LENGTH_LT: Int
              content_SHORTEST_LENGTH_LTE: Int
              id_MAX_EQUAL: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_GT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_GTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_LT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_LTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_EQUAL: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_GT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_GTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_LT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_LTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
            }

            type CommentPostPostAggregationSelection {
              count: Int!
              node: CommentPostPostNodeAggregateSelection
            }

            type CommentPostPostNodeAggregateSelection {
              content: StringAggregateSelection!
              id: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
            }

            type CommentPostRelationship {
              cursor: String!
              node: Post!
            }

            input CommentPostUpdateConnectionInput {
              node: PostUpdateInput
            }

            input CommentPostUpdateFieldInput {
              connect: CommentPostConnectFieldInput
              create: CommentPostCreateFieldInput
              delete: CommentPostDeleteFieldInput
              disconnect: CommentPostDisconnectFieldInput
              update: CommentPostUpdateConnectionInput
              where: CommentPostConnectionWhere
            }

            \\"\\"\\"
            Fields to sort Comments by. The order in which sorts are applied is not guaranteed when specifying many fields in one CommentSort object.
            \\"\\"\\"
            input CommentSort {
              content: SortDirection
              id: SortDirection
            }

            input CommentUpdateInput {
              content: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              content_SET: String
              creator: CommentCreatorUpdateFieldInput
              id: ID @deprecated(reason: \\"Please use the explicit _SET field\\")
              id_SET: ID
              post: CommentPostUpdateFieldInput
            }

            type CommentUserCreatorAggregationSelection {
              count: Int!
              node: CommentUserCreatorNodeAggregateSelection
            }

            type CommentUserCreatorNodeAggregateSelection {
              id: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              name: StringAggregateSelection!
            }

            input CommentWhere {
              AND: [CommentWhere!]
              NOT: CommentWhere
              OR: [CommentWhere!]
              content: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              content_CONTAINS: String
              content_ENDS_WITH: String
              content_EQ: String
              content_IN: [String]
              content_STARTS_WITH: String
              creator: UserWhere
              creatorAggregate: CommentCreatorAggregateInput
              creatorConnection: ContentCreatorConnectionWhere
              id: ID @deprecated(reason: \\"Please use the explicit _EQ version\\")
              id_CONTAINS: ID
              id_ENDS_WITH: ID
              id_EQ: ID
              id_IN: [ID]
              id_STARTS_WITH: ID
              post: PostWhere
              postAggregate: CommentPostAggregateInput
              postConnection: CommentPostConnectionWhere
            }

            type CommentsConnection {
              edges: [CommentEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            interface Content {
              content: String
              creator(limit: Int, offset: Int, options: UserOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [UserSort!], where: UserWhere): User!
              creatorConnection(after: String, first: Int, sort: [ContentCreatorConnectionSort!], where: ContentCreatorConnectionWhere): ContentCreatorConnection!
              id: ID
            }

            type ContentAggregateSelection {
              content: StringAggregateSelection!
              count: Int!
              id: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
            }

            input ContentConnectInput {
              creator: ContentCreatorConnectFieldInput
            }

            input ContentConnectWhere {
              node: ContentWhere!
            }

            input ContentCreateInput {
              Comment: CommentCreateInput
              Post: PostCreateInput
            }

            input ContentCreatorAggregateInput {
              AND: [ContentCreatorAggregateInput!]
              NOT: ContentCreatorAggregateInput
              OR: [ContentCreatorAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              node: ContentCreatorNodeAggregationWhereInput
            }

            input ContentCreatorConnectFieldInput {
              connect: UserConnectInput
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: UserConnectWhere
            }

            type ContentCreatorConnection {
              edges: [ContentCreatorRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input ContentCreatorConnectionSort {
              node: UserSort
            }

            input ContentCreatorConnectionWhere {
              AND: [ContentCreatorConnectionWhere!]
              NOT: ContentCreatorConnectionWhere
              OR: [ContentCreatorConnectionWhere!]
              node: UserWhere
            }

            input ContentCreatorCreateFieldInput {
              node: UserCreateInput!
            }

            input ContentCreatorDeleteFieldInput {
              delete: UserDeleteInput
              where: ContentCreatorConnectionWhere
            }

            input ContentCreatorDisconnectFieldInput {
              disconnect: UserDisconnectInput
              where: ContentCreatorConnectionWhere
            }

            input ContentCreatorNodeAggregationWhereInput {
              AND: [ContentCreatorNodeAggregationWhereInput!]
              NOT: ContentCreatorNodeAggregationWhereInput
              OR: [ContentCreatorNodeAggregationWhereInput!]
              id_MAX_EQUAL: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_GT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_GTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_LT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_LTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_EQUAL: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_GT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_GTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_LT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_LTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              name_AVERAGE_LENGTH_EQUAL: Float
              name_AVERAGE_LENGTH_GT: Float
              name_AVERAGE_LENGTH_GTE: Float
              name_AVERAGE_LENGTH_LT: Float
              name_AVERAGE_LENGTH_LTE: Float
              name_LONGEST_LENGTH_EQUAL: Int
              name_LONGEST_LENGTH_GT: Int
              name_LONGEST_LENGTH_GTE: Int
              name_LONGEST_LENGTH_LT: Int
              name_LONGEST_LENGTH_LTE: Int
              name_SHORTEST_LENGTH_EQUAL: Int
              name_SHORTEST_LENGTH_GT: Int
              name_SHORTEST_LENGTH_GTE: Int
              name_SHORTEST_LENGTH_LT: Int
              name_SHORTEST_LENGTH_LTE: Int
            }

            type ContentCreatorRelationship {
              cursor: String!
              node: User!
            }

            input ContentCreatorUpdateConnectionInput {
              node: UserUpdateInput
            }

            input ContentCreatorUpdateFieldInput {
              connect: ContentCreatorConnectFieldInput
              create: ContentCreatorCreateFieldInput
              delete: ContentCreatorDeleteFieldInput
              disconnect: ContentCreatorDisconnectFieldInput
              update: ContentCreatorUpdateConnectionInput
              where: ContentCreatorConnectionWhere
            }

            input ContentDeleteInput {
              creator: ContentCreatorDeleteFieldInput
            }

            input ContentDisconnectInput {
              creator: ContentCreatorDisconnectFieldInput
            }

            type ContentEdge {
              cursor: String!
              node: Content!
            }

            enum ContentImplementation {
              Comment
              Post
            }

            input ContentOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more ContentSort objects to sort Contents by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [ContentSort!]
            }

            \\"\\"\\"
            Fields to sort Contents by. The order in which sorts are applied is not guaranteed when specifying many fields in one ContentSort object.
            \\"\\"\\"
            input ContentSort {
              content: SortDirection
              id: SortDirection
            }

            input ContentUpdateInput {
              content: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              content_SET: String
              creator: ContentCreatorUpdateFieldInput
              id: ID @deprecated(reason: \\"Please use the explicit _SET field\\")
              id_SET: ID
            }

            input ContentWhere {
              AND: [ContentWhere!]
              NOT: ContentWhere
              OR: [ContentWhere!]
              content: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              content_CONTAINS: String
              content_ENDS_WITH: String
              content_EQ: String
              content_IN: [String]
              content_STARTS_WITH: String
              creator: UserWhere
              creatorAggregate: ContentCreatorAggregateInput
              creatorConnection: ContentCreatorConnectionWhere
              id: ID @deprecated(reason: \\"Please use the explicit _EQ version\\")
              id_CONTAINS: ID
              id_ENDS_WITH: ID
              id_EQ: ID
              id_IN: [ID]
              id_STARTS_WITH: ID
              typename: [ContentImplementation!]
              typename_IN: [ContentImplementation!] @deprecated(reason: \\"The typename_IN filter is deprecated, please use the typename filter instead\\")
            }

            type ContentsConnection {
              edges: [ContentEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type CreateCommentsMutationResponse {
              comments: [Comment!]!
              info: CreateInfo!
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

            type Mutation {
              createComments(input: [CommentCreateInput!]!): CreateCommentsMutationResponse!
              createPosts(input: [PostCreateInput!]!): CreatePostsMutationResponse!
              createUsers(input: [UserCreateInput!]!): CreateUsersMutationResponse!
              deleteComments(delete: CommentDeleteInput, where: CommentWhere): DeleteInfo!
              deletePosts(delete: PostDeleteInput, where: PostWhere): DeleteInfo!
              deleteUsers(delete: UserDeleteInput, where: UserWhere): DeleteInfo!
              updateComments(update: CommentUpdateInput, where: CommentWhere): UpdateCommentsMutationResponse!
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

            type Post implements Content {
              comments(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: CommentOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [CommentSort!], where: CommentWhere): [Comment!]!
              commentsAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: CommentWhere): PostCommentCommentsAggregationSelection
              commentsConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [PostCommentsConnectionSort!], where: PostCommentsConnectionWhere): PostCommentsConnection!
              content: String
              creator(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: UserOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [UserSort!], where: UserWhere): User!
              creatorAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: UserWhere): PostUserCreatorAggregationSelection
              creatorConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [ContentCreatorConnectionSort!], where: ContentCreatorConnectionWhere): ContentCreatorConnection!
              id: ID
            }

            type PostAggregateSelection {
              content: StringAggregateSelection!
              count: Int!
              id: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
            }

            type PostCommentCommentsAggregationSelection {
              count: Int!
              node: PostCommentCommentsNodeAggregateSelection
            }

            type PostCommentCommentsNodeAggregateSelection {
              content: StringAggregateSelection!
              id: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
            }

            input PostCommentsAggregateInput {
              AND: [PostCommentsAggregateInput!]
              NOT: PostCommentsAggregateInput
              OR: [PostCommentsAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              node: PostCommentsNodeAggregationWhereInput
            }

            input PostCommentsConnectFieldInput {
              connect: [CommentConnectInput!]
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: CommentConnectWhere
            }

            type PostCommentsConnection {
              edges: [PostCommentsRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input PostCommentsConnectionSort {
              node: CommentSort
            }

            input PostCommentsConnectionWhere {
              AND: [PostCommentsConnectionWhere!]
              NOT: PostCommentsConnectionWhere
              OR: [PostCommentsConnectionWhere!]
              node: CommentWhere
            }

            input PostCommentsCreateFieldInput {
              node: CommentCreateInput!
            }

            input PostCommentsDeleteFieldInput {
              delete: CommentDeleteInput
              where: PostCommentsConnectionWhere
            }

            input PostCommentsDisconnectFieldInput {
              disconnect: CommentDisconnectInput
              where: PostCommentsConnectionWhere
            }

            input PostCommentsFieldInput {
              connect: [PostCommentsConnectFieldInput!]
              create: [PostCommentsCreateFieldInput!]
            }

            input PostCommentsNodeAggregationWhereInput {
              AND: [PostCommentsNodeAggregationWhereInput!]
              NOT: PostCommentsNodeAggregationWhereInput
              OR: [PostCommentsNodeAggregationWhereInput!]
              content_AVERAGE_LENGTH_EQUAL: Float
              content_AVERAGE_LENGTH_GT: Float
              content_AVERAGE_LENGTH_GTE: Float
              content_AVERAGE_LENGTH_LT: Float
              content_AVERAGE_LENGTH_LTE: Float
              content_LONGEST_LENGTH_EQUAL: Int
              content_LONGEST_LENGTH_GT: Int
              content_LONGEST_LENGTH_GTE: Int
              content_LONGEST_LENGTH_LT: Int
              content_LONGEST_LENGTH_LTE: Int
              content_SHORTEST_LENGTH_EQUAL: Int
              content_SHORTEST_LENGTH_GT: Int
              content_SHORTEST_LENGTH_GTE: Int
              content_SHORTEST_LENGTH_LT: Int
              content_SHORTEST_LENGTH_LTE: Int
              id_MAX_EQUAL: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_GT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_GTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_LT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_LTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_EQUAL: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_GT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_GTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_LT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_LTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
            }

            type PostCommentsRelationship {
              cursor: String!
              node: Comment!
            }

            input PostCommentsUpdateConnectionInput {
              node: CommentUpdateInput
            }

            input PostCommentsUpdateFieldInput {
              connect: [PostCommentsConnectFieldInput!]
              create: [PostCommentsCreateFieldInput!]
              delete: [PostCommentsDeleteFieldInput!]
              disconnect: [PostCommentsDisconnectFieldInput!]
              update: PostCommentsUpdateConnectionInput
              where: PostCommentsConnectionWhere
            }

            input PostConnectInput {
              comments: [PostCommentsConnectFieldInput!]
              creator: PostCreatorConnectFieldInput
            }

            input PostConnectWhere {
              node: PostWhere!
            }

            input PostCreateInput {
              comments: PostCommentsFieldInput
              content: String
              creator: PostCreatorFieldInput
              id: ID
            }

            input PostCreatorAggregateInput {
              AND: [PostCreatorAggregateInput!]
              NOT: PostCreatorAggregateInput
              OR: [PostCreatorAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              node: PostCreatorNodeAggregationWhereInput
            }

            input PostCreatorConnectFieldInput {
              connect: UserConnectInput
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: UserConnectWhere
            }

            input PostCreatorCreateFieldInput {
              node: UserCreateInput!
            }

            input PostCreatorFieldInput {
              connect: PostCreatorConnectFieldInput
              create: PostCreatorCreateFieldInput
            }

            input PostCreatorNodeAggregationWhereInput {
              AND: [PostCreatorNodeAggregationWhereInput!]
              NOT: PostCreatorNodeAggregationWhereInput
              OR: [PostCreatorNodeAggregationWhereInput!]
              id_MAX_EQUAL: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_GT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_GTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_LT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_LTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_EQUAL: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_GT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_GTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_LT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_LTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              name_AVERAGE_LENGTH_EQUAL: Float
              name_AVERAGE_LENGTH_GT: Float
              name_AVERAGE_LENGTH_GTE: Float
              name_AVERAGE_LENGTH_LT: Float
              name_AVERAGE_LENGTH_LTE: Float
              name_LONGEST_LENGTH_EQUAL: Int
              name_LONGEST_LENGTH_GT: Int
              name_LONGEST_LENGTH_GTE: Int
              name_LONGEST_LENGTH_LT: Int
              name_LONGEST_LENGTH_LTE: Int
              name_SHORTEST_LENGTH_EQUAL: Int
              name_SHORTEST_LENGTH_GT: Int
              name_SHORTEST_LENGTH_GTE: Int
              name_SHORTEST_LENGTH_LT: Int
              name_SHORTEST_LENGTH_LTE: Int
            }

            input PostCreatorUpdateConnectionInput {
              node: UserUpdateInput
            }

            input PostCreatorUpdateFieldInput {
              connect: PostCreatorConnectFieldInput
              create: PostCreatorCreateFieldInput
              delete: ContentCreatorDeleteFieldInput
              disconnect: ContentCreatorDisconnectFieldInput
              update: PostCreatorUpdateConnectionInput
              where: ContentCreatorConnectionWhere
            }

            input PostDeleteInput {
              comments: [PostCommentsDeleteFieldInput!]
              creator: ContentCreatorDeleteFieldInput
            }

            input PostDisconnectInput {
              comments: [PostCommentsDisconnectFieldInput!]
              creator: ContentCreatorDisconnectFieldInput
            }

            type PostEdge {
              cursor: String!
              node: Post!
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
              content: SortDirection
              id: SortDirection
            }

            input PostUpdateInput {
              comments: [PostCommentsUpdateFieldInput!]
              content: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              content_SET: String
              creator: PostCreatorUpdateFieldInput
              id: ID @deprecated(reason: \\"Please use the explicit _SET field\\")
              id_SET: ID
            }

            type PostUserCreatorAggregationSelection {
              count: Int!
              node: PostUserCreatorNodeAggregateSelection
            }

            type PostUserCreatorNodeAggregateSelection {
              id: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              name: StringAggregateSelection!
            }

            input PostWhere {
              AND: [PostWhere!]
              NOT: PostWhere
              OR: [PostWhere!]
              commentsAggregate: PostCommentsAggregateInput
              \\"\\"\\"
              Return Posts where all of the related PostCommentsConnections match this filter
              \\"\\"\\"
              commentsConnection_ALL: PostCommentsConnectionWhere
              \\"\\"\\"
              Return Posts where none of the related PostCommentsConnections match this filter
              \\"\\"\\"
              commentsConnection_NONE: PostCommentsConnectionWhere
              \\"\\"\\"
              Return Posts where one of the related PostCommentsConnections match this filter
              \\"\\"\\"
              commentsConnection_SINGLE: PostCommentsConnectionWhere
              \\"\\"\\"
              Return Posts where some of the related PostCommentsConnections match this filter
              \\"\\"\\"
              commentsConnection_SOME: PostCommentsConnectionWhere
              \\"\\"\\"Return Posts where all of the related Comments match this filter\\"\\"\\"
              comments_ALL: CommentWhere
              \\"\\"\\"Return Posts where none of the related Comments match this filter\\"\\"\\"
              comments_NONE: CommentWhere
              \\"\\"\\"Return Posts where one of the related Comments match this filter\\"\\"\\"
              comments_SINGLE: CommentWhere
              \\"\\"\\"Return Posts where some of the related Comments match this filter\\"\\"\\"
              comments_SOME: CommentWhere
              content: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              content_CONTAINS: String
              content_ENDS_WITH: String
              content_EQ: String
              content_IN: [String]
              content_STARTS_WITH: String
              creator: UserWhere
              creatorAggregate: PostCreatorAggregateInput
              creatorConnection: ContentCreatorConnectionWhere
              id: ID @deprecated(reason: \\"Please use the explicit _EQ version\\")
              id_CONTAINS: ID
              id_ENDS_WITH: ID
              id_EQ: ID
              id_IN: [ID]
              id_STARTS_WITH: ID
            }

            type PostsConnection {
              edges: [PostEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Query {
              comments(limit: Int, offset: Int, options: CommentOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [CommentSort!], where: CommentWhere): [Comment!]!
              commentsAggregate(where: CommentWhere): CommentAggregateSelection!
              commentsConnection(after: String, first: Int, sort: [CommentSort!], where: CommentWhere): CommentsConnection!
              contents(limit: Int, offset: Int, options: ContentOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ContentSort!], where: ContentWhere): [Content!]!
              contentsAggregate(where: ContentWhere): ContentAggregateSelection!
              contentsConnection(after: String, first: Int, sort: [ContentSort!], where: ContentWhere): ContentsConnection!
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

            type UpdateCommentsMutationResponse {
              comments: [Comment!]!
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

            type UpdatePostsMutationResponse {
              info: UpdateInfo!
              posts: [Post!]!
            }

            type UpdateUsersMutationResponse {
              info: UpdateInfo!
              users: [User!]!
            }

            type User {
              content(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: ContentOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ContentSort!], where: ContentWhere): [Content!]!
              contentAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: ContentWhere): UserContentContentAggregationSelection
              contentConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [UserContentConnectionSort!], where: UserContentConnectionWhere): UserContentConnection!
              id: ID
              name: String
            }

            type UserAggregateSelection {
              count: Int!
              id: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              name: StringAggregateSelection!
            }

            input UserConnectInput {
              content: [UserContentConnectFieldInput!]
            }

            input UserConnectWhere {
              node: UserWhere!
            }

            input UserContentAggregateInput {
              AND: [UserContentAggregateInput!]
              NOT: UserContentAggregateInput
              OR: [UserContentAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              node: UserContentNodeAggregationWhereInput
            }

            input UserContentConnectFieldInput {
              connect: ContentConnectInput
              where: ContentConnectWhere
            }

            type UserContentConnection {
              edges: [UserContentRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input UserContentConnectionSort {
              node: ContentSort
            }

            input UserContentConnectionWhere {
              AND: [UserContentConnectionWhere!]
              NOT: UserContentConnectionWhere
              OR: [UserContentConnectionWhere!]
              node: ContentWhere
            }

            type UserContentContentAggregationSelection {
              count: Int!
              node: UserContentContentNodeAggregateSelection
            }

            type UserContentContentNodeAggregateSelection {
              content: StringAggregateSelection!
              id: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
            }

            input UserContentCreateFieldInput {
              node: ContentCreateInput!
            }

            input UserContentDeleteFieldInput {
              delete: ContentDeleteInput
              where: UserContentConnectionWhere
            }

            input UserContentDisconnectFieldInput {
              disconnect: ContentDisconnectInput
              where: UserContentConnectionWhere
            }

            input UserContentFieldInput {
              connect: [UserContentConnectFieldInput!]
              create: [UserContentCreateFieldInput!]
            }

            input UserContentNodeAggregationWhereInput {
              AND: [UserContentNodeAggregationWhereInput!]
              NOT: UserContentNodeAggregationWhereInput
              OR: [UserContentNodeAggregationWhereInput!]
              content_AVERAGE_LENGTH_EQUAL: Float
              content_AVERAGE_LENGTH_GT: Float
              content_AVERAGE_LENGTH_GTE: Float
              content_AVERAGE_LENGTH_LT: Float
              content_AVERAGE_LENGTH_LTE: Float
              content_LONGEST_LENGTH_EQUAL: Int
              content_LONGEST_LENGTH_GT: Int
              content_LONGEST_LENGTH_GTE: Int
              content_LONGEST_LENGTH_LT: Int
              content_LONGEST_LENGTH_LTE: Int
              content_SHORTEST_LENGTH_EQUAL: Int
              content_SHORTEST_LENGTH_GT: Int
              content_SHORTEST_LENGTH_GTE: Int
              content_SHORTEST_LENGTH_LT: Int
              content_SHORTEST_LENGTH_LTE: Int
              id_MAX_EQUAL: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_GT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_GTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_LT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MAX_LTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_EQUAL: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_GT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_GTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_LT: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              id_MIN_LTE: ID @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
            }

            type UserContentRelationship {
              cursor: String!
              node: Content!
            }

            input UserContentUpdateConnectionInput {
              node: ContentUpdateInput
            }

            input UserContentUpdateFieldInput {
              connect: [UserContentConnectFieldInput!]
              create: [UserContentCreateFieldInput!]
              delete: [UserContentDeleteFieldInput!]
              disconnect: [UserContentDisconnectFieldInput!]
              update: UserContentUpdateConnectionInput
              where: UserContentConnectionWhere
            }

            input UserCreateInput {
              content: UserContentFieldInput
              id: ID
              name: String
            }

            input UserDeleteInput {
              content: [UserContentDeleteFieldInput!]
            }

            input UserDisconnectInput {
              content: [UserContentDisconnectFieldInput!]
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
              id: SortDirection
              name: SortDirection
            }

            input UserUpdateInput {
              content: [UserContentUpdateFieldInput!]
              id: ID @deprecated(reason: \\"Please use the explicit _SET field\\")
              id_SET: ID
              name: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              name_SET: String
            }

            input UserWhere {
              AND: [UserWhere!]
              NOT: UserWhere
              OR: [UserWhere!]
              contentAggregate: UserContentAggregateInput
              \\"\\"\\"
              Return Users where all of the related UserContentConnections match this filter
              \\"\\"\\"
              contentConnection_ALL: UserContentConnectionWhere
              \\"\\"\\"
              Return Users where none of the related UserContentConnections match this filter
              \\"\\"\\"
              contentConnection_NONE: UserContentConnectionWhere
              \\"\\"\\"
              Return Users where one of the related UserContentConnections match this filter
              \\"\\"\\"
              contentConnection_SINGLE: UserContentConnectionWhere
              \\"\\"\\"
              Return Users where some of the related UserContentConnections match this filter
              \\"\\"\\"
              contentConnection_SOME: UserContentConnectionWhere
              \\"\\"\\"Return Users where all of the related Contents match this filter\\"\\"\\"
              content_ALL: ContentWhere
              \\"\\"\\"Return Users where none of the related Contents match this filter\\"\\"\\"
              content_NONE: ContentWhere
              \\"\\"\\"Return Users where one of the related Contents match this filter\\"\\"\\"
              content_SINGLE: ContentWhere
              \\"\\"\\"Return Users where some of the related Contents match this filter\\"\\"\\"
              content_SOME: ContentWhere
              id: ID @deprecated(reason: \\"Please use the explicit _EQ version\\")
              id_CONTAINS: ID
              id_ENDS_WITH: ID
              id_EQ: ID
              id_IN: [ID]
              id_STARTS_WITH: ID
              name: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              name_CONTAINS: String
              name_ENDS_WITH: String
              name_EQ: String
              name_IN: [String]
              name_STARTS_WITH: String
            }

            type UsersConnection {
              edges: [UserEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }"
        `);
    });

    test("Interface Relationships - interface implementing interface", async () => {
        const typeDefs = gql`
            interface Show {
                title: String!
                actors: [Actor!]! @declareRelationship
            }

            interface Production implements Show {
                title: String!
                actors: [Actor!]!
            }

            type Movie implements Production & Show @node {
                title: String!
                runtime: Int!
                actors: [Actor!]! @relationship(type: "ACTED_IN", direction: IN, properties: "ActedIn")
            }

            type Series implements Production & Show @node {
                title: String!
                episodeCount: Int!
                actors: [Actor!]! @relationship(type: "ACTED_IN", direction: IN, properties: "StarredIn")
            }

            type ActedIn @relationshipProperties {
                screenTime: Int!
            }

            type StarredIn @relationshipProperties {
                episodeNr: Int!
            }

            type Actor @node {
                name: String!
                actedIn: [Show!]! @relationship(type: "ACTED_IN", direction: OUT, properties: "ActedIn")
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
            The edge properties for the following fields:
            * Movie.actors
            * Actor.actedIn
            \\"\\"\\"
            type ActedIn {
              screenTime: Int!
            }

            input ActedInAggregationWhereInput {
              AND: [ActedInAggregationWhereInput!]
              NOT: ActedInAggregationWhereInput
              OR: [ActedInAggregationWhereInput!]
              screenTime_AVERAGE_EQUAL: Float
              screenTime_AVERAGE_GT: Float
              screenTime_AVERAGE_GTE: Float
              screenTime_AVERAGE_LT: Float
              screenTime_AVERAGE_LTE: Float
              screenTime_MAX_EQUAL: Int
              screenTime_MAX_GT: Int
              screenTime_MAX_GTE: Int
              screenTime_MAX_LT: Int
              screenTime_MAX_LTE: Int
              screenTime_MIN_EQUAL: Int
              screenTime_MIN_GT: Int
              screenTime_MIN_GTE: Int
              screenTime_MIN_LT: Int
              screenTime_MIN_LTE: Int
              screenTime_SUM_EQUAL: Int
              screenTime_SUM_GT: Int
              screenTime_SUM_GTE: Int
              screenTime_SUM_LT: Int
              screenTime_SUM_LTE: Int
            }

            input ActedInCreateInput {
              screenTime: Int!
            }

            input ActedInSort {
              screenTime: SortDirection
            }

            input ActedInUpdateInput {
              screenTime: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              screenTime_DECREMENT: Int
              screenTime_INCREMENT: Int
              screenTime_SET: Int
            }

            input ActedInWhere {
              AND: [ActedInWhere!]
              NOT: ActedInWhere
              OR: [ActedInWhere!]
              screenTime: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              screenTime_EQ: Int
              screenTime_GT: Int
              screenTime_GTE: Int
              screenTime_IN: [Int!]
              screenTime_LT: Int
              screenTime_LTE: Int
            }

            type Actor {
              actedIn(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: ShowOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ShowSort!], where: ShowWhere): [Show!]!
              actedInAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: ShowWhere): ActorShowActedInAggregationSelection
              actedInConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [ActorActedInConnectionSort!], where: ActorActedInConnectionWhere): ActorActedInConnection!
              name: String!
            }

            input ActorActedInAggregateInput {
              AND: [ActorActedInAggregateInput!]
              NOT: ActorActedInAggregateInput
              OR: [ActorActedInAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: ActedInAggregationWhereInput
              node: ActorActedInNodeAggregationWhereInput
            }

            input ActorActedInConnectFieldInput {
              connect: ShowConnectInput
              edge: ActedInCreateInput!
              where: ShowConnectWhere
            }

            type ActorActedInConnection {
              edges: [ActorActedInRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input ActorActedInConnectionSort {
              edge: ActedInSort
              node: ShowSort
            }

            input ActorActedInConnectionWhere {
              AND: [ActorActedInConnectionWhere!]
              NOT: ActorActedInConnectionWhere
              OR: [ActorActedInConnectionWhere!]
              edge: ActedInWhere
              node: ShowWhere
            }

            input ActorActedInCreateFieldInput {
              edge: ActedInCreateInput!
              node: ShowCreateInput!
            }

            input ActorActedInDeleteFieldInput {
              delete: ShowDeleteInput
              where: ActorActedInConnectionWhere
            }

            input ActorActedInDisconnectFieldInput {
              disconnect: ShowDisconnectInput
              where: ActorActedInConnectionWhere
            }

            input ActorActedInFieldInput {
              connect: [ActorActedInConnectFieldInput!]
              create: [ActorActedInCreateFieldInput!]
            }

            input ActorActedInNodeAggregationWhereInput {
              AND: [ActorActedInNodeAggregationWhereInput!]
              NOT: ActorActedInNodeAggregationWhereInput
              OR: [ActorActedInNodeAggregationWhereInput!]
              title_AVERAGE_LENGTH_EQUAL: Float
              title_AVERAGE_LENGTH_GT: Float
              title_AVERAGE_LENGTH_GTE: Float
              title_AVERAGE_LENGTH_LT: Float
              title_AVERAGE_LENGTH_LTE: Float
              title_LONGEST_LENGTH_EQUAL: Int
              title_LONGEST_LENGTH_GT: Int
              title_LONGEST_LENGTH_GTE: Int
              title_LONGEST_LENGTH_LT: Int
              title_LONGEST_LENGTH_LTE: Int
              title_SHORTEST_LENGTH_EQUAL: Int
              title_SHORTEST_LENGTH_GT: Int
              title_SHORTEST_LENGTH_GTE: Int
              title_SHORTEST_LENGTH_LT: Int
              title_SHORTEST_LENGTH_LTE: Int
            }

            type ActorActedInRelationship {
              cursor: String!
              node: Show!
              properties: ActedIn!
            }

            input ActorActedInUpdateConnectionInput {
              edge: ActedInUpdateInput
              node: ShowUpdateInput
            }

            input ActorActedInUpdateFieldInput {
              connect: [ActorActedInConnectFieldInput!]
              create: [ActorActedInCreateFieldInput!]
              delete: [ActorActedInDeleteFieldInput!]
              disconnect: [ActorActedInDisconnectFieldInput!]
              update: ActorActedInUpdateConnectionInput
              where: ActorActedInConnectionWhere
            }

            type ActorAggregateSelection {
              count: Int!
              name: StringAggregateSelection!
            }

            input ActorConnectInput {
              actedIn: [ActorActedInConnectFieldInput!]
            }

            input ActorConnectWhere {
              node: ActorWhere!
            }

            input ActorCreateInput {
              actedIn: ActorActedInFieldInput
              name: String!
            }

            input ActorDeleteInput {
              actedIn: [ActorActedInDeleteFieldInput!]
            }

            input ActorDisconnectInput {
              actedIn: [ActorActedInDisconnectFieldInput!]
            }

            type ActorEdge {
              cursor: String!
              node: Actor!
            }

            input ActorOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more ActorSort objects to sort Actors by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [ActorSort!]
            }

            type ActorShowActedInAggregationSelection {
              count: Int!
              edge: ActorShowActedInEdgeAggregateSelection
              node: ActorShowActedInNodeAggregateSelection
            }

            type ActorShowActedInEdgeAggregateSelection {
              screenTime: IntAggregateSelection!
            }

            type ActorShowActedInNodeAggregateSelection {
              title: StringAggregateSelection!
            }

            \\"\\"\\"
            Fields to sort Actors by. The order in which sorts are applied is not guaranteed when specifying many fields in one ActorSort object.
            \\"\\"\\"
            input ActorSort {
              name: SortDirection
            }

            input ActorUpdateInput {
              actedIn: [ActorActedInUpdateFieldInput!]
              name: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              name_SET: String
            }

            input ActorWhere {
              AND: [ActorWhere!]
              NOT: ActorWhere
              OR: [ActorWhere!]
              actedInAggregate: ActorActedInAggregateInput
              \\"\\"\\"
              Return Actors where all of the related ActorActedInConnections match this filter
              \\"\\"\\"
              actedInConnection_ALL: ActorActedInConnectionWhere
              \\"\\"\\"
              Return Actors where none of the related ActorActedInConnections match this filter
              \\"\\"\\"
              actedInConnection_NONE: ActorActedInConnectionWhere
              \\"\\"\\"
              Return Actors where one of the related ActorActedInConnections match this filter
              \\"\\"\\"
              actedInConnection_SINGLE: ActorActedInConnectionWhere
              \\"\\"\\"
              Return Actors where some of the related ActorActedInConnections match this filter
              \\"\\"\\"
              actedInConnection_SOME: ActorActedInConnectionWhere
              \\"\\"\\"Return Actors where all of the related Shows match this filter\\"\\"\\"
              actedIn_ALL: ShowWhere
              \\"\\"\\"Return Actors where none of the related Shows match this filter\\"\\"\\"
              actedIn_NONE: ShowWhere
              \\"\\"\\"Return Actors where one of the related Shows match this filter\\"\\"\\"
              actedIn_SINGLE: ShowWhere
              \\"\\"\\"Return Actors where some of the related Shows match this filter\\"\\"\\"
              actedIn_SOME: ShowWhere
              name: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              name_CONTAINS: String
              name_ENDS_WITH: String
              name_EQ: String
              name_IN: [String!]
              name_STARTS_WITH: String
            }

            type ActorsConnection {
              edges: [ActorEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type CreateActorsMutationResponse {
              actors: [Actor!]!
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

            type CreateSeriesMutationResponse {
              info: CreateInfo!
              series: [Series!]!
            }

            \\"\\"\\"
            Information about the number of nodes and relationships deleted during a delete mutation
            \\"\\"\\"
            type DeleteInfo {
              nodesDeleted: Int!
              relationshipsDeleted: Int!
            }

            type IntAggregateSelection {
              average: Float
              max: Int
              min: Int
              sum: Int
            }

            type Movie implements Production & Show {
              actors(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: ActorOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ActorSort!], where: ActorWhere): [Actor!]!
              actorsAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: ActorWhere): MovieActorActorsAggregationSelection
              actorsConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [ShowActorsConnectionSort!], where: ShowActorsConnectionWhere): ShowActorsConnection!
              runtime: Int!
              title: String!
            }

            type MovieActorActorsAggregationSelection {
              count: Int!
              edge: MovieActorActorsEdgeAggregateSelection
              node: MovieActorActorsNodeAggregateSelection
            }

            type MovieActorActorsEdgeAggregateSelection {
              screenTime: IntAggregateSelection!
            }

            type MovieActorActorsNodeAggregateSelection {
              name: StringAggregateSelection!
            }

            input MovieActorsAggregateInput {
              AND: [MovieActorsAggregateInput!]
              NOT: MovieActorsAggregateInput
              OR: [MovieActorsAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: ActedInAggregationWhereInput
              node: MovieActorsNodeAggregationWhereInput
            }

            input MovieActorsConnectFieldInput {
              connect: [ActorConnectInput!]
              edge: ActedInCreateInput!
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: ActorConnectWhere
            }

            input MovieActorsCreateFieldInput {
              edge: ActedInCreateInput!
              node: ActorCreateInput!
            }

            input MovieActorsFieldInput {
              connect: [MovieActorsConnectFieldInput!]
              create: [MovieActorsCreateFieldInput!]
            }

            input MovieActorsNodeAggregationWhereInput {
              AND: [MovieActorsNodeAggregationWhereInput!]
              NOT: MovieActorsNodeAggregationWhereInput
              OR: [MovieActorsNodeAggregationWhereInput!]
              name_AVERAGE_LENGTH_EQUAL: Float
              name_AVERAGE_LENGTH_GT: Float
              name_AVERAGE_LENGTH_GTE: Float
              name_AVERAGE_LENGTH_LT: Float
              name_AVERAGE_LENGTH_LTE: Float
              name_LONGEST_LENGTH_EQUAL: Int
              name_LONGEST_LENGTH_GT: Int
              name_LONGEST_LENGTH_GTE: Int
              name_LONGEST_LENGTH_LT: Int
              name_LONGEST_LENGTH_LTE: Int
              name_SHORTEST_LENGTH_EQUAL: Int
              name_SHORTEST_LENGTH_GT: Int
              name_SHORTEST_LENGTH_GTE: Int
              name_SHORTEST_LENGTH_LT: Int
              name_SHORTEST_LENGTH_LTE: Int
            }

            input MovieActorsUpdateConnectionInput {
              edge: ActedInUpdateInput
              node: ActorUpdateInput
            }

            input MovieActorsUpdateFieldInput {
              connect: [MovieActorsConnectFieldInput!]
              create: [MovieActorsCreateFieldInput!]
              delete: [ShowActorsDeleteFieldInput!]
              disconnect: [ShowActorsDisconnectFieldInput!]
              update: MovieActorsUpdateConnectionInput
              where: ShowActorsConnectionWhere
            }

            type MovieAggregateSelection {
              count: Int!
              runtime: IntAggregateSelection!
              title: StringAggregateSelection!
            }

            input MovieCreateInput {
              actors: MovieActorsFieldInput
              runtime: Int!
              title: String!
            }

            input MovieDeleteInput {
              actors: [ShowActorsDeleteFieldInput!]
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
              runtime: SortDirection
              title: SortDirection
            }

            input MovieUpdateInput {
              actors: [MovieActorsUpdateFieldInput!]
              runtime: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              runtime_DECREMENT: Int
              runtime_INCREMENT: Int
              runtime_SET: Int
              title: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              title_SET: String
            }

            input MovieWhere {
              AND: [MovieWhere!]
              NOT: MovieWhere
              OR: [MovieWhere!]
              actorsAggregate: MovieActorsAggregateInput
              \\"\\"\\"
              Return Movies where all of the related ShowActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_ALL: ShowActorsConnectionWhere
              \\"\\"\\"
              Return Movies where none of the related ShowActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_NONE: ShowActorsConnectionWhere
              \\"\\"\\"
              Return Movies where one of the related ShowActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_SINGLE: ShowActorsConnectionWhere
              \\"\\"\\"
              Return Movies where some of the related ShowActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_SOME: ShowActorsConnectionWhere
              \\"\\"\\"Return Movies where all of the related Actors match this filter\\"\\"\\"
              actors_ALL: ActorWhere
              \\"\\"\\"Return Movies where none of the related Actors match this filter\\"\\"\\"
              actors_NONE: ActorWhere
              \\"\\"\\"Return Movies where one of the related Actors match this filter\\"\\"\\"
              actors_SINGLE: ActorWhere
              \\"\\"\\"Return Movies where some of the related Actors match this filter\\"\\"\\"
              actors_SOME: ActorWhere
              runtime: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              runtime_EQ: Int
              runtime_GT: Int
              runtime_GTE: Int
              runtime_IN: [Int!]
              runtime_LT: Int
              runtime_LTE: Int
              title: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              title_CONTAINS: String
              title_ENDS_WITH: String
              title_EQ: String
              title_IN: [String!]
              title_STARTS_WITH: String
            }

            type MoviesConnection {
              edges: [MovieEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Mutation {
              createActors(input: [ActorCreateInput!]!): CreateActorsMutationResponse!
              createMovies(input: [MovieCreateInput!]!): CreateMoviesMutationResponse!
              createSeries(input: [SeriesCreateInput!]!): CreateSeriesMutationResponse!
              deleteActors(delete: ActorDeleteInput, where: ActorWhere): DeleteInfo!
              deleteMovies(delete: MovieDeleteInput, where: MovieWhere): DeleteInfo!
              deleteSeries(delete: SeriesDeleteInput, where: SeriesWhere): DeleteInfo!
              updateActors(update: ActorUpdateInput, where: ActorWhere): UpdateActorsMutationResponse!
              updateMovies(update: MovieUpdateInput, where: MovieWhere): UpdateMoviesMutationResponse!
              updateSeries(update: SeriesUpdateInput, where: SeriesWhere): UpdateSeriesMutationResponse!
            }

            \\"\\"\\"Pagination information (Relay)\\"\\"\\"
            type PageInfo {
              endCursor: String
              hasNextPage: Boolean!
              hasPreviousPage: Boolean!
              startCursor: String
            }

            interface Production {
              actors: [Actor!]!
              title: String!
            }

            type ProductionAggregateSelection {
              count: Int!
              title: StringAggregateSelection!
            }

            type ProductionEdge {
              cursor: String!
              node: Production!
            }

            enum ProductionImplementation {
              Movie
              Series
            }

            input ProductionOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more ProductionSort objects to sort Productions by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [ProductionSort!]
            }

            \\"\\"\\"
            Fields to sort Productions by. The order in which sorts are applied is not guaranteed when specifying many fields in one ProductionSort object.
            \\"\\"\\"
            input ProductionSort {
              title: SortDirection
            }

            input ProductionWhere {
              AND: [ProductionWhere!]
              NOT: ProductionWhere
              OR: [ProductionWhere!]
              title: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              title_CONTAINS: String
              title_ENDS_WITH: String
              title_EQ: String
              title_IN: [String!]
              title_STARTS_WITH: String
              typename: [ProductionImplementation!]
              typename_IN: [ProductionImplementation!] @deprecated(reason: \\"The typename_IN filter is deprecated, please use the typename filter instead\\")
            }

            type ProductionsConnection {
              edges: [ProductionEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Query {
              actors(limit: Int, offset: Int, options: ActorOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ActorSort!], where: ActorWhere): [Actor!]!
              actorsAggregate(where: ActorWhere): ActorAggregateSelection!
              actorsConnection(after: String, first: Int, sort: [ActorSort!], where: ActorWhere): ActorsConnection!
              movies(limit: Int, offset: Int, options: MovieOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [MovieSort!], where: MovieWhere): [Movie!]!
              moviesAggregate(where: MovieWhere): MovieAggregateSelection!
              moviesConnection(after: String, first: Int, sort: [MovieSort!], where: MovieWhere): MoviesConnection!
              productions(limit: Int, offset: Int, options: ProductionOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ProductionSort!], where: ProductionWhere): [Production!]!
              productionsAggregate(where: ProductionWhere): ProductionAggregateSelection!
              productionsConnection(after: String, first: Int, sort: [ProductionSort!], where: ProductionWhere): ProductionsConnection!
              series(limit: Int, offset: Int, options: SeriesOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [SeriesSort!], where: SeriesWhere): [Series!]!
              seriesAggregate(where: SeriesWhere): SeriesAggregateSelection!
              seriesConnection(after: String, first: Int, sort: [SeriesSort!], where: SeriesWhere): SeriesConnection!
              shows(limit: Int, offset: Int, options: ShowOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ShowSort!], where: ShowWhere): [Show!]!
              showsAggregate(where: ShowWhere): ShowAggregateSelection!
              showsConnection(after: String, first: Int, sort: [ShowSort!], where: ShowWhere): ShowsConnection!
            }

            type Series implements Production & Show {
              actors(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: ActorOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ActorSort!], where: ActorWhere): [Actor!]!
              actorsAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: ActorWhere): SeriesActorActorsAggregationSelection
              actorsConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [ShowActorsConnectionSort!], where: ShowActorsConnectionWhere): ShowActorsConnection!
              episodeCount: Int!
              title: String!
            }

            type SeriesActorActorsAggregationSelection {
              count: Int!
              edge: SeriesActorActorsEdgeAggregateSelection
              node: SeriesActorActorsNodeAggregateSelection
            }

            type SeriesActorActorsEdgeAggregateSelection {
              episodeNr: IntAggregateSelection!
            }

            type SeriesActorActorsNodeAggregateSelection {
              name: StringAggregateSelection!
            }

            input SeriesActorsAggregateInput {
              AND: [SeriesActorsAggregateInput!]
              NOT: SeriesActorsAggregateInput
              OR: [SeriesActorsAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: StarredInAggregationWhereInput
              node: SeriesActorsNodeAggregationWhereInput
            }

            input SeriesActorsConnectFieldInput {
              connect: [ActorConnectInput!]
              edge: StarredInCreateInput!
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: ActorConnectWhere
            }

            input SeriesActorsCreateFieldInput {
              edge: StarredInCreateInput!
              node: ActorCreateInput!
            }

            input SeriesActorsFieldInput {
              connect: [SeriesActorsConnectFieldInput!]
              create: [SeriesActorsCreateFieldInput!]
            }

            input SeriesActorsNodeAggregationWhereInput {
              AND: [SeriesActorsNodeAggregationWhereInput!]
              NOT: SeriesActorsNodeAggregationWhereInput
              OR: [SeriesActorsNodeAggregationWhereInput!]
              name_AVERAGE_LENGTH_EQUAL: Float
              name_AVERAGE_LENGTH_GT: Float
              name_AVERAGE_LENGTH_GTE: Float
              name_AVERAGE_LENGTH_LT: Float
              name_AVERAGE_LENGTH_LTE: Float
              name_LONGEST_LENGTH_EQUAL: Int
              name_LONGEST_LENGTH_GT: Int
              name_LONGEST_LENGTH_GTE: Int
              name_LONGEST_LENGTH_LT: Int
              name_LONGEST_LENGTH_LTE: Int
              name_SHORTEST_LENGTH_EQUAL: Int
              name_SHORTEST_LENGTH_GT: Int
              name_SHORTEST_LENGTH_GTE: Int
              name_SHORTEST_LENGTH_LT: Int
              name_SHORTEST_LENGTH_LTE: Int
            }

            input SeriesActorsUpdateConnectionInput {
              edge: StarredInUpdateInput
              node: ActorUpdateInput
            }

            input SeriesActorsUpdateFieldInput {
              connect: [SeriesActorsConnectFieldInput!]
              create: [SeriesActorsCreateFieldInput!]
              delete: [ShowActorsDeleteFieldInput!]
              disconnect: [ShowActorsDisconnectFieldInput!]
              update: SeriesActorsUpdateConnectionInput
              where: ShowActorsConnectionWhere
            }

            type SeriesAggregateSelection {
              count: Int!
              episodeCount: IntAggregateSelection!
              title: StringAggregateSelection!
            }

            type SeriesConnection {
              edges: [SeriesEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input SeriesCreateInput {
              actors: SeriesActorsFieldInput
              episodeCount: Int!
              title: String!
            }

            input SeriesDeleteInput {
              actors: [ShowActorsDeleteFieldInput!]
            }

            type SeriesEdge {
              cursor: String!
              node: Series!
            }

            input SeriesOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more SeriesSort objects to sort Series by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [SeriesSort!]
            }

            \\"\\"\\"
            Fields to sort Series by. The order in which sorts are applied is not guaranteed when specifying many fields in one SeriesSort object.
            \\"\\"\\"
            input SeriesSort {
              episodeCount: SortDirection
              title: SortDirection
            }

            input SeriesUpdateInput {
              actors: [SeriesActorsUpdateFieldInput!]
              episodeCount: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              episodeCount_DECREMENT: Int
              episodeCount_INCREMENT: Int
              episodeCount_SET: Int
              title: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              title_SET: String
            }

            input SeriesWhere {
              AND: [SeriesWhere!]
              NOT: SeriesWhere
              OR: [SeriesWhere!]
              actorsAggregate: SeriesActorsAggregateInput
              \\"\\"\\"
              Return Series where all of the related ShowActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_ALL: ShowActorsConnectionWhere
              \\"\\"\\"
              Return Series where none of the related ShowActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_NONE: ShowActorsConnectionWhere
              \\"\\"\\"
              Return Series where one of the related ShowActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_SINGLE: ShowActorsConnectionWhere
              \\"\\"\\"
              Return Series where some of the related ShowActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_SOME: ShowActorsConnectionWhere
              \\"\\"\\"Return Series where all of the related Actors match this filter\\"\\"\\"
              actors_ALL: ActorWhere
              \\"\\"\\"Return Series where none of the related Actors match this filter\\"\\"\\"
              actors_NONE: ActorWhere
              \\"\\"\\"Return Series where one of the related Actors match this filter\\"\\"\\"
              actors_SINGLE: ActorWhere
              \\"\\"\\"Return Series where some of the related Actors match this filter\\"\\"\\"
              actors_SOME: ActorWhere
              episodeCount: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              episodeCount_EQ: Int
              episodeCount_GT: Int
              episodeCount_GTE: Int
              episodeCount_IN: [Int!]
              episodeCount_LT: Int
              episodeCount_LTE: Int
              title: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              title_CONTAINS: String
              title_ENDS_WITH: String
              title_EQ: String
              title_IN: [String!]
              title_STARTS_WITH: String
            }

            interface Show {
              actors(limit: Int, offset: Int, options: ActorOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ActorSort!], where: ActorWhere): [Actor!]!
              actorsConnection(after: String, first: Int, sort: [ShowActorsConnectionSort!], where: ShowActorsConnectionWhere): ShowActorsConnection!
              title: String!
            }

            input ShowActorsAggregateInput {
              AND: [ShowActorsAggregateInput!]
              NOT: ShowActorsAggregateInput
              OR: [ShowActorsAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: ShowActorsEdgeAggregationWhereInput
              node: ShowActorsNodeAggregationWhereInput
            }

            input ShowActorsConnectFieldInput {
              connect: [ActorConnectInput!]
              edge: ShowActorsEdgeCreateInput!
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: ActorConnectWhere
            }

            type ShowActorsConnection {
              edges: [ShowActorsRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input ShowActorsConnectionSort {
              edge: ShowActorsEdgeSort
              node: ActorSort
            }

            input ShowActorsConnectionWhere {
              AND: [ShowActorsConnectionWhere!]
              NOT: ShowActorsConnectionWhere
              OR: [ShowActorsConnectionWhere!]
              edge: ShowActorsEdgeWhere
              node: ActorWhere
            }

            input ShowActorsCreateFieldInput {
              edge: ShowActorsEdgeCreateInput!
              node: ActorCreateInput!
            }

            input ShowActorsDeleteFieldInput {
              delete: ActorDeleteInput
              where: ShowActorsConnectionWhere
            }

            input ShowActorsDisconnectFieldInput {
              disconnect: ActorDisconnectInput
              where: ShowActorsConnectionWhere
            }

            input ShowActorsEdgeAggregationWhereInput {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Movie
              \\"\\"\\"
              ActedIn: ActedInAggregationWhereInput
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Series
              \\"\\"\\"
              StarredIn: StarredInAggregationWhereInput
            }

            input ShowActorsEdgeCreateInput {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Movie
              \\"\\"\\"
              ActedIn: ActedInCreateInput!
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Series
              \\"\\"\\"
              StarredIn: StarredInCreateInput!
            }

            input ShowActorsEdgeSort {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Movie
              \\"\\"\\"
              ActedIn: ActedInSort
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Series
              \\"\\"\\"
              StarredIn: StarredInSort
            }

            input ShowActorsEdgeUpdateInput {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Movie
              \\"\\"\\"
              ActedIn: ActedInUpdateInput
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Series
              \\"\\"\\"
              StarredIn: StarredInUpdateInput
            }

            input ShowActorsEdgeWhere {
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Movie
              \\"\\"\\"
              ActedIn: ActedInWhere
              \\"\\"\\"
              Relationship properties when source node is of type:
              * Series
              \\"\\"\\"
              StarredIn: StarredInWhere
            }

            input ShowActorsNodeAggregationWhereInput {
              AND: [ShowActorsNodeAggregationWhereInput!]
              NOT: ShowActorsNodeAggregationWhereInput
              OR: [ShowActorsNodeAggregationWhereInput!]
              name_AVERAGE_LENGTH_EQUAL: Float
              name_AVERAGE_LENGTH_GT: Float
              name_AVERAGE_LENGTH_GTE: Float
              name_AVERAGE_LENGTH_LT: Float
              name_AVERAGE_LENGTH_LTE: Float
              name_LONGEST_LENGTH_EQUAL: Int
              name_LONGEST_LENGTH_GT: Int
              name_LONGEST_LENGTH_GTE: Int
              name_LONGEST_LENGTH_LT: Int
              name_LONGEST_LENGTH_LTE: Int
              name_SHORTEST_LENGTH_EQUAL: Int
              name_SHORTEST_LENGTH_GT: Int
              name_SHORTEST_LENGTH_GTE: Int
              name_SHORTEST_LENGTH_LT: Int
              name_SHORTEST_LENGTH_LTE: Int
            }

            type ShowActorsRelationship {
              cursor: String!
              node: Actor!
              properties: ShowActorsRelationshipProperties!
            }

            union ShowActorsRelationshipProperties = ActedIn | StarredIn

            input ShowActorsUpdateConnectionInput {
              edge: ShowActorsEdgeUpdateInput
              node: ActorUpdateInput
            }

            input ShowActorsUpdateFieldInput {
              connect: [ShowActorsConnectFieldInput!]
              create: [ShowActorsCreateFieldInput!]
              delete: [ShowActorsDeleteFieldInput!]
              disconnect: [ShowActorsDisconnectFieldInput!]
              update: ShowActorsUpdateConnectionInput
              where: ShowActorsConnectionWhere
            }

            type ShowAggregateSelection {
              count: Int!
              title: StringAggregateSelection!
            }

            input ShowConnectInput {
              actors: [ShowActorsConnectFieldInput!]
            }

            input ShowConnectWhere {
              node: ShowWhere!
            }

            input ShowCreateInput {
              Movie: MovieCreateInput
              Series: SeriesCreateInput
            }

            input ShowDeleteInput {
              actors: [ShowActorsDeleteFieldInput!]
            }

            input ShowDisconnectInput {
              actors: [ShowActorsDisconnectFieldInput!]
            }

            type ShowEdge {
              cursor: String!
              node: Show!
            }

            enum ShowImplementation {
              Movie
              Series
            }

            input ShowOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more ShowSort objects to sort Shows by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [ShowSort!]
            }

            \\"\\"\\"
            Fields to sort Shows by. The order in which sorts are applied is not guaranteed when specifying many fields in one ShowSort object.
            \\"\\"\\"
            input ShowSort {
              title: SortDirection
            }

            input ShowUpdateInput {
              actors: [ShowActorsUpdateFieldInput!]
              title: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              title_SET: String
            }

            input ShowWhere {
              AND: [ShowWhere!]
              NOT: ShowWhere
              OR: [ShowWhere!]
              actorsAggregate: ShowActorsAggregateInput
              \\"\\"\\"
              Return Shows where all of the related ShowActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_ALL: ShowActorsConnectionWhere
              \\"\\"\\"
              Return Shows where none of the related ShowActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_NONE: ShowActorsConnectionWhere
              \\"\\"\\"
              Return Shows where one of the related ShowActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_SINGLE: ShowActorsConnectionWhere
              \\"\\"\\"
              Return Shows where some of the related ShowActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_SOME: ShowActorsConnectionWhere
              \\"\\"\\"Return Shows where all of the related Actors match this filter\\"\\"\\"
              actors_ALL: ActorWhere
              \\"\\"\\"Return Shows where none of the related Actors match this filter\\"\\"\\"
              actors_NONE: ActorWhere
              \\"\\"\\"Return Shows where one of the related Actors match this filter\\"\\"\\"
              actors_SINGLE: ActorWhere
              \\"\\"\\"Return Shows where some of the related Actors match this filter\\"\\"\\"
              actors_SOME: ActorWhere
              title: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              title_CONTAINS: String
              title_ENDS_WITH: String
              title_EQ: String
              title_IN: [String!]
              title_STARTS_WITH: String
              typename: [ShowImplementation!]
              typename_IN: [ShowImplementation!] @deprecated(reason: \\"The typename_IN filter is deprecated, please use the typename filter instead\\")
            }

            type ShowsConnection {
              edges: [ShowEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            \\"\\"\\"An enum for sorting in either ascending or descending order.\\"\\"\\"
            enum SortDirection {
              \\"\\"\\"Sort by field values in ascending order.\\"\\"\\"
              ASC
              \\"\\"\\"Sort by field values in descending order.\\"\\"\\"
              DESC
            }

            \\"\\"\\"
            The edge properties for the following fields:
            * Series.actors
            \\"\\"\\"
            type StarredIn {
              episodeNr: Int!
            }

            input StarredInAggregationWhereInput {
              AND: [StarredInAggregationWhereInput!]
              NOT: StarredInAggregationWhereInput
              OR: [StarredInAggregationWhereInput!]
              episodeNr_AVERAGE_EQUAL: Float
              episodeNr_AVERAGE_GT: Float
              episodeNr_AVERAGE_GTE: Float
              episodeNr_AVERAGE_LT: Float
              episodeNr_AVERAGE_LTE: Float
              episodeNr_MAX_EQUAL: Int
              episodeNr_MAX_GT: Int
              episodeNr_MAX_GTE: Int
              episodeNr_MAX_LT: Int
              episodeNr_MAX_LTE: Int
              episodeNr_MIN_EQUAL: Int
              episodeNr_MIN_GT: Int
              episodeNr_MIN_GTE: Int
              episodeNr_MIN_LT: Int
              episodeNr_MIN_LTE: Int
              episodeNr_SUM_EQUAL: Int
              episodeNr_SUM_GT: Int
              episodeNr_SUM_GTE: Int
              episodeNr_SUM_LT: Int
              episodeNr_SUM_LTE: Int
            }

            input StarredInCreateInput {
              episodeNr: Int!
            }

            input StarredInSort {
              episodeNr: SortDirection
            }

            input StarredInUpdateInput {
              episodeNr: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              episodeNr_DECREMENT: Int
              episodeNr_INCREMENT: Int
              episodeNr_SET: Int
            }

            input StarredInWhere {
              AND: [StarredInWhere!]
              NOT: StarredInWhere
              OR: [StarredInWhere!]
              episodeNr: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              episodeNr_EQ: Int
              episodeNr_GT: Int
              episodeNr_GTE: Int
              episodeNr_IN: [Int!]
              episodeNr_LT: Int
              episodeNr_LTE: Int
            }

            type StringAggregateSelection {
              longest: String
              shortest: String
            }

            type UpdateActorsMutationResponse {
              actors: [Actor!]!
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
            }

            type UpdateSeriesMutationResponse {
              info: UpdateInfo!
              series: [Series!]!
            }"
        `);
    });
});
