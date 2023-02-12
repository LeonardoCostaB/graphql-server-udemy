import  jwt  from "jsonwebtoken";
import { UserApi } from "./user/dataSources.js";

async function authorizeUser(req) {
   const { authorization } = req.headers;

   try {
      const [_barear, token] = authorization.split(" ");
      const { userId } = jwt.verify(token, process.env.JWL_SECRET_KEY)

      const userApi = new UserApi();
      userApi.initialize({});
      const foundUser = await userApi.getUser(userId);

      if (foundUser.token !== token) return "";


      return userId;
   } catch (error) {
      console.log(error);
      return "";
   }
}

export async function context({ req }) {
   const loggedUserId = await authorizeUser(req);

   return {
      loggedUserId,
      filterParams: (params) => {
         return new URLSearchParams(params);
      }
   }
}
