import bcrypt from "bcrypt";

export const createUserFn = async (data, dataSource) => {
   const user = await createUserInfo(data, dataSource);

   return await dataSource.post("", { ...user });
};

export const updateUserFn = async (userId , userInfo, dataSource) => {
   const { firstName, lastName, userName, password } = userInfo;

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

   if (typeof password !== "undefined" && !password) throw new Error("password missing");

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

const validateUserPassword = (password) => {
   // Letra maiúscula, letra minúscula e número
   const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,30}$/;

   if (!password.match(strongPasswordRegex)) {
      throw new Error("Password must contain at least: One lower case letter, one upper case letter and one number.");
   }
};

const createUserInfo = async (data, dataSource) => {
   const { firstName, lastName, userName, password } = data;

   if (!firstName || !lastName || !userName, !password) {
      throw new Error("You have to send firstName, lastName, userName and password")
   };

   await userNameExist(userName, dataSource);

   if (password) {
      validateUserPassword(password);
   }

   let passwordHash;

   if (password && !data.passwordHash) {
      passwordHash = await bcrypt.hash(password, 12);

      delete data.password;
   }

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
      passwordHash,
      createdAt: new Date().toISOString()
   };
};
