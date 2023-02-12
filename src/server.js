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

   dataSources: () => {
      return {
         postApi: new PostApi(),
         userApi: new UserApi(),
         loginApi: new LoginApi(),
      }
   }
});

server.listen(5000).then(({ url }) => console.log(`Server is running ${url}`))
