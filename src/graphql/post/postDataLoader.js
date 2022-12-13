import Dataloader from "dataloader";

export const postDataLoader = (getPosts) => {
   return new Dataloader(async (ids) => {
      const urlQuery = ids.join("&userId=");
      const posts = await getPosts(`/posts/?userId=${urlQuery}`)

      return ids.map(id => posts.filter(post => post.userId === id));
   })
}
