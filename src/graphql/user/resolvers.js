const users = async (_, { urlFilter }, { api, filterParams }) => {
   const paramsFilterUrl = filterParams(urlFilter);

   const response = await api.get(`/users/?${paramsFilterUrl}`);

   const users = response.data;

   return users;
};

const user = async (_, { id }, { api }) => {
   const response = await api.get(`/users/${id}`);

   const user = response.data;

   return user;
};

const post = ({ id }, _, { postDataLoader }) => postDataLoader.load(id);

export const userResolvers = {
   Query: {
      users,
      user
   },
   User: {
      post
   }
};
