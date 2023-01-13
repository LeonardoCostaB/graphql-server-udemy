// Query
const users = async (_, { urlFilter }, { dataSources }) => {
   const users = await dataSources.userApi.getUsers(urlFilter);

   return users;
};

const user = async (_, { id }, { dataSources }) => {
   const user = await dataSources.userApi.getUser(id);

   return user;
};

// Mutation

const createUser = async (_, { data }, { dataSources }) => {
   return await dataSources.userApi.createUser(data);
};

const updateUser = async (_, { userId, data }, { dataSources }) => {
   return await dataSources.userApi.updateUser(userId, data);
};

const deleteUser = async (_, { userId }, { dataSources }) => {
   return await dataSources.userApi.deleteUser(userId);
};

const post = ({ id }, _, { dataSources }) => dataSources.postApi.dataLoader.load(id);

export const userResolvers = {
   Query: {
      users,
      user
   },
   Mutation: {
      createUser,
      updateUser,
      deleteUser
   },
   User: {
      post
   }
};
