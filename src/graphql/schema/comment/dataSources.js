import { RESTDataSource } from "apollo-datasource-rest";

export class CommentApi extends RESTDataSource {
   constructor() {
      super();
      this.baseURL = `${process.env.API_URL}/comments/`;
   }

   async getComment(postId, comment) {
      return await this.get(`?postId=${postId}&comment=${comment}`);
   }

   async createComment(commentData) {
      return await this.post("", { ...commentData })
   }
};
