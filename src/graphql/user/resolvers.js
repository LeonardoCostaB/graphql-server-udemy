const users = async (_, { urlFilter }, { dataSources }) => {
   const users = await dataSources.userApi.getUsers(urlFilter);

   return users;
};

const user = async (_, { id }, { dataSources }) => {
   const user = await dataSources.userApi.getUser(id);

   return user;
};

const post = ({ id }, _, { dataSources }) => dataSources.postApi.dataLoader.load(id);

export const userResolvers = {
   Query: {
      users,
      user
   },
   User: {
      post
   }
};
