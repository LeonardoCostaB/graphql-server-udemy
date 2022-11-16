import { gql } from "apollo-server";

export const postTypeDefs = gql`
   type Query {
      posts(urlFilter: ApiFilterInput): [Post!]!
      post(id: ID!): PostResponse!
   }

   union PostResponse = PostNotFoundError | Post

   type PostNotFoundError {
      statusCode: Int!
      message: String!
   }

   type Post {
      id: ID!
      title: String!
      body: String!
      user: User!
      indexRef: Int!
      createdAt: String!
   }
`;
