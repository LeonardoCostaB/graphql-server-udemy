import { AuthenticationError } from "apollo-server";

// Query
const posts = async (_, { urlFilter }, { dataSources, loggedUserId }) => {
   if (!loggedUserId) throw new AuthenticationError("You must be logged in");

   const response = await dataSources.postApi.getPosts(urlFilter);

   return response;
};

const post = async (_, { id }, { dataSources }) => {
   const response = await dataSources.postApi.getPost(id);

   if(typeof response.id === "undefined") {
      return {
         statusCode: 404,
         message: "Post não existe, verifique e tente novamente"
      }
   }

   return response;
};

// Mutation
const createPost = async (_, { data }, { dataSources, loggedUserId }) => {
   if (!loggedUserId) throw new AuthenticationError("You must be logged in");

   data.userId = loggedUserId;

   return await dataSources.postApi.createPost(data);
};

const updatePost = async (_, { postId, data }, { dataSources, loggedUserId }) => {
   if (!loggedUserId) throw new AuthenticationError("You must be logged in");

   return await dataSources.postApi.updatePost(postId, data);
};

const deletePost = async (_, { postId }, { dataSources, loggedUserId }) => {
   if (!loggedUserId) throw new AuthenticationError("You must be logged in");

   return await dataSources.postApi.deletePost(postId);
};

// Field Resolvers
const user = ({ userId }, _, { dataSources }) =>  dataSources.userApi.dataLoader.load(userId);

const comments = async ({ id }, _, { dataSources }) => dataSources.commentApi.dataLoader.load(id);

export const postResolvers = {
   Query: {
      posts,
      post,
   },
   Mutation: {
      createPost,
      updatePost,
      deletePost,
   },
   Post: {
      user,
      comments,
   },
   PostResponse: {
      __resolveType: (obj) => {
         if(typeof obj.statusCode !== "undefined") return "PostNotFoundError";
         if(typeof obj.id !== "undefined") return "Post";

         return null;
      },
   },
};
