import Dataloader from "dataloader";
import axios from "axios";

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

const userDataLoader = new Dataloader(async (ids) => {
   const urlQuery = ids.join("&id=");
   const url = `http://localhost:3000/users/?id=${urlQuery}`

   const response = await axios.get(url);
   const userData = await response.data;

   return ids.map(id => userData.find(user => user.id === id));
})

const user = async ({ userId }, _, { api }) => {
   // const response = await api.get(`/users/${userId}`);

   // const user = await response.data;

   // return {
   //    id: user.id,
   //    firstName: user.firstName,
   //    lastName: user.lastName,
   //    userName: user.userName,
   //    indexRef: user.indexRef,
   //    createdAt: user.createdAt
   // }

   return userDataLoader.load(userId);
}

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
