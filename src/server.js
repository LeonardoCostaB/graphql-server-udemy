import "dotenv/config";
import { ApolloServer } from "apollo-server";
import { resolvers, typeDefs } from "./graphql/index.js";
import { PostApi } from "./graphql/post/dataSources.js";
import { UserApi } from "./graphql/user/dataSources.js";
import { LoginApi } from "./graphql/login/dataSources.js";
import { context } from "./graphql/context.js";

const server = new ApolloServer({
   typeDefs,
   resolvers,
   context,
   cors: {
      origin: "https://studio.apollographql.com",
      credentials: true,
   },

   dataSources: () => {
      return {
         postApi: new PostApi(),
         userApi: new UserApi(),
         loginApi: new LoginApi(),
      }
   },

   /**
    * @description Por segurança é sempre bom desativar pois com ele ativo fico mais vuneravel a
    * requisição que tenha o formato de form-data
    */
   upload: false,
});

server.listen(5000).then(({ url }) => console.log(`Server is running ${url}`))
