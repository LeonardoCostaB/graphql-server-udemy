import { gql } from "apollo-server";

export const userTypeDefs = gql`
   extend type Query {
      users(urlFilter: ApiFilterInput): [User!]!
      user(id: ID!): User!
   }

   type User {
      id: ID!
      firstName: String!
      lastName: String!
      userName: String!
      indexRef: Int!
      createdAt: String!
   }
`;

// "id": "771",
// "firstName": "Márcia",
// "lastName": "Carvalho",
// "userName": "marcia_carvalho81",
// "indexRef": 1,
// "createdAt": "2016-12-08T00:49:39.870Z"
