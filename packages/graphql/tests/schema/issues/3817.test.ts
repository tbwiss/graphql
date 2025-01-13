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
import { Neo4jGraphQL } from "../../../src";

describe("3817", () => {
    test("3817", async () => {
        const typeDefs = gql`
            type Person @node {
                id: ID! @id @unique
                friends: [Person!]!
                    @relationship(
                        type: "FRIEND_OF"
                        direction: OUT
                        queryDirection: UNDIRECTED_ONLY
                        properties: "FriendOf"
                    )
            }

            type FriendOf @relationshipProperties {
                #  id: ID! @id
                #  active: Boolean!
                id: String @populatedBy(callback: "getUserIDFromContext", operations: [CREATE])
            }
        `;
        const neoSchema = new Neo4jGraphQL({
            typeDefs,
            features: {
                populatedBy: {
                    callbacks: {
                        getUserIDFromContext: (_parent, _args, context) => {
                            const userId = context.jwt?.id;
                            if (typeof userId === "string") {
                                return userId;
                            }
                            return undefined;
                        },
                    },
                },
            },
        });
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
            * Person.friends
            \\"\\"\\"
            type FriendOf {
              id: String
            }

            input FriendOfAggregationWhereInput {
              AND: [FriendOfAggregationWhereInput!]
              NOT: FriendOfAggregationWhereInput
              OR: [FriendOfAggregationWhereInput!]
              id_AVERAGE_LENGTH_EQUAL: Float
              id_AVERAGE_LENGTH_GT: Float
              id_AVERAGE_LENGTH_GTE: Float
              id_AVERAGE_LENGTH_LT: Float
              id_AVERAGE_LENGTH_LTE: Float
              id_LONGEST_LENGTH_EQUAL: Int
              id_LONGEST_LENGTH_GT: Int
              id_LONGEST_LENGTH_GTE: Int
              id_LONGEST_LENGTH_LT: Int
              id_LONGEST_LENGTH_LTE: Int
              id_SHORTEST_LENGTH_EQUAL: Int
              id_SHORTEST_LENGTH_GT: Int
              id_SHORTEST_LENGTH_GTE: Int
              id_SHORTEST_LENGTH_LT: Int
              id_SHORTEST_LENGTH_LTE: Int
            }

            input FriendOfSort {
              id: SortDirection
            }

            input FriendOfUpdateInput {
              id: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              id_SET: String
            }

            input FriendOfWhere {
              AND: [FriendOfWhere!]
              NOT: FriendOfWhere
              OR: [FriendOfWhere!]
              id: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              id_CONTAINS: String
              id_ENDS_WITH: String
              id_EQ: String
              id_IN: [String]
              id_STARTS_WITH: String
            }

            type IDAggregateSelection {
              longest: ID
              shortest: ID
            }

            type Mutation {
              createPeople(input: [PersonCreateInput!]!): CreatePeopleMutationResponse!
              deletePeople(delete: PersonDeleteInput, where: PersonWhere): DeleteInfo!
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

            type Person {
              friends(limit: Int, offset: Int, options: PersonOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [PersonSort!], where: PersonWhere): [Person!]!
              friendsAggregate(where: PersonWhere): PersonPersonFriendsAggregationSelection
              friendsConnection(after: String, first: Int, sort: [PersonFriendsConnectionSort!], where: PersonFriendsConnectionWhere): PersonFriendsConnection!
              id: ID!
            }

            type PersonAggregateSelection {
              count: Int!
              id: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
            }

            input PersonConnectInput {
              friends: [PersonFriendsConnectFieldInput!]
            }

            input PersonConnectOrCreateWhere {
              node: PersonUniqueWhere!
            }

            input PersonConnectWhere {
              node: PersonWhere!
            }

            input PersonCreateInput {
              friends: PersonFriendsFieldInput
            }

            input PersonDeleteInput {
              friends: [PersonFriendsDeleteFieldInput!]
            }

            input PersonDisconnectInput {
              friends: [PersonFriendsDisconnectFieldInput!]
            }

            type PersonEdge {
              cursor: String!
              node: Person!
            }

            input PersonFriendsAggregateInput {
              AND: [PersonFriendsAggregateInput!]
              NOT: PersonFriendsAggregateInput
              OR: [PersonFriendsAggregateInput!]
              count: Int @deprecated(reason: \\"Please use the explicit _EQ version\\")
              count_EQ: Int
              count_GT: Int
              count_GTE: Int
              count_LT: Int
              count_LTE: Int
              edge: FriendOfAggregationWhereInput
              node: PersonFriendsNodeAggregationWhereInput
            }

            input PersonFriendsConnectFieldInput {
              connect: [PersonConnectInput!]
              \\"\\"\\"
              Whether or not to overwrite any matching relationship with the new properties.
              \\"\\"\\"
              overwrite: Boolean! = true @deprecated(reason: \\"The overwrite argument is deprecated and will be removed\\")
              where: PersonConnectWhere
            }

            input PersonFriendsConnectOrCreateFieldInput {
              onCreate: PersonFriendsConnectOrCreateFieldInputOnCreate!
              where: PersonConnectOrCreateWhere!
            }

            input PersonFriendsConnectOrCreateFieldInputOnCreate {
              node: PersonOnCreateInput!
            }

            type PersonFriendsConnection {
              edges: [PersonFriendsRelationship!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }

            input PersonFriendsConnectionSort {
              edge: FriendOfSort
              node: PersonSort
            }

            input PersonFriendsConnectionWhere {
              AND: [PersonFriendsConnectionWhere!]
              NOT: PersonFriendsConnectionWhere
              OR: [PersonFriendsConnectionWhere!]
              edge: FriendOfWhere
              node: PersonWhere
            }

            input PersonFriendsCreateFieldInput {
              node: PersonCreateInput!
            }

            input PersonFriendsDeleteFieldInput {
              delete: PersonDeleteInput
              where: PersonFriendsConnectionWhere
            }

            input PersonFriendsDisconnectFieldInput {
              disconnect: PersonDisconnectInput
              where: PersonFriendsConnectionWhere
            }

            input PersonFriendsFieldInput {
              connect: [PersonFriendsConnectFieldInput!]
              connectOrCreate: [PersonFriendsConnectOrCreateFieldInput!] @deprecated(reason: \\"The connectOrCreate operation is deprecated and will be removed\\")
              create: [PersonFriendsCreateFieldInput!]
            }

            input PersonFriendsNodeAggregationWhereInput {
              AND: [PersonFriendsNodeAggregationWhereInput!]
              NOT: PersonFriendsNodeAggregationWhereInput
              OR: [PersonFriendsNodeAggregationWhereInput!]
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

            type PersonFriendsRelationship {
              cursor: String!
              node: Person!
              properties: FriendOf!
            }

            input PersonFriendsUpdateConnectionInput {
              edge: FriendOfUpdateInput
              node: PersonUpdateInput
            }

            input PersonFriendsUpdateFieldInput {
              connect: [PersonFriendsConnectFieldInput!]
              connectOrCreate: [PersonFriendsConnectOrCreateFieldInput!]
              create: [PersonFriendsCreateFieldInput!]
              delete: [PersonFriendsDeleteFieldInput!]
              disconnect: [PersonFriendsDisconnectFieldInput!]
              update: PersonFriendsUpdateConnectionInput
              where: PersonFriendsConnectionWhere
            }

            input PersonOnCreateInput {
              \\"\\"\\"
              Appears because this input type would be empty otherwise because this type is composed of just generated and/or relationship properties. See https://neo4j.com/docs/graphql-manual/current/troubleshooting/faqs/
              \\"\\"\\"
              _emptyInput: Boolean
            }

            input PersonOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more PersonSort objects to sort People by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [PersonSort!]
            }

            type PersonPersonFriendsAggregationSelection {
              count: Int!
              edge: PersonPersonFriendsEdgeAggregateSelection
              node: PersonPersonFriendsNodeAggregateSelection
            }

            type PersonPersonFriendsEdgeAggregateSelection {
              id: StringAggregateSelection!
            }

            type PersonPersonFriendsNodeAggregateSelection {
              id: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
            }

            \\"\\"\\"
            Fields to sort People by. The order in which sorts are applied is not guaranteed when specifying many fields in one PersonSort object.
            \\"\\"\\"
            input PersonSort {
              id: SortDirection
            }

            input PersonUniqueWhere {
              id: ID @deprecated(reason: \\"Please use the explicit _EQ version\\")
              id_EQ: ID
            }

            input PersonUpdateInput {
              friends: [PersonFriendsUpdateFieldInput!]
            }

            input PersonWhere {
              AND: [PersonWhere!]
              NOT: PersonWhere
              OR: [PersonWhere!]
              friendsAggregate: PersonFriendsAggregateInput
              \\"\\"\\"
              Return People where all of the related PersonFriendsConnections match this filter
              \\"\\"\\"
              friendsConnection_ALL: PersonFriendsConnectionWhere
              \\"\\"\\"
              Return People where none of the related PersonFriendsConnections match this filter
              \\"\\"\\"
              friendsConnection_NONE: PersonFriendsConnectionWhere
              \\"\\"\\"
              Return People where one of the related PersonFriendsConnections match this filter
              \\"\\"\\"
              friendsConnection_SINGLE: PersonFriendsConnectionWhere
              \\"\\"\\"
              Return People where some of the related PersonFriendsConnections match this filter
              \\"\\"\\"
              friendsConnection_SOME: PersonFriendsConnectionWhere
              \\"\\"\\"Return People where all of the related People match this filter\\"\\"\\"
              friends_ALL: PersonWhere
              \\"\\"\\"Return People where none of the related People match this filter\\"\\"\\"
              friends_NONE: PersonWhere
              \\"\\"\\"Return People where one of the related People match this filter\\"\\"\\"
              friends_SINGLE: PersonWhere
              \\"\\"\\"Return People where some of the related People match this filter\\"\\"\\"
              friends_SOME: PersonWhere
              id: ID @deprecated(reason: \\"Please use the explicit _EQ version\\")
              id_CONTAINS: ID
              id_ENDS_WITH: ID
              id_EQ: ID
              id_IN: [ID!]
              id_STARTS_WITH: ID
            }

            type Query {
              people(limit: Int, offset: Int, options: PersonOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [PersonSort!], where: PersonWhere): [Person!]!
              peopleAggregate(where: PersonWhere): PersonAggregateSelection!
              peopleConnection(after: String, first: Int, sort: [PersonSort!], where: PersonWhere): PeopleConnection!
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

            \\"\\"\\"
            Information about the number of nodes and relationships created and deleted during an update mutation
            \\"\\"\\"
            type UpdateInfo {
              nodesCreated: Int!
              nodesDeleted: Int!
              relationshipsCreated: Int!
              relationshipsDeleted: Int!
            }

            type UpdatePeopleMutationResponse {
              info: UpdateInfo!
              people: [Person!]!
            }"
        `);
    });
});
