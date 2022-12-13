import "dotenv/config";
import { ApolloServer } from "apollo-server";
import { resolvers, typeDefs } from "./graphql/index.js";
import { api } from "./lib/index.js";
import { userDataLoader } from "./graphql/user/dataLoaderUser.js";
import { PostApi } from "./graphql/post/dataSources.js";

const server = new ApolloServer({
   typeDefs,
   resolvers,

   context: () => {
      return {
         userDataLoader: userDataLoader(),
         api,
         filterParams: (params) => {
            return new URLSearchParams(params);
         }
      }
   },

   dataSources: () => {
      return {
         postApi: new PostApi()
      }
   }
});

server.listen(5000).then(({ url }) => console.log(`Server is running ${url}`))
