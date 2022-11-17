const posts = async (_, { urlFilter }, { api, filterParams }) => {
   const paramsFilterUrl = filterParams(urlFilter);

   const response = await api.get(`/posts/?${paramsFilterUrl}`);
   const posts = response.data;

   return posts;
};

const post = async (_, { id }, { api }) => {
   const response = await api.get(`/posts/${id}`);

   const post = await response.data;

   if(typeof post.id === "undefined") {
      return {
         statusCode: 404,
         message: "Post não existe, verifique e tente novamente"
      }
   }

   return post;
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
         console.log("obj", obj);
         if(typeof obj.statusCode !== "undefined") return "PostNotFoundError";
         if(typeof obj.id !== "undefined") return "Post";

         return null;
      }
   }
};
