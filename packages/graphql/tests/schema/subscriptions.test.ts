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
import { gql } from "apollo-server";
import { Neo4jGraphQL } from "../../src";
import { TestSubscriptionsPlugin } from "../utils/TestSubscriptionPlugin";

describe("Subscriptions", () => {
    let plugin: TestSubscriptionsPlugin;

    beforeAll(() => {
        plugin = new TestSubscriptionsPlugin();
    });

    test("Subscriptions", async () => {
        const typeDefs = gql`
            type Movie {
                id: ID
                actorCount: Int
                averageRating: Float
                isActive: Boolean
                actors: [Actor!]! @relationship(type: "ACTED_IN", direction: IN)
            }

            type Actor {
                name: String!
            }
        `;
        const neoSchema = new Neo4jGraphQL({
            typeDefs,
            plugins: {
                subscriptions: plugin,
            } as any,
        });
        const printedSchema = printSchemaWithDirectives(lexicographicSortSchema(await neoSchema.getSchema()));

        expect(printedSchema).toMatchInlineSnapshot(`
            "schema {
              query: Query
              mutation: Mutation
              subscription: Subscription
            }

            type Actor {
              name: String!
            }

            type ActorAggregateSelection {
              count: Int!
              name: StringAggregateSelectionNonNullable!
            }

            input ActorConnectWhere {
              node: ActorWhere!
            }

            input ActorCreateInput {
              name: String!
            }

            type ActorCreatedEvent {
              actor: ActorEventPayload
            }

            type ActorDeletedEvent {
              actor: ActorEventPayload
            }

            type ActorEventPayload {
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
              name: SortDirection
            }

            input ActorSubscriptionWhere {
              name: String
            }

            input ActorUpdateInput {
              name: String
            }

            type ActorUpdatedEvent {
              actor: ActorEventPayload
            }

            input ActorWhere {
              AND: [ActorWhere!]
              OR: [ActorWhere!]
              name: String
              name_CONTAINS: String
              name_ENDS_WITH: String
              name_IN: [String!]
              name_NOT: String
              name_NOT_CONTAINS: String
              name_NOT_ENDS_WITH: String
              name_NOT_IN: [String!]
              name_NOT_STARTS_WITH: String
              name_STARTS_WITH: String
            }

            type CreateActorsMutationResponse {
              actors: [Actor!]!
              info: CreateInfo!
            }

            type CreateInfo {
              bookmark: String
              nodesCreated: Int!
              relationshipsCreated: Int!
            }

            type CreateMoviesMutationResponse {
              info: CreateInfo!
              movies: [Movie!]!
            }

            type DeleteInfo {
              bookmark: String
              nodesDeleted: Int!
              relationshipsDeleted: Int!
            }

            type FloatAggregateSelectionNullable {
              average: Float
              max: Float
              min: Float
              sum: Float
            }

            type IDAggregateSelectionNullable {
              longest: ID
              shortest: ID
            }

            type IntAggregateSelectionNullable {
              average: Float
              max: Int
              min: Int
              sum: Int
            }

            type Movie {
              actorCount: Int
              actors(directed: Boolean = true, options: ActorOptions, where: ActorWhere): [Actor!]!
              actorsAggregate(directed: Boolean = true, where: ActorWhere): MovieActorActorsAggregationSelection
              actorsConnection(after: String, directed: Boolean = true, first: Int, sort: [MovieActorsConnectionSort!], where: MovieActorsConnectionWhere): MovieActorsConnection!
              averageRating: Float
              id: ID
              isActive: Boolean
            }

            type MovieActorActorsAggregationSelection {
              count: Int!
              node: MovieActorActorsNodeAggregateSelection
            }

            type MovieActorActorsNodeAggregateSelection {
              name: StringAggregateSelectionNonNullable!
            }

            input MovieActorsAggregateInput {
              AND: [MovieActorsAggregateInput!]
              OR: [MovieActorsAggregateInput!]
              count: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              node: MovieActorsNodeAggregationWhereInput
            }

            input MovieActorsConnectFieldInput {
              where: ActorConnectWhere
            }

            type MovieActorsConnection {
              edges: [MovieActorsRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input MovieActorsConnectionSort {
              node: ActorSort
            }

            input MovieActorsConnectionWhere {
              AND: [MovieActorsConnectionWhere!]
              OR: [MovieActorsConnectionWhere!]
              node: ActorWhere
              node_NOT: ActorWhere
            }

            input MovieActorsCreateFieldInput {
              node: ActorCreateInput!
            }

            input MovieActorsDeleteFieldInput {
              where: MovieActorsConnectionWhere
            }

            input MovieActorsDisconnectFieldInput {
              where: MovieActorsConnectionWhere
            }

            input MovieActorsFieldInput {
              connect: [MovieActorsConnectFieldInput!]
              create: [MovieActorsCreateFieldInput!]
            }

            input MovieActorsNodeAggregationWhereInput {
              AND: [MovieActorsNodeAggregationWhereInput!]
              OR: [MovieActorsNodeAggregationWhereInput!]
              name_AVERAGE_EQUAL: Float
              name_AVERAGE_GT: Float
              name_AVERAGE_GTE: Float
              name_AVERAGE_LT: Float
              name_AVERAGE_LTE: Float
              name_EQUAL: String
              name_GT: Int
              name_GTE: Int
              name_LONGEST_EQUAL: Int
              name_LONGEST_GT: Int
              name_LONGEST_GTE: Int
              name_LONGEST_LT: Int
              name_LONGEST_LTE: Int
              name_LT: Int
              name_LTE: Int
              name_SHORTEST_EQUAL: Int
              name_SHORTEST_GT: Int
              name_SHORTEST_GTE: Int
              name_SHORTEST_LT: Int
              name_SHORTEST_LTE: Int
            }

            type MovieActorsRelationship {
              cursor: String!
              node: Actor!
            }

            input MovieActorsUpdateConnectionInput {
              node: ActorUpdateInput
            }

            input MovieActorsUpdateFieldInput {
              connect: [MovieActorsConnectFieldInput!]
              create: [MovieActorsCreateFieldInput!]
              delete: [MovieActorsDeleteFieldInput!]
              disconnect: [MovieActorsDisconnectFieldInput!]
              update: MovieActorsUpdateConnectionInput
              where: MovieActorsConnectionWhere
            }

            type MovieAggregateSelection {
              actorCount: IntAggregateSelectionNullable!
              averageRating: FloatAggregateSelectionNullable!
              count: Int!
              id: IDAggregateSelectionNullable!
            }

            input MovieConnectInput {
              actors: [MovieActorsConnectFieldInput!]
            }

            input MovieCreateInput {
              actorCount: Int
              actors: MovieActorsFieldInput
              averageRating: Float
              id: ID
              isActive: Boolean
            }

            type MovieCreatedEvent {
              movie: MovieEventPayload
            }

            input MovieDeleteInput {
              actors: [MovieActorsDeleteFieldInput!]
            }

            type MovieDeletedEvent {
              movie: MovieEventPayload
            }

            input MovieDisconnectInput {
              actors: [MovieActorsDisconnectFieldInput!]
            }

            type MovieEventPayload {
              actorCount: Int
              averageRating: Float
              id: ID
              isActive: Boolean
            }

            input MovieOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more MovieSort objects to sort Movies by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [MovieSort!]
            }

            input MovieRelationInput {
              actors: [MovieActorsCreateFieldInput!]
            }

            \\"\\"\\"
            Fields to sort Movies by. The order in which sorts are applied is not guaranteed when specifying many fields in one MovieSort object.
            \\"\\"\\"
            input MovieSort {
              actorCount: SortDirection
              averageRating: SortDirection
              id: SortDirection
              isActive: SortDirection
            }

            input MovieSubscriptionWhere {
              actorCount: Int
              averageRating: Float
              id: ID
              isActive: Boolean
            }

            input MovieUpdateInput {
              actorCount: Int
              actors: [MovieActorsUpdateFieldInput!]
              averageRating: Float
              id: ID
              isActive: Boolean
            }

            type MovieUpdatedEvent {
              movie: MovieEventPayload
            }

            input MovieWhere {
              AND: [MovieWhere!]
              OR: [MovieWhere!]
              actorCount: Int
              actorCount_GT: Int
              actorCount_GTE: Int
              actorCount_IN: [Int]
              actorCount_LT: Int
              actorCount_LTE: Int
              actorCount_NOT: Int
              actorCount_NOT_IN: [Int]
              actors: ActorWhere @deprecated(reason: \\"Use \`actors_SOME\` instead.\\")
              actorsAggregate: MovieActorsAggregateInput
              actorsConnection: MovieActorsConnectionWhere @deprecated(reason: \\"Use \`actorsConnection_SOME\` instead.\\")
              actorsConnection_ALL: MovieActorsConnectionWhere
              actorsConnection_NONE: MovieActorsConnectionWhere
              actorsConnection_NOT: MovieActorsConnectionWhere @deprecated(reason: \\"Use \`actorsConnection_NONE\` instead.\\")
              actorsConnection_SINGLE: MovieActorsConnectionWhere
              actorsConnection_SOME: MovieActorsConnectionWhere
              \\"\\"\\"Return Movies where all of the related Actors match this filter\\"\\"\\"
              actors_ALL: ActorWhere
              \\"\\"\\"Return Movies where none of the related Actors match this filter\\"\\"\\"
              actors_NONE: ActorWhere
              actors_NOT: ActorWhere @deprecated(reason: \\"Use \`actors_NONE\` instead.\\")
              \\"\\"\\"Return Movies where one of the related Actors match this filter\\"\\"\\"
              actors_SINGLE: ActorWhere
              \\"\\"\\"Return Movies where some of the related Actors match this filter\\"\\"\\"
              actors_SOME: ActorWhere
              averageRating: Float
              averageRating_GT: Float
              averageRating_GTE: Float
              averageRating_IN: [Float]
              averageRating_LT: Float
              averageRating_LTE: Float
              averageRating_NOT: Float
              averageRating_NOT_IN: [Float]
              id: ID
              id_CONTAINS: ID
              id_ENDS_WITH: ID
              id_IN: [ID]
              id_NOT: ID
              id_NOT_CONTAINS: ID
              id_NOT_ENDS_WITH: ID
              id_NOT_IN: [ID]
              id_NOT_STARTS_WITH: ID
              id_STARTS_WITH: ID
              isActive: Boolean
              isActive_NOT: Boolean
            }

            type Mutation {
              createActors(input: [ActorCreateInput!]!): CreateActorsMutationResponse!
              createMovies(input: [MovieCreateInput!]!): CreateMoviesMutationResponse!
              deleteActors(where: ActorWhere): DeleteInfo!
              deleteMovies(delete: MovieDeleteInput, where: MovieWhere): DeleteInfo!
              updateActors(update: ActorUpdateInput, where: ActorWhere): UpdateActorsMutationResponse!
              updateMovies(connect: MovieConnectInput, create: MovieRelationInput, delete: MovieDeleteInput, disconnect: MovieDisconnectInput, update: MovieUpdateInput, where: MovieWhere): UpdateMoviesMutationResponse!
            }

            \\"\\"\\"Pagination information (Relay)\\"\\"\\"
            type PageInfo {
              endCursor: String
              hasNextPage: Boolean!
              hasPreviousPage: Boolean!
              startCursor: String
            }

            type Query {
              actors(options: ActorOptions, where: ActorWhere): [Actor!]!
              actorsAggregate(where: ActorWhere): ActorAggregateSelection!
              movies(options: MovieOptions, where: MovieWhere): [Movie!]!
              moviesAggregate(where: MovieWhere): MovieAggregateSelection!
            }

            enum SortDirection {
              \\"\\"\\"Sort by field values in ascending order.\\"\\"\\"
              ASC
              \\"\\"\\"Sort by field values in descending order.\\"\\"\\"
              DESC
            }

            type StringAggregateSelectionNonNullable {
              longest: String!
              shortest: String!
            }

            type Subscription {
              actorCreated(where: ActorSubscriptionWhere): ActorCreatedEvent
              actorDeleted(where: ActorSubscriptionWhere): ActorDeletedEvent
              actorUpdated(where: ActorSubscriptionWhere): ActorUpdatedEvent
              movieCreated(where: MovieSubscriptionWhere): MovieCreatedEvent
              movieDeleted(where: MovieSubscriptionWhere): MovieDeletedEvent
              movieUpdated(where: MovieSubscriptionWhere): MovieUpdatedEvent
            }

            type UpdateActorsMutationResponse {
              actors: [Actor!]!
              info: UpdateInfo!
            }

            type UpdateInfo {
              bookmark: String
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
