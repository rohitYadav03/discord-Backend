import { StatusCodes } from "http-status-codes";

class validationError extends Error {
    constructor(errorDetails, message){
        super(message);
        this.name = "ValidationError";
        let explanation = [];
console.log(message);

        
console.log("errorDetails.error:", errorDetails.error);


       Object.keys(errorDetails.error).forEach((key) => {
    explanation.push(errorDetails.error[key]);  
})
this.explanation = explanation; 
        this.message = message;
        console.log(this.message);
        
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export default validationError;
/*
VALIDATION ERROR CLASS - HOW IT WORKS:

1. Mongoose validation fails → creates error with .errors object
  Example: { errors: { email: ValidatorError, name: ValidatorError } }

2. userService catches it → passes to our custom validationError class:
  - errorDetails = { error: mongoose.errors }  
  - message = mongoose error message

3. Constructor processes each field error:
  - Object.keys(errorDetails.error) = ["email", "name"] 
  - forEach loops through each field
  - Pushes complete ValidatorError object to explanation array

4. Final result: explanation = [ValidatorError1, ValidatorError2, ...]
  Each ValidatorError contains: message, path, kind, value, etc.

5. API returns detailed field-by-field validation errors for frontend
*/