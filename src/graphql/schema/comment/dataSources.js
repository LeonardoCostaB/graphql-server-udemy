import { RESTDataSource } from "apollo-datasource-rest";
import { commentDataLoader } from "./commentDataLoader.js";

export class CommentApi extends RESTDataSource {
   constructor() {
      super();
      this.baseURL = `${process.env.API_URL}/comments/`;
      this.dataLoader = commentDataLoader(this.getPostId.bind());
   }

   async getPostId(postId) {
      return this.get(postId, undefined, { cacheOptions: { ttl: 0 } });
   }

   async getComment(postId, comment) {
      return this.get(`?postId=${postId}&comment=${comment}`);
   }

   async createComment(commentData) {
      return this.post("", { ...commentData })
   }
};
