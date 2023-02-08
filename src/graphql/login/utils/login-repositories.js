import brycpt from "bcrypt";
import jwt  from "jsonwebtoken";

export async function checkUserPassoword(password, passwordHash) {
   return await brycpt.compare(password, passwordHash);
}

export function createJwtToken(payload) {
   return jwt.sign(
      payload,
      process.env.JWL_SECRET_KEY,
      {
         expiresIn: "1d",

      }
   )
}
