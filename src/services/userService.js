import userRepositories from "../repositories/userRepositories.js"
import validationError from "../utils/Error/validationError.js"
import clientError from "../utils/Error/clientError.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt"
import { createJwt } from "../utils/common/authUtils.js";

/*
SIGNUP API FLOW:
✅ Success → Controller → Service → userRepository (DB) → successResponse()
❌ Failure → Mongoose Error → Service wraps → ValidationError → customErrorResponse()
*/
export  const signUpService = async(data) => {
try {
    const newUser = await userRepositories.create(data);
    console.log(newUser);
    
    return { success: true, user: newUser };
} catch (error) {
  if(error.name === "ValidationError"){
    throw new validationError(
        {
        error : error.errors
        },
    error.message
);
  }
 if(error.code === 11000 || error.cause?.code === 11000 ){
    throw new validationError({
        error : ["A user with same email or username alredy exist"]
    },
   "A user with smae email or username alredy exist"
)}  
}
}

export const signInService = async(data) => {
try {
     const user = await userRepositories.getUserByEmail(data.email);

     if(!user){
      throw new clientError({
        message : "Email is not register",
        explanation : "Email not reqister",
        statusCode : StatusCodes.BAD_REQUEST
      })
     }

  // now email is regiser not match its password with the hash password 

  const isMatch = await bcrypt.compare(data.password, user.password);

  if(!isMatch){
   throw new clientError({
     message : "wrong password",
        explanation : "You have entered wrong password , please try again",
        statusCode : StatusCodes.BAD_REQUEST
   })
  }

  // now genrate the token 
  return {
    username : user.username,
    email : user.email,
    avatar : user.avatar,
    token : createJwt({ id : user._id, email : user.email, username: user.username, avatar: user.avatar })
  }

} catch (error) {
   console.log('User service error', error);
    throw error;
}
}
/**
* ERROR FLOW:
* 1. Service creates clientError (message, explanation, statusCode)
* 2. Service catch forwards same error to controller
* 3. Controller catch receives error with statusCode
* 4. Controller calls customErrorResponse with error data
* 5. customErrorResponse formats final response using error.message & error.explanation
*/