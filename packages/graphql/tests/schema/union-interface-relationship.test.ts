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
import { lexicographicSortSchema } from "graphql";
import { Neo4jGraphQL } from "../../src";

describe("Union Interface Relationships", () => {
    test("Union Interface Relationships", async () => {
        const typeDefs = /* GraphQL */ `
            type Movie @node {
                title: String!
                actors: [Actor!]! @relationship(type: "ACTED_IN", properties: "ActedIn", direction: IN)
                directors: [Director!]! @relationship(type: "DIRECTED", properties: "Directed", direction: IN)
                reviewers: [Reviewer!]! @relationship(type: "REVIEWED", properties: "Review", direction: IN)
                imdbId: Int @unique
            }

            type Actor @node {
                name: String!
                id: Int @unique
                movies: [Movie!]! @relationship(type: "ACTED_IN", properties: "ActedIn", direction: OUT)
            }

            type ActedIn @relationshipProperties {
                screenTime: Int!
            }

            type Directed @relationshipProperties {
                year: Int!
            }

            type Review @relationshipProperties {
                score: Int!
            }

            type Person implements Reviewer @node {
                name: String!
                reputation: Int!
                id: Int @unique
                reviewerId: Int @unique
                movies: [Movie!]! @relationship(type: "REVIEWED", direction: OUT, properties: "Review")
            }

            type Influencer implements Reviewer @node {
                reputation: Int!
                url: String!
                reviewerId: Int
            }

            union Director = Person | Actor

            interface Reviewer {
                reputation: Int!
                reviewerId: Int
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
            * Actor.movies
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
              id: Int
              movies(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: MovieOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [MovieSort!], where: MovieWhere): [Movie!]!
              moviesAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: MovieWhere): ActorMovieMoviesAggregationSelection
              moviesConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [ActorMoviesConnectionSort!], where: ActorMoviesConnectionWhere): ActorMoviesConnection!
              name: String!
            }

            type ActorAggregateSelection {
              count: Int!
              id: IntAggregateSelection!
              name: StringAggregateSelection!
            }

            input ActorConnectInput {
              movies: [ActorMoviesConnectFieldInput!]
            }

            input ActorConnectOrCreateWhere {
              node: ActorUniqueWhere!
            }

            input ActorConnectWhere {
              node: ActorWhere!
            }

            input ActorCreateInput {
              id: Int
              movies: ActorMoviesFieldInput
              name: String!
            }

            input ActorDeleteInput {
              movies: [ActorMoviesDeleteFieldInput!]
            }

            input ActorDisconnectInput {
              movies: [ActorMoviesDisconnectFieldInput!]
            }

            type ActorEdge {
              cursor: String!
              node: Actor!
            }

            type ActorMovieMoviesAggregationSelection {
              count: Int!
              edge: ActorMovieMoviesEdgeAggregateSelection
              node: ActorMovieMoviesNodeAggregateSelection
            }

            type ActorMovieMoviesEdgeAggregateSelection {
              screenTime: IntAggregateSelection!
            }

            type ActorMovieMoviesNodeAggregateSelection {
              imdbId: IntAggregateSelection!
              title: StringAggregateSelection!
            }

            input ActorMoviesAggregateInput {
              AND: [ActorMoviesAggregateInput!]
              NOT: ActorMoviesAggregateInput
              OR: [ActorMoviesAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: ActedInAggregationWhereInput
              node: ActorMoviesNodeAggregationWhereInput
            }

            input ActorMoviesConnectFieldInput {
              connect: [MovieConnectInput!]
              edge: ActedInCreateInput!
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: MovieConnectWhere
            }

            input ActorMoviesConnectOrCreateFieldInput {
              onCreate: ActorMoviesConnectOrCreateFieldInputOnCreate!
              where: MovieConnectOrCreateWhere!
            }

            input ActorMoviesConnectOrCreateFieldInputOnCreate {
              edge: ActedInCreateInput!
              node: MovieOnCreateInput!
            }

            type ActorMoviesConnection {
              edges: [ActorMoviesRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input ActorMoviesConnectionSort {
              edge: ActedInSort
              node: MovieSort
            }

            input ActorMoviesConnectionWhere {
              AND: [ActorMoviesConnectionWhere!]
              NOT: ActorMoviesConnectionWhere
              OR: [ActorMoviesConnectionWhere!]
              edge: ActedInWhere
              node: MovieWhere
            }

            input ActorMoviesCreateFieldInput {
              edge: ActedInCreateInput!
              node: MovieCreateInput!
            }

            input ActorMoviesDeleteFieldInput {
              delete: MovieDeleteInput
              where: ActorMoviesConnectionWhere
            }

            input ActorMoviesDisconnectFieldInput {
              disconnect: MovieDisconnectInput
              where: ActorMoviesConnectionWhere
            }

            input ActorMoviesFieldInput {
              connect: [ActorMoviesConnectFieldInput!]
              connectOrCreate: [ActorMoviesConnectOrCreateFieldInput!] @deprecated(reason: \\"The connectOrCreate operation is deprecated and will be removed\\")
              create: [ActorMoviesCreateFieldInput!]
            }

            input ActorMoviesNodeAggregationWhereInput {
              AND: [ActorMoviesNodeAggregationWhereInput!]
              NOT: ActorMoviesNodeAggregationWhereInput
              OR: [ActorMoviesNodeAggregationWhereInput!]
              imdbId_AVERAGE_EQUAL: Float
              imdbId_AVERAGE_GT: Float
              imdbId_AVERAGE_GTE: Float
              imdbId_AVERAGE_LT: Float
              imdbId_AVERAGE_LTE: Float
              imdbId_MAX_EQUAL: Int
              imdbId_MAX_GT: Int
              imdbId_MAX_GTE: Int
              imdbId_MAX_LT: Int
              imdbId_MAX_LTE: Int
              imdbId_MIN_EQUAL: Int
              imdbId_MIN_GT: Int
              imdbId_MIN_GTE: Int
              imdbId_MIN_LT: Int
              imdbId_MIN_LTE: Int
              imdbId_SUM_EQUAL: Int
              imdbId_SUM_GT: Int
              imdbId_SUM_GTE: Int
              imdbId_SUM_LT: Int
              imdbId_SUM_LTE: Int
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

            type ActorMoviesRelationship {
              cursor: String!
              node: Movie!
              properties: ActedIn!
            }

            input ActorMoviesUpdateConnectionInput {
              edge: ActedInUpdateInput
              node: MovieUpdateInput
            }

            input ActorMoviesUpdateFieldInput {
              connect: [ActorMoviesConnectFieldInput!]
              connectOrCreate: [ActorMoviesConnectOrCreateFieldInput!]
              create: [ActorMoviesCreateFieldInput!]
              delete: [ActorMoviesDeleteFieldInput!]
              disconnect: [ActorMoviesDisconnectFieldInput!]
              update: ActorMoviesUpdateConnectionInput
              where: ActorMoviesConnectionWhere
            }

            input ActorOnCreateInput {
              id: Int
              name: String!
            }

            input ActorOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more ActorSort objects to sort Actors by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [ActorSort!]
            }

            \\"\\"\\"
            Fields to sort Actors by. The order in which sorts are applied is not guaranteed when specifying many fields in one ActorSort object.
            \\"\\"\\"
            input ActorSort {
              id: SortDirection
              name: SortDirection
            }

            input ActorUniqueWhere {
              id: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              id_EQ: Int
            }

            input ActorUpdateInput {
              id: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              id_DECREMENT: Int
              id_INCREMENT: Int
              id_SET: Int
              movies: [ActorMoviesUpdateFieldInput!]
              name: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              name_SET: String
            }

            input ActorWhere {
              AND: [ActorWhere!]
              NOT: ActorWhere
              OR: [ActorWhere!]
              id: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              id_EQ: Int
              id_GT: Int
              id_GTE: Int
              id_IN: [Int]
              id_LT: Int
              id_LTE: Int
              moviesAggregate: ActorMoviesAggregateInput
              \\"\\"\\"
              Return Actors where all of the related ActorMoviesConnections match this filter
              \\"\\"\\"
              moviesConnection_ALL: ActorMoviesConnectionWhere
              \\"\\"\\"
              Return Actors where none of the related ActorMoviesConnections match this filter
              \\"\\"\\"
              moviesConnection_NONE: ActorMoviesConnectionWhere
              \\"\\"\\"
              Return Actors where one of the related ActorMoviesConnections match this filter
              \\"\\"\\"
              moviesConnection_SINGLE: ActorMoviesConnectionWhere
              \\"\\"\\"
              Return Actors where some of the related ActorMoviesConnections match this filter
              \\"\\"\\"
              moviesConnection_SOME: ActorMoviesConnectionWhere
              \\"\\"\\"Return Actors where all of the related Movies match this filter\\"\\"\\"
              movies_ALL: MovieWhere
              \\"\\"\\"Return Actors where none of the related Movies match this filter\\"\\"\\"
              movies_NONE: MovieWhere
              \\"\\"\\"Return Actors where one of the related Movies match this filter\\"\\"\\"
              movies_SINGLE: MovieWhere
              \\"\\"\\"Return Actors where some of the related Movies match this filter\\"\\"\\"
              movies_SOME: MovieWhere
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

            type CreateInfluencersMutationResponse {
              influencers: [Influencer!]!
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

            type CreatePeopleMutationResponse {
              info: CreateInfo!
              people: [Person!]!
            }

            \\"\\"\\"
            Information about the number of nodes and relationships deleted during a delete mutation
            \\"\\"\\"
            type DeleteInfo {
              nodesDeleted: Int!
              relationshipsDeleted: Int!
            }

            \\"\\"\\"
            The edge properties for the following fields:
            * Movie.directors
            \\"\\"\\"
            type Directed {
              year: Int!
            }

            input DirectedCreateInput {
              year: Int!
            }

            input DirectedSort {
              year: SortDirection
            }

            input DirectedUpdateInput {
              year: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              year_DECREMENT: Int
              year_INCREMENT: Int
              year_SET: Int
            }

            input DirectedWhere {
              AND: [DirectedWhere!]
              NOT: DirectedWhere
              OR: [DirectedWhere!]
              year: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              year_EQ: Int
              year_GT: Int
              year_GTE: Int
              year_IN: [Int!]
              year_LT: Int
              year_LTE: Int
            }

            union Director = Actor | Person

            input DirectorWhere {
              Actor: ActorWhere
              Person: PersonWhere
            }

            type Influencer implements Reviewer {
              reputation: Int!
              reviewerId: Int
              url: String!
            }

            type InfluencerAggregateSelection {
              count: Int!
              reputation: IntAggregateSelection!
              reviewerId: IntAggregateSelection!
              url: StringAggregateSelection!
            }

            input InfluencerCreateInput {
              reputation: Int!
              reviewerId: Int
              url: String!
            }

            type InfluencerEdge {
              cursor: String!
              node: Influencer!
            }

            input InfluencerOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more InfluencerSort objects to sort Influencers by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [InfluencerSort!]
            }

            \\"\\"\\"
            Fields to sort Influencers by. The order in which sorts are applied is not guaranteed when specifying many fields in one InfluencerSort object.
            \\"\\"\\"
            input InfluencerSort {
              reputation: SortDirection
              reviewerId: SortDirection
              url: SortDirection
            }

            input InfluencerUpdateInput {
              reputation: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              reputation_DECREMENT: Int
              reputation_INCREMENT: Int
              reputation_SET: Int
              reviewerId: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              reviewerId_DECREMENT: Int
              reviewerId_INCREMENT: Int
              reviewerId_SET: Int
              url: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              url_SET: String
            }

            input InfluencerWhere {
              AND: [InfluencerWhere!]
              NOT: InfluencerWhere
              OR: [InfluencerWhere!]
              reputation: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              reputation_EQ: Int
              reputation_GT: Int
              reputation_GTE: Int
              reputation_IN: [Int!]
              reputation_LT: Int
              reputation_LTE: Int
              reviewerId: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              reviewerId_EQ: Int
              reviewerId_GT: Int
              reviewerId_GTE: Int
              reviewerId_IN: [Int]
              reviewerId_LT: Int
              reviewerId_LTE: Int
              url: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              url_CONTAINS: String
              url_ENDS_WITH: String
              url_EQ: String
              url_IN: [String!]
              url_STARTS_WITH: String
            }

            type InfluencersConnection {
              edges: [InfluencerEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type IntAggregateSelection {
              average: Float
              max: Int
              min: Int
              sum: Int
            }

            type Movie {
              actors(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: ActorOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ActorSort!], where: ActorWhere): [Actor!]!
              actorsAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: ActorWhere): MovieActorActorsAggregationSelection
              actorsConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [MovieActorsConnectionSort!], where: MovieActorsConnectionWhere): MovieActorsConnection!
              directors(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: QueryOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), where: DirectorWhere): [Director!]!
              directorsConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [MovieDirectorsConnectionSort!], where: MovieDirectorsConnectionWhere): MovieDirectorsConnection!
              imdbId: Int
              reviewers(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: ReviewerOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ReviewerSort!], where: ReviewerWhere): [Reviewer!]!
              reviewersAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: ReviewerWhere): MovieReviewerReviewersAggregationSelection
              reviewersConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [MovieReviewersConnectionSort!], where: MovieReviewersConnectionWhere): MovieReviewersConnection!
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
              id: IntAggregateSelection!
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

            input MovieActorsConnectOrCreateFieldInput {
              onCreate: MovieActorsConnectOrCreateFieldInputOnCreate!
              where: ActorConnectOrCreateWhere!
            }

            input MovieActorsConnectOrCreateFieldInputOnCreate {
              edge: ActedInCreateInput!
              node: ActorOnCreateInput!
            }

            type MovieActorsConnection {
              edges: [MovieActorsRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input MovieActorsConnectionSort {
              edge: ActedInSort
              node: ActorSort
            }

            input MovieActorsConnectionWhere {
              AND: [MovieActorsConnectionWhere!]
              NOT: MovieActorsConnectionWhere
              OR: [MovieActorsConnectionWhere!]
              edge: ActedInWhere
              node: ActorWhere
            }

            input MovieActorsCreateFieldInput {
              edge: ActedInCreateInput!
              node: ActorCreateInput!
            }

            input MovieActorsDeleteFieldInput {
              delete: ActorDeleteInput
              where: MovieActorsConnectionWhere
            }

            input MovieActorsDisconnectFieldInput {
              disconnect: ActorDisconnectInput
              where: MovieActorsConnectionWhere
            }

            input MovieActorsFieldInput {
              connect: [MovieActorsConnectFieldInput!]
              connectOrCreate: [MovieActorsConnectOrCreateFieldInput!] @deprecated(reason: \\"The connectOrCreate operation is deprecated and will be removed\\")
              create: [MovieActorsCreateFieldInput!]
            }

            input MovieActorsNodeAggregationWhereInput {
              AND: [MovieActorsNodeAggregationWhereInput!]
              NOT: MovieActorsNodeAggregationWhereInput
              OR: [MovieActorsNodeAggregationWhereInput!]
              id_AVERAGE_EQUAL: Float
              id_AVERAGE_GT: Float
              id_AVERAGE_GTE: Float
              id_AVERAGE_LT: Float
              id_AVERAGE_LTE: Float
              id_MAX_EQUAL: Int
              id_MAX_GT: Int
              id_MAX_GTE: Int
              id_MAX_LT: Int
              id_MAX_LTE: Int
              id_MIN_EQUAL: Int
              id_MIN_GT: Int
              id_MIN_GTE: Int
              id_MIN_LT: Int
              id_MIN_LTE: Int
              id_SUM_EQUAL: Int
              id_SUM_GT: Int
              id_SUM_GTE: Int
              id_SUM_LT: Int
              id_SUM_LTE: Int
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

            type MovieActorsRelationship {
              cursor: String!
              node: Actor!
              properties: ActedIn!
            }

            input MovieActorsUpdateConnectionInput {
              edge: ActedInUpdateInput
              node: ActorUpdateInput
            }

            input MovieActorsUpdateFieldInput {
              connect: [MovieActorsConnectFieldInput!]
              connectOrCreate: [MovieActorsConnectOrCreateFieldInput!]
              create: [MovieActorsCreateFieldInput!]
              delete: [MovieActorsDeleteFieldInput!]
              disconnect: [MovieActorsDisconnectFieldInput!]
              update: MovieActorsUpdateConnectionInput
              where: MovieActorsConnectionWhere
            }

            type MovieAggregateSelection {
              count: Int!
              imdbId: IntAggregateSelection!
              title: StringAggregateSelection!
            }

            input MovieConnectInput {
              actors: [MovieActorsConnectFieldInput!]
              directors: MovieDirectorsConnectInput
              reviewers: [MovieReviewersConnectFieldInput!]
            }

            input MovieConnectOrCreateWhere {
              node: MovieUniqueWhere!
            }

            input MovieConnectWhere {
              node: MovieWhere!
            }

            input MovieCreateInput {
              actors: MovieActorsFieldInput
              directors: MovieDirectorsCreateInput
              imdbId: Int
              reviewers: MovieReviewersFieldInput
              title: String!
            }

            input MovieDeleteInput {
              actors: [MovieActorsDeleteFieldInput!]
              directors: MovieDirectorsDeleteInput
              reviewers: [MovieReviewersDeleteFieldInput!]
            }

            input MovieDirectorsActorConnectFieldInput {
              connect: [ActorConnectInput!]
              edge: DirectedCreateInput!
              where: ActorConnectWhere
            }

            input MovieDirectorsActorConnectOrCreateFieldInput {
              onCreate: MovieDirectorsActorConnectOrCreateFieldInputOnCreate!
              where: ActorConnectOrCreateWhere!
            }

            input MovieDirectorsActorConnectOrCreateFieldInputOnCreate {
              edge: DirectedCreateInput!
              node: ActorOnCreateInput!
            }

            input MovieDirectorsActorConnectionWhere {
              AND: [MovieDirectorsActorConnectionWhere!]
              NOT: MovieDirectorsActorConnectionWhere
              OR: [MovieDirectorsActorConnectionWhere!]
              edge: DirectedWhere
              node: ActorWhere
            }

            input MovieDirectorsActorCreateFieldInput {
              edge: DirectedCreateInput!
              node: ActorCreateInput!
            }

            input MovieDirectorsActorDeleteFieldInput {
              delete: ActorDeleteInput
              where: MovieDirectorsActorConnectionWhere
            }

            input MovieDirectorsActorDisconnectFieldInput {
              disconnect: ActorDisconnectInput
              where: MovieDirectorsActorConnectionWhere
            }

            input MovieDirectorsActorFieldInput {
              connect: [MovieDirectorsActorConnectFieldInput!]
              connectOrCreate: [MovieDirectorsActorConnectOrCreateFieldInput!] @deprecated(reason: \\"The connectOrCreate operation is deprecated and will be removed\\")
              create: [MovieDirectorsActorCreateFieldInput!]
            }

            input MovieDirectorsActorUpdateConnectionInput {
              edge: DirectedUpdateInput
              node: ActorUpdateInput
            }

            input MovieDirectorsActorUpdateFieldInput {
              connect: [MovieDirectorsActorConnectFieldInput!]
              connectOrCreate: [MovieDirectorsActorConnectOrCreateFieldInput!]
              create: [MovieDirectorsActorCreateFieldInput!]
              delete: [MovieDirectorsActorDeleteFieldInput!]
              disconnect: [MovieDirectorsActorDisconnectFieldInput!]
              update: MovieDirectorsActorUpdateConnectionInput
              where: MovieDirectorsActorConnectionWhere
            }

            input MovieDirectorsConnectInput {
              Actor: [MovieDirectorsActorConnectFieldInput!]
              Person: [MovieDirectorsPersonConnectFieldInput!]
            }

            type MovieDirectorsConnection {
              edges: [MovieDirectorsRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input MovieDirectorsConnectionSort {
              edge: DirectedSort
            }

            input MovieDirectorsConnectionWhere {
              Actor: MovieDirectorsActorConnectionWhere
              Person: MovieDirectorsPersonConnectionWhere
            }

            input MovieDirectorsCreateInput {
              Actor: MovieDirectorsActorFieldInput
              Person: MovieDirectorsPersonFieldInput
            }

            input MovieDirectorsDeleteInput {
              Actor: [MovieDirectorsActorDeleteFieldInput!]
              Person: [MovieDirectorsPersonDeleteFieldInput!]
            }

            input MovieDirectorsDisconnectInput {
              Actor: [MovieDirectorsActorDisconnectFieldInput!]
              Person: [MovieDirectorsPersonDisconnectFieldInput!]
            }

            input MovieDirectorsPersonConnectFieldInput {
              connect: [PersonConnectInput!]
              edge: DirectedCreateInput!
              where: PersonConnectWhere
            }

            input MovieDirectorsPersonConnectOrCreateFieldInput {
              onCreate: MovieDirectorsPersonConnectOrCreateFieldInputOnCreate!
              where: PersonConnectOrCreateWhere!
            }

            input MovieDirectorsPersonConnectOrCreateFieldInputOnCreate {
              edge: DirectedCreateInput!
              node: PersonOnCreateInput!
            }

            input MovieDirectorsPersonConnectionWhere {
              AND: [MovieDirectorsPersonConnectionWhere!]
              NOT: MovieDirectorsPersonConnectionWhere
              OR: [MovieDirectorsPersonConnectionWhere!]
              edge: DirectedWhere
              node: PersonWhere
            }

            input MovieDirectorsPersonCreateFieldInput {
              edge: DirectedCreateInput!
              node: PersonCreateInput!
            }

            input MovieDirectorsPersonDeleteFieldInput {
              delete: PersonDeleteInput
              where: MovieDirectorsPersonConnectionWhere
            }

            input MovieDirectorsPersonDisconnectFieldInput {
              disconnect: PersonDisconnectInput
              where: MovieDirectorsPersonConnectionWhere
            }

            input MovieDirectorsPersonFieldInput {
              connect: [MovieDirectorsPersonConnectFieldInput!]
              connectOrCreate: [MovieDirectorsPersonConnectOrCreateFieldInput!] @deprecated(reason: \\"The connectOrCreate operation is deprecated and will be removed\\")
              create: [MovieDirectorsPersonCreateFieldInput!]
            }

            input MovieDirectorsPersonUpdateConnectionInput {
              edge: DirectedUpdateInput
              node: PersonUpdateInput
            }

            input MovieDirectorsPersonUpdateFieldInput {
              connect: [MovieDirectorsPersonConnectFieldInput!]
              connectOrCreate: [MovieDirectorsPersonConnectOrCreateFieldInput!]
              create: [MovieDirectorsPersonCreateFieldInput!]
              delete: [MovieDirectorsPersonDeleteFieldInput!]
              disconnect: [MovieDirectorsPersonDisconnectFieldInput!]
              update: MovieDirectorsPersonUpdateConnectionInput
              where: MovieDirectorsPersonConnectionWhere
            }

            type MovieDirectorsRelationship {
              cursor: String!
              node: Director!
              properties: Directed!
            }

            input MovieDirectorsUpdateInput {
              Actor: [MovieDirectorsActorUpdateFieldInput!]
              Person: [MovieDirectorsPersonUpdateFieldInput!]
            }

            input MovieDisconnectInput {
              actors: [MovieActorsDisconnectFieldInput!]
              directors: MovieDirectorsDisconnectInput
              reviewers: [MovieReviewersDisconnectFieldInput!]
            }

            type MovieEdge {
              cursor: String!
              node: Movie!
            }

            input MovieOnCreateInput {
              imdbId: Int
              title: String!
            }

            input MovieOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more MovieSort objects to sort Movies by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [MovieSort!]
            }

            type MovieReviewerReviewersAggregationSelection {
              count: Int!
              edge: MovieReviewerReviewersEdgeAggregateSelection
              node: MovieReviewerReviewersNodeAggregateSelection
            }

            type MovieReviewerReviewersEdgeAggregateSelection {
              score: IntAggregateSelection!
            }

            type MovieReviewerReviewersNodeAggregateSelection {
              reputation: IntAggregateSelection!
              reviewerId: IntAggregateSelection!
            }

            input MovieReviewersAggregateInput {
              AND: [MovieReviewersAggregateInput!]
              NOT: MovieReviewersAggregateInput
              OR: [MovieReviewersAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: ReviewAggregationWhereInput
              node: MovieReviewersNodeAggregationWhereInput
            }

            input MovieReviewersConnectFieldInput {
              edge: ReviewCreateInput!
              where: ReviewerConnectWhere
            }

            type MovieReviewersConnection {
              edges: [MovieReviewersRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input MovieReviewersConnectionSort {
              edge: ReviewSort
              node: ReviewerSort
            }

            input MovieReviewersConnectionWhere {
              AND: [MovieReviewersConnectionWhere!]
              NOT: MovieReviewersConnectionWhere
              OR: [MovieReviewersConnectionWhere!]
              edge: ReviewWhere
              node: ReviewerWhere
            }

            input MovieReviewersCreateFieldInput {
              edge: ReviewCreateInput!
              node: ReviewerCreateInput!
            }

            input MovieReviewersDeleteFieldInput {
              where: MovieReviewersConnectionWhere
            }

            input MovieReviewersDisconnectFieldInput {
              where: MovieReviewersConnectionWhere
            }

            input MovieReviewersFieldInput {
              connect: [MovieReviewersConnectFieldInput!]
              create: [MovieReviewersCreateFieldInput!]
            }

            input MovieReviewersNodeAggregationWhereInput {
              AND: [MovieReviewersNodeAggregationWhereInput!]
              NOT: MovieReviewersNodeAggregationWhereInput
              OR: [MovieReviewersNodeAggregationWhereInput!]
              reputation_AVERAGE_EQUAL: Float
              reputation_AVERAGE_GT: Float
              reputation_AVERAGE_GTE: Float
              reputation_AVERAGE_LT: Float
              reputation_AVERAGE_LTE: Float
              reputation_MAX_EQUAL: Int
              reputation_MAX_GT: Int
              reputation_MAX_GTE: Int
              reputation_MAX_LT: Int
              reputation_MAX_LTE: Int
              reputation_MIN_EQUAL: Int
              reputation_MIN_GT: Int
              reputation_MIN_GTE: Int
              reputation_MIN_LT: Int
              reputation_MIN_LTE: Int
              reputation_SUM_EQUAL: Int
              reputation_SUM_GT: Int
              reputation_SUM_GTE: Int
              reputation_SUM_LT: Int
              reputation_SUM_LTE: Int
              reviewerId_AVERAGE_EQUAL: Float
              reviewerId_AVERAGE_GT: Float
              reviewerId_AVERAGE_GTE: Float
              reviewerId_AVERAGE_LT: Float
              reviewerId_AVERAGE_LTE: Float
              reviewerId_MAX_EQUAL: Int
              reviewerId_MAX_GT: Int
              reviewerId_MAX_GTE: Int
              reviewerId_MAX_LT: Int
              reviewerId_MAX_LTE: Int
              reviewerId_MIN_EQUAL: Int
              reviewerId_MIN_GT: Int
              reviewerId_MIN_GTE: Int
              reviewerId_MIN_LT: Int
              reviewerId_MIN_LTE: Int
              reviewerId_SUM_EQUAL: Int
              reviewerId_SUM_GT: Int
              reviewerId_SUM_GTE: Int
              reviewerId_SUM_LT: Int
              reviewerId_SUM_LTE: Int
            }

            type MovieReviewersRelationship {
              cursor: String!
              node: Reviewer!
              properties: Review!
            }

            input MovieReviewersUpdateConnectionInput {
              edge: ReviewUpdateInput
              node: ReviewerUpdateInput
            }

            input MovieReviewersUpdateFieldInput {
              connect: [MovieReviewersConnectFieldInput!]
              create: [MovieReviewersCreateFieldInput!]
              delete: [MovieReviewersDeleteFieldInput!]
              disconnect: [MovieReviewersDisconnectFieldInput!]
              update: MovieReviewersUpdateConnectionInput
              where: MovieReviewersConnectionWhere
            }

            \\"\\"\\"
            Fields to sort Movies by. The order in which sorts are applied is not guaranteed when specifying many fields in one MovieSort object.
            \\"\\"\\"
            input MovieSort {
              imdbId: SortDirection
              title: SortDirection
            }

            input MovieUniqueWhere {
              imdbId: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              imdbId_EQ: Int
            }

            input MovieUpdateInput {
              actors: [MovieActorsUpdateFieldInput!]
              directors: MovieDirectorsUpdateInput
              imdbId: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              imdbId_DECREMENT: Int
              imdbId_INCREMENT: Int
              imdbId_SET: Int
              reviewers: [MovieReviewersUpdateFieldInput!]
              title: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              title_SET: String
            }

            input MovieWhere {
              AND: [MovieWhere!]
              NOT: MovieWhere
              OR: [MovieWhere!]
              actorsAggregate: MovieActorsAggregateInput
              \\"\\"\\"
              Return Movies where all of the related MovieActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_ALL: MovieActorsConnectionWhere
              \\"\\"\\"
              Return Movies where none of the related MovieActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_NONE: MovieActorsConnectionWhere
              \\"\\"\\"
              Return Movies where one of the related MovieActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_SINGLE: MovieActorsConnectionWhere
              \\"\\"\\"
              Return Movies where some of the related MovieActorsConnections match this filter
              \\"\\"\\"
              actorsConnection_SOME: MovieActorsConnectionWhere
              \\"\\"\\"Return Movies where all of the related Actors match this filter\\"\\"\\"
              actors_ALL: ActorWhere
              \\"\\"\\"Return Movies where none of the related Actors match this filter\\"\\"\\"
              actors_NONE: ActorWhere
              \\"\\"\\"Return Movies where one of the related Actors match this filter\\"\\"\\"
              actors_SINGLE: ActorWhere
              \\"\\"\\"Return Movies where some of the related Actors match this filter\\"\\"\\"
              actors_SOME: ActorWhere
              \\"\\"\\"
              Return Movies where all of the related MovieDirectorsConnections match this filter
              \\"\\"\\"
              directorsConnection_ALL: MovieDirectorsConnectionWhere
              \\"\\"\\"
              Return Movies where none of the related MovieDirectorsConnections match this filter
              \\"\\"\\"
              directorsConnection_NONE: MovieDirectorsConnectionWhere
              \\"\\"\\"
              Return Movies where one of the related MovieDirectorsConnections match this filter
              \\"\\"\\"
              directorsConnection_SINGLE: MovieDirectorsConnectionWhere
              \\"\\"\\"
              Return Movies where some of the related MovieDirectorsConnections match this filter
              \\"\\"\\"
              directorsConnection_SOME: MovieDirectorsConnectionWhere
              \\"\\"\\"Return Movies where all of the related Directors match this filter\\"\\"\\"
              directors_ALL: DirectorWhere
              \\"\\"\\"Return Movies where none of the related Directors match this filter\\"\\"\\"
              directors_NONE: DirectorWhere
              \\"\\"\\"Return Movies where one of the related Directors match this filter\\"\\"\\"
              directors_SINGLE: DirectorWhere
              \\"\\"\\"Return Movies where some of the related Directors match this filter\\"\\"\\"
              directors_SOME: DirectorWhere
              imdbId: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              imdbId_EQ: Int
              imdbId_GT: Int
              imdbId_GTE: Int
              imdbId_IN: [Int]
              imdbId_LT: Int
              imdbId_LTE: Int
              reviewersAggregate: MovieReviewersAggregateInput
              \\"\\"\\"
              Return Movies where all of the related MovieReviewersConnections match this filter
              \\"\\"\\"
              reviewersConnection_ALL: MovieReviewersConnectionWhere
              \\"\\"\\"
              Return Movies where none of the related MovieReviewersConnections match this filter
              \\"\\"\\"
              reviewersConnection_NONE: MovieReviewersConnectionWhere
              \\"\\"\\"
              Return Movies where one of the related MovieReviewersConnections match this filter
              \\"\\"\\"
              reviewersConnection_SINGLE: MovieReviewersConnectionWhere
              \\"\\"\\"
              Return Movies where some of the related MovieReviewersConnections match this filter
              \\"\\"\\"
              reviewersConnection_SOME: MovieReviewersConnectionWhere
              \\"\\"\\"Return Movies where all of the related Reviewers match this filter\\"\\"\\"
              reviewers_ALL: ReviewerWhere
              \\"\\"\\"Return Movies where none of the related Reviewers match this filter\\"\\"\\"
              reviewers_NONE: ReviewerWhere
              \\"\\"\\"Return Movies where one of the related Reviewers match this filter\\"\\"\\"
              reviewers_SINGLE: ReviewerWhere
              \\"\\"\\"Return Movies where some of the related Reviewers match this filter\\"\\"\\"
              reviewers_SOME: ReviewerWhere
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
              createInfluencers(input: [InfluencerCreateInput!]!): CreateInfluencersMutationResponse!
              createMovies(input: [MovieCreateInput!]!): CreateMoviesMutationResponse!
              createPeople(input: [PersonCreateInput!]!): CreatePeopleMutationResponse!
              deleteActors(delete: ActorDeleteInput, where: ActorWhere): DeleteInfo!
              deleteInfluencers(where: InfluencerWhere): DeleteInfo!
              deleteMovies(delete: MovieDeleteInput, where: MovieWhere): DeleteInfo!
              deletePeople(delete: PersonDeleteInput, where: PersonWhere): DeleteInfo!
              updateActors(update: ActorUpdateInput, where: ActorWhere): UpdateActorsMutationResponse!
              updateInfluencers(update: InfluencerUpdateInput, where: InfluencerWhere): UpdateInfluencersMutationResponse!
              updateMovies(update: MovieUpdateInput, where: MovieWhere): UpdateMoviesMutationResponse!
              updatePeople(update: PersonUpdateInput, where: PersonWhere): UpdatePeopleMutationResponse!
            }

            \\"\\"\\"Pagination information (Relay)\\"\\"\\"
            type PageInfo {
              endCursor: String
              hasNextPage: Boolean!
              hasPreviousPage: Boolean!
              startCursor: String
            }

            type PeopleConnection {
              edges: [PersonEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            type Person implements Reviewer {
              id: Int
              movies(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), limit: Int, offset: Int, options: MovieOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [MovieSort!], where: MovieWhere): [Movie!]!
              moviesAggregate(directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), where: MovieWhere): PersonMovieMoviesAggregationSelection
              moviesConnection(after: String, directed: Boolean = true @deprecated(reason: \\"The directed argument is deprecated, and the direction of the field will be configured in the GraphQL server\\"), first: Int, sort: [PersonMoviesConnectionSort!], where: PersonMoviesConnectionWhere): PersonMoviesConnection!
              name: String!
              reputation: Int!
              reviewerId: Int
            }

            type PersonAggregateSelection {
              count: Int!
              id: IntAggregateSelection!
              name: StringAggregateSelection!
              reputation: IntAggregateSelection!
              reviewerId: IntAggregateSelection!
            }

            input PersonConnectInput {
              movies: [PersonMoviesConnectFieldInput!]
            }

            input PersonConnectOrCreateWhere {
              node: PersonUniqueWhere!
            }

            input PersonConnectWhere {
              node: PersonWhere!
            }

            input PersonCreateInput {
              id: Int
              movies: PersonMoviesFieldInput
              name: String!
              reputation: Int!
              reviewerId: Int
            }

            input PersonDeleteInput {
              movies: [PersonMoviesDeleteFieldInput!]
            }

            input PersonDisconnectInput {
              movies: [PersonMoviesDisconnectFieldInput!]
            }

            type PersonEdge {
              cursor: String!
              node: Person!
            }

            type PersonMovieMoviesAggregationSelection {
              count: Int!
              edge: PersonMovieMoviesEdgeAggregateSelection
              node: PersonMovieMoviesNodeAggregateSelection
            }

            type PersonMovieMoviesEdgeAggregateSelection {
              score: IntAggregateSelection!
            }

            type PersonMovieMoviesNodeAggregateSelection {
              imdbId: IntAggregateSelection!
              title: StringAggregateSelection!
            }

            input PersonMoviesAggregateInput {
              AND: [PersonMoviesAggregateInput!]
              NOT: PersonMoviesAggregateInput
              OR: [PersonMoviesAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: ReviewAggregationWhereInput
              node: PersonMoviesNodeAggregationWhereInput
            }

            input PersonMoviesConnectFieldInput {
              connect: [MovieConnectInput!]
              edge: ReviewCreateInput!
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: MovieConnectWhere
            }

            input PersonMoviesConnectOrCreateFieldInput {
              onCreate: PersonMoviesConnectOrCreateFieldInputOnCreate!
              where: MovieConnectOrCreateWhere!
            }

            input PersonMoviesConnectOrCreateFieldInputOnCreate {
              edge: ReviewCreateInput!
              node: MovieOnCreateInput!
            }

            type PersonMoviesConnection {
              edges: [PersonMoviesRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input PersonMoviesConnectionSort {
              edge: ReviewSort
              node: MovieSort
            }

            input PersonMoviesConnectionWhere {
              AND: [PersonMoviesConnectionWhere!]
              NOT: PersonMoviesConnectionWhere
              OR: [PersonMoviesConnectionWhere!]
              edge: ReviewWhere
              node: MovieWhere
            }

            input PersonMoviesCreateFieldInput {
              edge: ReviewCreateInput!
              node: MovieCreateInput!
            }

            input PersonMoviesDeleteFieldInput {
              delete: MovieDeleteInput
              where: PersonMoviesConnectionWhere
            }

            input PersonMoviesDisconnectFieldInput {
              disconnect: MovieDisconnectInput
              where: PersonMoviesConnectionWhere
            }

            input PersonMoviesFieldInput {
              connect: [PersonMoviesConnectFieldInput!]
              connectOrCreate: [PersonMoviesConnectOrCreateFieldInput!] @deprecated(reason: \\"The connectOrCreate operation is deprecated and will be removed\\")
              create: [PersonMoviesCreateFieldInput!]
            }

            input PersonMoviesNodeAggregationWhereInput {
              AND: [PersonMoviesNodeAggregationWhereInput!]
              NOT: PersonMoviesNodeAggregationWhereInput
              OR: [PersonMoviesNodeAggregationWhereInput!]
              imdbId_AVERAGE_EQUAL: Float
              imdbId_AVERAGE_GT: Float
              imdbId_AVERAGE_GTE: Float
              imdbId_AVERAGE_LT: Float
              imdbId_AVERAGE_LTE: Float
              imdbId_MAX_EQUAL: Int
              imdbId_MAX_GT: Int
              imdbId_MAX_GTE: Int
              imdbId_MAX_LT: Int
              imdbId_MAX_LTE: Int
              imdbId_MIN_EQUAL: Int
              imdbId_MIN_GT: Int
              imdbId_MIN_GTE: Int
              imdbId_MIN_LT: Int
              imdbId_MIN_LTE: Int
              imdbId_SUM_EQUAL: Int
              imdbId_SUM_GT: Int
              imdbId_SUM_GTE: Int
              imdbId_SUM_LT: Int
              imdbId_SUM_LTE: Int
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

            type PersonMoviesRelationship {
              cursor: String!
              node: Movie!
              properties: Review!
            }

            input PersonMoviesUpdateConnectionInput {
              edge: ReviewUpdateInput
              node: MovieUpdateInput
            }

            input PersonMoviesUpdateFieldInput {
              connect: [PersonMoviesConnectFieldInput!]
              connectOrCreate: [PersonMoviesConnectOrCreateFieldInput!]
              create: [PersonMoviesCreateFieldInput!]
              delete: [PersonMoviesDeleteFieldInput!]
              disconnect: [PersonMoviesDisconnectFieldInput!]
              update: PersonMoviesUpdateConnectionInput
              where: PersonMoviesConnectionWhere
            }

            input PersonOnCreateInput {
              id: Int
              name: String!
              reputation: Int!
              reviewerId: Int
            }

            input PersonOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more PersonSort objects to sort People by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [PersonSort!]
            }

            \\"\\"\\"
            Fields to sort People by. The order in which sorts are applied is not guaranteed when specifying many fields in one PersonSort object.
            \\"\\"\\"
            input PersonSort {
              id: SortDirection
              name: SortDirection
              reputation: SortDirection
              reviewerId: SortDirection
            }

            input PersonUniqueWhere {
              id: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              id_EQ: Int
              reviewerId: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              reviewerId_EQ: Int
            }

            input PersonUpdateInput {
              id: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              id_DECREMENT: Int
              id_INCREMENT: Int
              id_SET: Int
              movies: [PersonMoviesUpdateFieldInput!]
              name: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              name_SET: String
              reputation: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              reputation_DECREMENT: Int
              reputation_INCREMENT: Int
              reputation_SET: Int
              reviewerId: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              reviewerId_DECREMENT: Int
              reviewerId_INCREMENT: Int
              reviewerId_SET: Int
            }

            input PersonWhere {
              AND: [PersonWhere!]
              NOT: PersonWhere
              OR: [PersonWhere!]
              id: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              id_EQ: Int
              id_GT: Int
              id_GTE: Int
              id_IN: [Int]
              id_LT: Int
              id_LTE: Int
              moviesAggregate: PersonMoviesAggregateInput
              \\"\\"\\"
              Return People where all of the related PersonMoviesConnections match this filter
              \\"\\"\\"
              moviesConnection_ALL: PersonMoviesConnectionWhere
              \\"\\"\\"
              Return People where none of the related PersonMoviesConnections match this filter
              \\"\\"\\"
              moviesConnection_NONE: PersonMoviesConnectionWhere
              \\"\\"\\"
              Return People where one of the related PersonMoviesConnections match this filter
              \\"\\"\\"
              moviesConnection_SINGLE: PersonMoviesConnectionWhere
              \\"\\"\\"
              Return People where some of the related PersonMoviesConnections match this filter
              \\"\\"\\"
              moviesConnection_SOME: PersonMoviesConnectionWhere
              \\"\\"\\"Return People where all of the related Movies match this filter\\"\\"\\"
              movies_ALL: MovieWhere
              \\"\\"\\"Return People where none of the related Movies match this filter\\"\\"\\"
              movies_NONE: MovieWhere
              \\"\\"\\"Return People where one of the related Movies match this filter\\"\\"\\"
              movies_SINGLE: MovieWhere
              \\"\\"\\"Return People where some of the related Movies match this filter\\"\\"\\"
              movies_SOME: MovieWhere
              name: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              name_CONTAINS: String
              name_ENDS_WITH: String
              name_EQ: String
              name_IN: [String!]
              name_STARTS_WITH: String
              reputation: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              reputation_EQ: Int
              reputation_GT: Int
              reputation_GTE: Int
              reputation_IN: [Int!]
              reputation_LT: Int
              reputation_LTE: Int
              reviewerId: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              reviewerId_EQ: Int
              reviewerId_GT: Int
              reviewerId_GTE: Int
              reviewerId_IN: [Int]
              reviewerId_LT: Int
              reviewerId_LTE: Int
            }

            type Query {
              actors(limit: Int, offset: Int, options: ActorOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ActorSort!], where: ActorWhere): [Actor!]!
              actorsAggregate(where: ActorWhere): ActorAggregateSelection!
              actorsConnection(after: String, first: Int, sort: [ActorSort!], where: ActorWhere): ActorsConnection!
              directors(limit: Int, offset: Int, options: QueryOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), where: DirectorWhere): [Director!]!
              influencers(limit: Int, offset: Int, options: InfluencerOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [InfluencerSort!], where: InfluencerWhere): [Influencer!]!
              influencersAggregate(where: InfluencerWhere): InfluencerAggregateSelection!
              influencersConnection(after: String, first: Int, sort: [InfluencerSort!], where: InfluencerWhere): InfluencersConnection!
              movies(limit: Int, offset: Int, options: MovieOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [MovieSort!], where: MovieWhere): [Movie!]!
              moviesAggregate(where: MovieWhere): MovieAggregateSelection!
              moviesConnection(after: String, first: Int, sort: [MovieSort!], where: MovieWhere): MoviesConnection!
              people(limit: Int, offset: Int, options: PersonOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [PersonSort!], where: PersonWhere): [Person!]!
              peopleAggregate(where: PersonWhere): PersonAggregateSelection!
              peopleConnection(after: String, first: Int, sort: [PersonSort!], where: PersonWhere): PeopleConnection!
              reviewers(limit: Int, offset: Int, options: ReviewerOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [ReviewerSort!], where: ReviewerWhere): [Reviewer!]!
              reviewersAggregate(where: ReviewerWhere): ReviewerAggregateSelection!
              reviewersConnection(after: String, first: Int, sort: [ReviewerSort!], where: ReviewerWhere): ReviewersConnection!
            }

            \\"\\"\\"Input type for options that can be specified on a query operation.\\"\\"\\"
            input QueryOptions {
              limit: Int
              offset: Int
            }

            \\"\\"\\"
            The edge properties for the following fields:
            * Movie.reviewers
            * Person.movies
            \\"\\"\\"
            type Review {
              score: Int!
            }

            input ReviewAggregationWhereInput {
              AND: [ReviewAggregationWhereInput!]
              NOT: ReviewAggregationWhereInput
              OR: [ReviewAggregationWhereInput!]
              score_AVERAGE_EQUAL: Float
              score_AVERAGE_GT: Float
              score_AVERAGE_GTE: Float
              score_AVERAGE_LT: Float
              score_AVERAGE_LTE: Float
              score_MAX_EQUAL: Int
              score_MAX_GT: Int
              score_MAX_GTE: Int
              score_MAX_LT: Int
              score_MAX_LTE: Int
              score_MIN_EQUAL: Int
              score_MIN_GT: Int
              score_MIN_GTE: Int
              score_MIN_LT: Int
              score_MIN_LTE: Int
              score_SUM_EQUAL: Int
              score_SUM_GT: Int
              score_SUM_GTE: Int
              score_SUM_LT: Int
              score_SUM_LTE: Int
            }

            input ReviewCreateInput {
              score: Int!
            }

            input ReviewSort {
              score: SortDirection
            }

            input ReviewUpdateInput {
              score: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              score_DECREMENT: Int
              score_INCREMENT: Int
              score_SET: Int
            }

            input ReviewWhere {
              AND: [ReviewWhere!]
              NOT: ReviewWhere
              OR: [ReviewWhere!]
              score: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              score_EQ: Int
              score_GT: Int
              score_GTE: Int
              score_IN: [Int!]
              score_LT: Int
              score_LTE: Int
            }

            interface Reviewer {
              reputation: Int!
              reviewerId: Int
            }

            type ReviewerAggregateSelection {
              count: Int!
              reputation: IntAggregateSelection!
              reviewerId: IntAggregateSelection!
            }

            input ReviewerConnectWhere {
              node: ReviewerWhere!
            }

            input ReviewerCreateInput {
              Influencer: InfluencerCreateInput
              Person: PersonCreateInput
            }

            type ReviewerEdge {
              cursor: String!
              node: Reviewer!
            }

            enum ReviewerImplementation {
              Influencer
              Person
            }

            input ReviewerOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more ReviewerSort objects to sort Reviewers by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [ReviewerSort!]
            }

            \\"\\"\\"
            Fields to sort Reviewers by. The order in which sorts are applied is not guaranteed when specifying many fields in one ReviewerSort object.
            \\"\\"\\"
            input ReviewerSort {
              reputation: SortDirection
              reviewerId: SortDirection
            }

            input ReviewerUpdateInput {
              reputation: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              reputation_DECREMENT: Int
              reputation_INCREMENT: Int
              reputation_SET: Int
              reviewerId: Int @deprecated(reason: \\"Please use the explicit _SET field\\")
              reviewerId_DECREMENT: Int
              reviewerId_INCREMENT: Int
              reviewerId_SET: Int
            }

            input ReviewerWhere {
              AND: [ReviewerWhere!]
              NOT: ReviewerWhere
              OR: [ReviewerWhere!]
              reputation: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              reputation_EQ: Int
              reputation_GT: Int
              reputation_GTE: Int
              reputation_IN: [Int!]
              reputation_LT: Int
              reputation_LTE: Int
              reviewerId: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              reviewerId_EQ: Int
              reviewerId_GT: Int
              reviewerId_GTE: Int
              reviewerId_IN: [Int]
              reviewerId_LT: Int
              reviewerId_LTE: Int
              typename: [ReviewerImplementation!]
              typename_IN: [ReviewerImplementation!] @deprecated(reason: \\"The typename_IN filter is deprecated, please use the typename filter instead\\")
            }

            type ReviewersConnection {
              edges: [ReviewerEdge!]!
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

            type StringAggregateSelection {
              longest: String
              shortest: String
            }

            type UpdateActorsMutationResponse {
              actors: [Actor!]!
              info: UpdateInfo!
            }

            type UpdateInfluencersMutationResponse {
              influencers: [Influencer!]!
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

            type UpdatePeopleMutationResponse {
              info: UpdateInfo!
              people: [Person!]!
            }"
        `);
    });
});
