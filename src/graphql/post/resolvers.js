// Query
const posts = async (_, { urlFilter }, { dataSources }) => {
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
const createPost = async (_, { data }, { dataSources }) => {
   return await dataSources.postApi.createPost(data);
};

// Field Resolvers
const user = ({ userId }, _, { dataSources }) =>  dataSources.userApi.dataLoader.load(userId);

export const postResolvers = {
   Query: {
      posts,
      post
   },
   Mutation: {
      createPost
   },
   Post: {
      user
   },
   PostResponse: {
      __resolveType: (obj) => {
         if(typeof obj.statusCode !== "undefined") return "PostNotFoundError";
         if(typeof obj.id !== "undefined") return "Post";

         return null;
      }
   }
};
