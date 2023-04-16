import { gql } from "apollo-server";

export const postTypeDefs = gql`
   extend type Query {
      posts(urlFilter: ApiFilterInput): [Post!]!
      post(id: ID!): Post!
   }

   extend type Mutation {
      createPost(data: CreatePostInput!): Post!
      updatePost(postId: ID!, data: UpdatePostInput!): Post!
      deletePost(postId: ID!): Boolean!
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
      comments: [Comment!]!
      indexRef: Int!
      createdAt: String!
   }

   input CreatePostInput {
      title: String!
      body: String!
   }

   input UpdatePostInput {
      title: String
      body: String
   }
`;
