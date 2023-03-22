import Dataloader from "dataloader";

export const commentDataLoader = (getPostId) => {
   return new Dataloader(async (ids) => {
      const urlQuery = ids.join("&postId=");
      const comments = await getPostId(`/?postId=${urlQuery}`);

      return ids.map(id => comments.filter(comment => comment.postId === id));
   })
}
