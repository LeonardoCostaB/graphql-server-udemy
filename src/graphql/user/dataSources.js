import { RESTDataSource } from "apollo-datasource-rest";
import { userDataLoader } from "./userDataLoader.js";
import { createUserFn, updateUserFn, deleteUserFn } from "./utils/user-repository.js";

export class UserApi extends RESTDataSource {
   constructor() {
      super();
      this.baseURL = `${process.env.API_URL}/users/`;
      this.dataLoader = userDataLoader(this.getUsers.bind(this));
   }

   async getUsers(params = {}) {
      return this.get("", params, {
         cacheOptions: {
            ttl: 0
         }
      });
   }

   async getUser(id) {
      return this.get(id, undefined, {
         cacheOptions: {
            ttl: 0
         }
      });
   }

   async createUser(user) {
      return await createUserFn(user, this);
   }

   async updateUser(userId, userInfo) {
      return await updateUserFn(userId, userInfo, this);
   }

   async deleteUser(userId) {
      return await deleteUserFn(userId, this);
   }
}
