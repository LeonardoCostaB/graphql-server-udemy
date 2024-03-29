import  jwt  from "jsonwebtoken";
import { UserApi } from "../schema/user/dataSources.js";

async function verifyJwtToken(token) {
   try {
      const { userId } = jwt.verify(token, process.env.JWL_SECRET_KEY)

      const userApi = new UserApi();
      userApi.initialize({});
      const foundUser = await userApi.getUser(userId);

      if (foundUser.token !== token) return "";

      return userId;

   } catch (error) {
      return "";
   }
}

const cookieParser = (cookiesHeader) => {
   /**
    * The final goal is to return an object with key/value reflecting
    * the cookies. So, this functions always returns an object.
    * */

   // If we do not receive a string, we won't do anything.
   if (typeof cookiesHeader != 'string') return {};

   const cookies = cookiesHeader.split(/;\s*/);

   /**
    * If we have something similar to cookie, we want to add them
    * to the final object
    * */
   const parsedCookie = {};
   for (let i = 0; i < cookies.length; i++) {
     const [key, value] = cookies[i].split('=');
     parsedCookie[key] = value;
   }

   /**
    * The reason I'm using JSON here is to make sure the final
    * object won't have any undefined value.
    * */
   return JSON.parse(JSON.stringify(parsedCookie));
};

async function authorizationUserWithBearerToken(req) {
   if (!req || !req.headers || !req.headers.authorization) return "";

   const { authorization } = req.headers;

   try {
      const [_barear, token] = authorization.split(" ");

      return await verifyJwtToken(token);

   } catch (error) {
      return "";
   }
}

export async function context({ req, res }) {
   let loggedUserId = await authorizationUserWithBearerToken(req);

   if (!loggedUserId) {
      if (req && req.headers && req.headers.cookie) {
         const { jwtToken } = cookieParser(req.headers.cookie);
         loggedUserId = await verifyJwtToken(jwtToken);
      }
   }

   return {
      loggedUserId,
      res,
      filterParams: (params) => {
         return new URLSearchParams(params);
      }
   }
}
