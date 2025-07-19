import userRepositories from "../repositories/userRepositories.js"
import validationError from "../utils/Error/validationError.js"

/*
SIGNUP API FLOW:
✅ Success → Controller → Service → userRepository (DB) → successResponse()
❌ Failure → Mongoose Error → Service wraps → ValidationError → customErrorResponse()
*/
  const signUpService = async(data) => {
try {
    const newUser = await userRepositories.create(data);
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

export default signUpService;