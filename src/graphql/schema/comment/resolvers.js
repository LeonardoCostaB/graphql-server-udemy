import { AuthenticationError, ValidationError } from "apollo-server";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

export const CREATED_COMMENT_TRIGGER = "CREATED_COMMENT";

const createComment = async (_, { data }, { dataSources, loggedUserId }) => {
   const { postId, comment } = data;

   if (!loggedUserId) throw new AuthenticationError("You must be logged in");

   await dataSources.postApi.getPost(postId); // thows if post doesn't exist

   if (!comment) throw new ValidationError("You must provide a comment");

   const commentAlreadyExists = await dataSources.commentApi.getComment(postId, comment);

   if (commentAlreadyExists.length > 0) throw new ValidationError("comment Already Exists");

   const commentData = {
      userId: loggedUserId,
      postId,
      comment,
      createdAt: new Date().toISOString()
   }

   pubsub.publish(CREATED_COMMENT_TRIGGER, {
      createdComment: commentData
   })

   return dataSources.commentApi.createComment(commentData);
}

const user = async ({ userId }, _, { dataSources }) => {
   return dataSources.userApi.dataLoader.load(userId);
}

// SUBSCRIPTION
const createdComment = {
   subscribe: (_, __, ctx) => {
      console.log(ctx)
      return pubsub.asyncIterator(CREATED_COMMENT_TRIGGER)
   }
}

export const commentResolvers = {
   Mutation: { createComment },
   Subscription: { createdComment },
   Comment: { user },
}
