import { AuthenticationError, ValidationError } from "apollo-server";

const createComment = async (_, { data }, { dataSources, loggedUserId }) => {
   const { postId, comment } = data;

   if (!loggedUserId) throw new AuthenticationError("You must be logged in");

   await dataSources.postApi.getPost(postId); // thows if post doesn't exist

   if (!comment) throw new ValidationError("You must provide a comment");

   const commentAlreadyExists = await dataSources.commentApi.getComment(postId, comment);

   if (commentAlreadyExists.length > 0) throw new ValidationError("comment Already Exists")

   console.log(commentAlreadyExists);

   return dataSources.commentApi.createComment({
      userId: loggedUserId,
      postId,
      comment,
   });
}

const user = async ({ userId }, _, { dataSources }) => {
   const user = await dataSources.userApi.dataLoader.load(userId);

   return user;
}

export const createResolvers = {
   Mutation: { createComment },
   Comment: { user },
}
