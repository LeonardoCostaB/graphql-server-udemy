import { RESTDataSource } from "apollo-datasource-rest";
import { userDataLoader } from "./userDataLoader.js";

export class UserApi extends RESTDataSource {
   constructor() {
      super();
      this.baseURL = `${process.env.API_URL}/users/`;
      this.dataLoader = userDataLoader(this.getUsers.bind(this));
   }

   async getUsers(params = {}) {
      return this.get("", params, {
         cacheOptions: {
            ttl: 60
         }
      });
   }

   async getUser(id) {
      return this.get(id, undefined, {
         cacheOptions: {
            ttl: 60
         }
      });
   }
}
