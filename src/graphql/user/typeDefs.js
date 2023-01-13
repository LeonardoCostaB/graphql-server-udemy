import { gql } from "apollo-server";

export const userTypeDefs = gql`
   extend type Query {
      users(urlFilter: ApiFilterInput): [User!]!
      user(id: ID!): User!
   }

   extend type Mutation {
      createUser(data: CreateUserInput!): User!
      updateUser(userId: ID!, data: UpdateUserInput!): User!
      deleteUser(userId: ID!): Boolean!
   }

   type User {
      id: ID!
      firstName: String!
      lastName: String!
      userName: String!
      indexRef: Int!
      createdAt: String!
      post: [Post!]!
   }

   input CreateUserInput {
      firstName: String!
      lastName: String!
      userName: String!
   }

   input UpdateUserInput {
      firstName: String
      lastName: String
      userName: String
   }
`;
