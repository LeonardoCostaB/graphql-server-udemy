import { RESTDataSource } from "apollo-datasource-rest";
import { postDataLoader } from "../post/postDataLoader.js";

export class PostApi extends RESTDataSource {
   constructor() {
      super();
      this.baseURL = `${process.env.API_URL}/posts/`;
      this.dataLoader = postDataLoader(this.getPost.bind(this));
   }

   async getPosts(params = {}) {
      return this.get("", params, {
         cacheOptions: {
            ttl: 60
         }
      });
   }

   async getPost(id) {
      return this.get(id, undefined, {
         cacheOptions: {
            ttl: 60
         }
      });
   }
}
