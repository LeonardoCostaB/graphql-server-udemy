import Dataloader from "dataloader";
import { api } from "../../lib/index.js";

export const postDataLoader = () => {
   return new Dataloader(async (ids) => {
      const urlQuery = ids.join("&userId=");
      const response = await api.get(`/posts/?userId=${urlQuery}`)

      const posts = await response.data;

      return ids.map(id => posts.find(post => post.userId === id));
   })
}
