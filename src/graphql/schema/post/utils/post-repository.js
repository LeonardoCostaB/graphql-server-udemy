import { AuthenticationError, ValidationError } from "apollo-server";
import { FetchError } from "node-fetch";

export const createPostFn = async (postData, dataSource) => {
   const postInfo = await createPostInfo(postData, dataSource);

   const { title, body, userId } = postInfo;

   if(!title || !body || !userId) throw new ValidationError("You have to send title, body and userId");

   return await dataSource.post("", { ...postInfo });
};

export async function findPostOwner(postId, dataSource) {
   const foundPost = await dataSource.get(postId, null, {
      cacheOptions: { ttl: 0 }
   });

   if (!foundPost) {
      throw new FetchError("Could not find post you are looking for.");
   }

   if (foundPost.userId !== dataSource.context.loggedUserId) {
      throw new AuthenticationError("You cannot update this post");
   }

   return foundPost;
};

export const updatePostFn = async (postId, postData, dataSource) => {
   if(!postId) throw new ValidationError("Missing postId");

   const { userId } = await findPostOwner(postId, dataSource);

   const { title, body } = postData;

   if(typeof title !== "undefined") {
      if(!title) throw new ValidationError("title missing");
   }

   if(typeof body !== "undefined") {
      if(!body) throw new ValidationError("body missing");
   }

   if(typeof userId !== "undefined") {
      if(!userId) throw new ValidationError("userId missing");

      await userExist(userId, dataSource);
   }

   return await dataSource.patch(postId, { ...postData });
};

export const deletePostFn = async (postId, dataSource) => {
   if(!postId) throw new ValidationError("Missing postId");

   await findPostOwner(postId, dataSource);

   const deleted = await dataSource.delete(postId);

   return !!deleted;
};

const userExist = async (userId, dataSource) => {
   try {
      await dataSource.context.dataSources.userApi.get(userId);
   } catch (error) {
      throw new ValidationError(`User ${userId} does not exist`);
   }
};

const createPostInfo = async (postData, dataSource) => {
   const { title, body, userId } = postData;

   await userExist(userId, dataSource);

   const indexRefPost = await dataSource.get("", {
      _limit: 1,
      _sort: "indexRef",
      _order: "desc"
   });

   const indexRef = indexRefPost[0].indexRef + 1;

   return {
      title,
      body,
      userId,
      indexRef,
      createdAt: new Date().toISOString()
   }
};
