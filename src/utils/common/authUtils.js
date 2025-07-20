import jwt from "jsonwebtoken";
import { JWT_SECREAT } from "../../config/serverConfig.js";

export const createJwt = (payload) => {
    console.log(`paylod : ${payload}`);
    
    return jwt.sign(payload,JWT_SECREAT , {expiresIn : "7d"})
}


