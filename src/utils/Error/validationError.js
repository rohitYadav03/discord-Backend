import { StatusCodes } from "http-status-codes";

class validationError extends Error {
    constructor(errorDetails, message) {
        super(message);
        this.name = "ValidationError";
        this.message = message;
        this.statusCode = StatusCodes.BAD_REQUEST;
        
        let explanation = [];
        
        console.log("errorDetails:", errorDetails);
        console.log("errorDetails.error:", errorDetails.error);
        
        // Handle different types of error structures
        if (Array.isArray(errorDetails.error)) {
            // If error is already an array (like from your manual throws)
            explanation = errorDetails.error;
        } else if (typeof errorDetails.error === 'object') {
            // If error is Mongoose validation errors object
            Object.keys(errorDetails.error).forEach((key) => {
                const fieldError = errorDetails.error[key];
                // Extract the actual error message
                if (fieldError.message) {
                    explanation.push(fieldError.message);
                } else if (typeof fieldError === 'string') {
                    explanation.push(fieldError);
                } else {
                    explanation.push(fieldError.toString());
                }
            });
        } else {
            explanation.push(errorDetails.error || message);
        }
        
        this.explanation = explanation;
        console.log("Final explanation:", this.explanation);
    }
}

export default validationError;