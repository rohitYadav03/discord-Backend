import { StatusCodes } from "http-status-codes";
import { signInService, signUpService} from "../services/userService.js"
import { customErrorResponse, internalErrorResponse, successResponse } from "../utils/common/responseObject.js";

export const signUp = async(req,res) => {
    try {
 const user = await signUpService(req.body);
return res.status(StatusCodes.CREATED).json(successResponse(user,"user created successfully"))  

    } 
    catch (error) {
        console.log(`user controller error ${error}`);
      if(error.statusCode){
        return res.status(error.statusCode).json(customErrorResponse(error))
      }

      return res.status(StatusCodes.BAD_REQUEST).json(internalErrorResponse(error))
    }
}

export const signIn = async(req,res) => {
   try {
    const response = await signInService(req.body);

    const { token, ...userData } = response;

    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // true in production
  sameSite: "Strict", // Prevent CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expiry: 7 days
});

   return res.status(StatusCodes.OK).json(successResponse(response, "User signed in scussefully"))
   } catch (error) {
    console.log(`ERROR user controller : ${error}`);
     if(error.statusCode){
        return res.status(error.statusCode).json(customErrorResponse(error))
      }

      return res.status(StatusCodes.BAD_REQUEST).json(internalErrorResponse(error))
   }
}


/*
=== ERROR HANDLING FLOW - QUICK REFERENCE ===

📍 STEP 1: ERROR OCCURS
- Database/Mongoose throws error with .errors (plural)
- Example: { name: "ValidationError", errors: { email: {message: "Required"} } }

📍 STEP 2: SERVICE LAYER CATCHES & TRANSFORMS
- Wraps mongoose .errors inside custom .error (singular)
- throw new validationError({ error: mongooseError.errors }, message)
- Creates standardized error object with statusCode

📍 STEP 3: VALIDATION ERROR CLASS PROCESSES
- Receives: errorDetails.error (contains wrapped mongoose errors)
- Extracts messages into: this.explanation = ["Required", "Too short"]  
- Sets: this.statusCode = 400, this.message = "Main error message"

📍 STEP 4: CONTROLLER CATCHES & ROUTES
- if (error.statusCode) → customErrorResponse(error)    // Known errors
- else → internalErrorResponse(error)                   // Unknown errors

📍 STEP 5: RESPONSE FORMATTING
- customErrorResponse uses error.message + error.explanation
- Sends: { success: false, message: "...", err: { explanation: [...] } }

🔑 KEY POINTS:
- Mongoose: .errors (plural) → Service: .error (singular) → Class: .explanation (array)
- StatusCode determines response type: custom vs internal
- All errors get standardized format for frontend
*/

// Usage Examples:
/*
In Service Layer:
catch (error) {
  if(error.name === "ValidationError") {
    throw new validationError({ error: error.errors }, error.message);
  }
  if(error.code === 11000) {
    throw new validationError({ error: ["Email already exists"] }, "Duplicate error");
  }
  throw error; // Re-throw unknown errors
}

In Controller:
catch (error) {
  if(error.statusCode) {
    return res.status(error.statusCode).json(customErrorResponse(error));
  }
  return res.status(500).json(internalErrorResponse(error));
}
*/