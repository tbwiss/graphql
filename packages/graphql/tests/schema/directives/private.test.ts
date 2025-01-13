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

describe("@private directive", () => {
    test("does not add fields to schema", async () => {
        const typeDefs = gql`
            interface UserInterface {
                id: ID
                private: String @private
            }

            type User implements UserInterface @node {
                id: ID
                password: String @private
                private: String @private
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
              createUsers(input: [UserCreateInput!]!): CreateUsersMutationResponse!
              deleteUsers(where: UserWhere): DeleteInfo!
              updateUsers(update: UserUpdateInput, where: UserWhere): UpdateUsersMutationResponse!
            }

            \\"\\"\\"Pagination information (Relay)\\"\\"\\"
            type PageInfo {
              endCursor: String
              hasNextPage: Boolean!
              hasPreviousPage: Boolean!
              startCursor: String
            }

            type Query {
              userInterfaces(limit: Int, offset: Int, options: UserInterfaceOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [UserInterfaceSort!], where: UserInterfaceWhere): [UserInterface!]!
              userInterfacesAggregate(where: UserInterfaceWhere): UserInterfaceAggregateSelection!
              userInterfacesConnection(after: String, first: Int, sort: [UserInterfaceSort!], where: UserInterfaceWhere): UserInterfacesConnection!
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

            \\"\\"\\"
            Information about the number of nodes and relationships created and deleted during an update mutation
            \\"\\"\\"
            type UpdateInfo {
              nodesCreated: Int!
              nodesDeleted: Int!
              relationshipsCreated: Int!
              relationshipsDeleted: Int!
            }

            type UpdateUsersMutationResponse {
              info: UpdateInfo!
              users: [User!]!
            }

            type User implements UserInterface {
              id: ID
            }

            type UserAggregateSelection {
              count: Int!
              id: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
            }

            input UserCreateInput {
              id: ID
            }

            type UserEdge {
              cursor: String!
              node: User!
            }

            interface UserInterface {
              id: ID
            }

            type UserInterfaceAggregateSelection {
              count: Int!
              id: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
            }

            type UserInterfaceEdge {
              cursor: String!
              node: UserInterface!
            }

            enum UserInterfaceImplementation {
              User
            }

            input UserInterfaceOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more UserInterfaceSort objects to sort UserInterfaces by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [UserInterfaceSort!]
            }

            \\"\\"\\"
            Fields to sort UserInterfaces by. The order in which sorts are applied is not guaranteed when specifying many fields in one UserInterfaceSort object.
            \\"\\"\\"
            input UserInterfaceSort {
              id: SortDirection
            }

            input UserInterfaceWhere {
              AND: [UserInterfaceWhere!]
              NOT: UserInterfaceWhere
              OR: [UserInterfaceWhere!]
              id: ID @deprecated(reason: \\"Please use the explicit _EQ version\\")
              id_CONTAINS: ID
              id_ENDS_WITH: ID
              id_EQ: ID
              id_IN: [ID]
              id_STARTS_WITH: ID
              typename: [UserInterfaceImplementation!]
              typename_IN: [UserInterfaceImplementation!] @deprecated(reason: \\"The typename_IN filter is deprecated, please use the typename filter instead\\")
            }

            type UserInterfacesConnection {
              edges: [UserInterfaceEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
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
            }

            input UserUpdateInput {
              id: ID @deprecated(reason: \\"Please use the explicit _SET field\\")
              id_SET: ID
            }

            input UserWhere {
              AND: [UserWhere!]
              NOT: UserWhere
              OR: [UserWhere!]
              id: ID @deprecated(reason: \\"Please use the explicit _EQ version\\")
              id_CONTAINS: ID
              id_ENDS_WITH: ID
              id_EQ: ID
              id_IN: [ID]
              id_STARTS_WITH: ID
            }

            type UsersConnection {
              edges: [UserEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }"
        `);
    });

    test("private is not inherited", async () => {
        const typeDefs = gql`
            interface UserInterface {
                id: ID
                private: String @private
            }

            type User implements UserInterface @node {
                id: ID
                password: String @private
                private: String
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
              createUsers(input: [UserCreateInput!]!): CreateUsersMutationResponse!
              deleteUsers(where: UserWhere): DeleteInfo!
              updateUsers(update: UserUpdateInput, where: UserWhere): UpdateUsersMutationResponse!
            }

            \\"\\"\\"Pagination information (Relay)\\"\\"\\"
            type PageInfo {
              endCursor: String
              hasNextPage: Boolean!
              hasPreviousPage: Boolean!
              startCursor: String
            }

            type Query {
              userInterfaces(limit: Int, offset: Int, options: UserInterfaceOptions @deprecated(reason: \\"Query options argument is deprecated, please use pagination arguments like limit, offset and sort instead.\\"), sort: [UserInterfaceSort!], where: UserInterfaceWhere): [UserInterface!]!
              userInterfacesAggregate(where: UserInterfaceWhere): UserInterfaceAggregateSelection!
              userInterfacesConnection(after: String, first: Int, sort: [UserInterfaceSort!], where: UserInterfaceWhere): UserInterfacesConnection!
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

            \\"\\"\\"
            Information about the number of nodes and relationships created and deleted during an update mutation
            \\"\\"\\"
            type UpdateInfo {
              nodesCreated: Int!
              nodesDeleted: Int!
              relationshipsCreated: Int!
              relationshipsDeleted: Int!
            }

            type UpdateUsersMutationResponse {
              info: UpdateInfo!
              users: [User!]!
            }

            type User implements UserInterface {
              id: ID
              private: String
            }

            type UserAggregateSelection {
              count: Int!
              id: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
              private: StringAggregateSelection!
            }

            input UserCreateInput {
              id: ID
              private: String
            }

            type UserEdge {
              cursor: String!
              node: User!
            }

            interface UserInterface {
              id: ID
            }

            type UserInterfaceAggregateSelection {
              count: Int!
              id: IDAggregateSelection! @deprecated(reason: \\"aggregation of ID fields are deprecated and will be removed\\")
            }

            type UserInterfaceEdge {
              cursor: String!
              node: UserInterface!
            }

            enum UserInterfaceImplementation {
              User
            }

            input UserInterfaceOptions {
              limit: Int
              offset: Int
              \\"\\"\\"
              Specify one or more UserInterfaceSort objects to sort UserInterfaces by. The sorts will be applied in the order in which they are arranged in the array.
              \\"\\"\\"
              sort: [UserInterfaceSort!]
            }

            \\"\\"\\"
            Fields to sort UserInterfaces by. The order in which sorts are applied is not guaranteed when specifying many fields in one UserInterfaceSort object.
            \\"\\"\\"
            input UserInterfaceSort {
              id: SortDirection
            }

            input UserInterfaceWhere {
              AND: [UserInterfaceWhere!]
              NOT: UserInterfaceWhere
              OR: [UserInterfaceWhere!]
              id: ID @deprecated(reason: \\"Please use the explicit _EQ version\\")
              id_CONTAINS: ID
              id_ENDS_WITH: ID
              id_EQ: ID
              id_IN: [ID]
              id_STARTS_WITH: ID
              typename: [UserInterfaceImplementation!]
              typename_IN: [UserInterfaceImplementation!] @deprecated(reason: \\"The typename_IN filter is deprecated, please use the typename filter instead\\")
            }

            type UserInterfacesConnection {
              edges: [UserInterfaceEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
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
              private: SortDirection
            }

            input UserUpdateInput {
              id: ID @deprecated(reason: \\"Please use the explicit _SET field\\")
              id_SET: ID
              private: String @deprecated(reason: \\"Please use the explicit _SET field\\")
              private_SET: String
            }

            input UserWhere {
              AND: [UserWhere!]
              NOT: UserWhere
              OR: [UserWhere!]
              id: ID @deprecated(reason: \\"Please use the explicit _EQ version\\")
              id_CONTAINS: ID
              id_ENDS_WITH: ID
              id_EQ: ID
              id_IN: [ID]
              id_STARTS_WITH: ID
              private: String @deprecated(reason: \\"Please use the explicit _EQ version\\")
              private_CONTAINS: String
              private_ENDS_WITH: String
              private_EQ: String
              private_IN: [String]
              private_STARTS_WITH: String
            }

            type UsersConnection {
              edges: [UserEdge!]!
              pageInfo: PageInfo!
              totalCount: Int!
            }"
        `);
    });
});
