import { gql } from "apollo-server";

import { userTypeDefs } from "./user/typeDefs.js";
import { userResolvers } from "./user/resolvers.js";
import { postTypeDefs } from "./post/typeDefs.js";
import { postResolvers } from "./post/resolvers.js";
import { apiFilterTypeDefs } from "./api-filter/typeDefs.js";
import { resolversApiFilter } from "./api-filter/resolvers.js";

const rootTypeDefs = gql`
   type Query {
      _root: Boolean
   }
`;

const rootResolvers = {
   Query: {
      _root: () => true
   }
};

export const typeDefs = [rootTypeDefs, userTypeDefs, postTypeDefs, apiFilterTypeDefs];
export const resolvers = [rootResolvers, userResolvers, postResolvers, resolversApiFilter];
