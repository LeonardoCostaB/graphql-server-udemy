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

const user = ({ userId }, _, { userDataLoader }) =>  userDataLoader.load(userId);

export const postResolvers = {
   Query: {
      posts,
      post
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
