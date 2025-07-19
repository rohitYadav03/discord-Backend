import { StatusCodes } from "http-status-codes";

/*
PURPOSE: Validate request data using Zod schemas
- Input: Zod schema + request data
- Output: Clean field-by-field validation errors for frontend
*/

const validateSchema = (schema) => {
    return (req, res, next) => {
        try {
            // Validate request body against schema
            const validatedData = schema.parse(req.body);
            
            // If validation passes, attach validated data to request
            req.validatedData = validatedData;
            next(); // Continue to next middleware/controller
            
        } catch (error) {
            // console.log("Zod validation error:", error); // Debug log
            
            // Zod validation failed
            if (error.name === "ZodError") {
                // Check if errors array exists
                const fieldErrors = error.issues ? error.issues.map(err => ({
                    field: err.path.join('.'), // field name (e.g., "email", "password")
                    message: err.message        // error message
                })) : [];

                // Create response similar to your ValidationError format
                const errorResponse = {
                    success: false,
                    err: fieldErrors,
                    data: {},
                    message: "Validation failed"
                };

                return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
            }

            // For any other unexpected errors
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                err: {},
                data: {},
                message: "Internal server error"
            });
        }
    };
};

export default validateSchema;

/*
USAGE IN ROUTES:
import validateSchema from "../middleware/zodValidationMiddleware.js";
import userSignUpSchema from "../schemas/userSignUpSchema.js";

router.post("/signup", validateSchema(userSignUpSchema), signUp);

FLOW:
1. Request comes in
2. validateSchema middleware runs first
3. If validation fails → sends error response immediately
4. If validation passes → req.validatedData available in controller
5. Controller proceeds normally
*/