import { ApolloServer } from "apollo-server";
import { resolvers, typeDefs } from "./graphql/index.js";
import { api } from "./lib/index.js";

const server = new ApolloServer({
   typeDefs,
   resolvers,

   context: () => {
      return {
         api,
         filterParams: (params) => {
            return new URLSearchParams(params);
         }
      }
   }
});

server.listen(5000).then(({ url }) => console.log(`Server is running ${url}`))
