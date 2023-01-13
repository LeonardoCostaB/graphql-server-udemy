export const createUserFn = async (data, dataSource) => {
   const user = await createUserInfo(data, dataSource);

   return await dataSource.post("", { ...user });
};

export const updateUserFn = async (userId , userInfo, dataSource) => {
   const { firstName, lastName, userName } = userInfo;

   if(!userId) throw new Error("userId is required");

   if(typeof firstName !== "undefined") {
      if(!firstName) throw new Error("firstName missing");
   }

   if(typeof lastName !== "undefined") {
      if(!lastName) throw new Error("lastName missing");
   }

   if(typeof userName !== "undefined") {
      if(!userName) throw new Error("userName missing");

      await userNameExist(userName, dataSource);
   }

   return await dataSource.patch(userId, { ...userInfo });
};

export const deleteUserFn = async (userId , dataSource) => {
   if(!userId) throw new Error("userId is required");

   const response = await dataSource.delete(userId);

   return !!response;
};

const userNameExist = async (userName, dataSource) => {
   const response = await dataSource.context.dataSources.userApi.get(`?userName=${userName}`);

   if(response.length > 0) {
      throw new Error("UserName already exists");
   }
};

const createUserInfo = async (data, dataSource) => {
   const { firstName, lastName, userName } = data;

   if(!firstName || !lastName || !userName) throw new Error("You have to send firstName, lastName and userName");

   await userNameExist(userName, dataSource);

   const indexRefUser = await dataSource.get("", {
      _limit: 1,
      _sort: "indexRef",
      _order: "desc"
   })

   const indexRef = indexRefUser[0].indexRef + 1;

   return {
      firstName,
      lastName,
      userName,
      indexRef,
      createdAt: new Date().toISOString()
   };
};
