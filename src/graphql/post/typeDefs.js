import { gql } from "apollo-server";

export const postTypeDefs = gql`
   extend type Query {
      posts(urlFilter: ApiFilterInput): [Post!]!
      post(id: ID!): PostResponse!
   }

   extend type Mutation {
      createPost(data: CreatePostInput!): Post!
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

   input CreatePostInput {
      title: String!
      body: String!
      userId: String!
   }
`;
