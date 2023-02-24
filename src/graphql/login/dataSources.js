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

      this.context.res.cookie("jwtToken", token, {
         /** @description
          * Rede segura - https ----
          * quando esse servidor for para a produção por como true. No localhost não existe
          * https
          */
         secure: true,

         /** @description
          * Http only significa dizer que esse meu cookie não pode ser acessado por código.
          * Somente trafega via http
          */
         httpOnly: true,

         /** @description
          * maxAge é o tempo de expiração do cookie, aqui ele é contabilizado por milisegundos
          */
         maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days

         path: "/", // onde o cookie vai ser válido,

         /** @description
          * Existe três tipos de navegações de cookie
          * 1°: strict: Ela quer dizer bem resumidamente que o nosso cookie vai ser usado no mesmo dominio, ou seja,
          *     o mesmo dominio que faz a requisição recebe o cookie.
          * 2°: lax: Lax permite que eu use o cookie em diferentes endereço, contanto que o meu usuário faça requisição
          *     a nível de topo, ou seja, mude a barra de endereço do navegador.
          * 3°: none: Ele permite que o meu navegador mande o meu cookie para qualquer endereço que eu solicitar, porém
          *     para poder utilizar o none tenho que deixar secure como true, uma que vez que diferente disso o navegador,
          *     não irá permitir a solicitação e bloqueará o cookie
          */
         sameSite: "none",
      })

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
      this.context.res.clearCookie('jwtToken')

      return true;
   }
}
