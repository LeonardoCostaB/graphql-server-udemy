import { RESTDataSource } from "apollo-datasource-rest";
import { AuthenticationError } from "apollo-server";
import { checkUserPassoword, createJwtToken } from "./utils/login-repositories.js";

/*
   Em sistemas de login é muito importante não ter cache
*/

export class LoginApi extends RESTDataSource {
   constructor() {
      super();
      this.baseURL = `${process.env.API_URL}/users/`;
   }

   /** @description
    * Quando estou utilizando o método get, o segundo parâmetro
    * da minha função sempre vai ser uma queryString, ou seja,
    * tudo que eu passar vai ser concatenado a minha url.
    *
    * Outra coisa muito importante é declarar o cacheOptions com o ttl: 0 para confirmar que o
    * sistema não faça cache
    */

   async getUser(userName) {
      const user = await this.get(
         "",
         { userName },
         { cacheOptions: { ttl: 0 } }
      );

      const userFound = !!user.length;

      if (!userFound) {
         throw new AuthenticationError("User or password incorrect")
      }

      return user;
   }

   async login(userName, password) {
      const user = await this.getUser(userName);

      const { passwordHash, id: userId } = user[0];

      const isPasswordValid = await checkUserPassoword(
         password,
         passwordHash
      );

      if (!isPasswordValid) {
         throw new AuthenticationError("User or password incorrect")
      }

      const token = createJwtToken({ userId });
      await this.patch(userId, { token }, { cacheOptions: { ttl: 0 } });

      return {
         userId,
         token
      }
   }

   async logout(userName) {
      const user = await this.getUser(userName);

      if (user[0].id !== this.context.loggedUserId) {
         throw new AuthenticationError("You are not this user");
      }

      await this.patch(user[0].id, { token: "" }, { cacheOptions: { ttl: 0 } });

      return true;
   }
}
