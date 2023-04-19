import "dotenv/config";
import { ApolloServer } from "apollo-server";

import { resolvers, typeDefs } from "./graphql/schema/index.js";
import { PostApi } from "./graphql/schema/post/dataSources.js";
import { UserApi } from "./graphql/schema/user/dataSources.js";
import { CommentApi } from "./graphql/schema/comment/dataSources.js";
import { LoginApi } from "./graphql/schema/login/dataSources.js";
import { context } from "./graphql/context/index.js";

const server = new ApolloServer({
   typeDefs,
   resolvers,
   context,
   cors: {
      origin: ["https://studio.apollographql.com", "http://localhost:3001"],
      credentials: true,
   },

   dataSources: () => {
      return {
         postApi: new PostApi(),
         userApi: new UserApi(),
         loginApi: new LoginApi(),
         commentApi: new CommentApi(),
      }
   },

   /**
    * @description Por segurança é sempre bom desativar pois com ele ativo fico mais vuneravel a
    * requisição que tenha o formato de form-data
    */
   upload: false,
});

server.listen({
   port: 5000 || process.env.PORT
}).then(({ url }) => console.log(`Server is running ${url}`))
