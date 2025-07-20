import { StatusCodes } from "http-status-codes";

const validateSchema = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse(req.body);
            req.body = validatedData;
            next(); 
            
        } catch (error) {       
            if (error.name === "ZodError") {
                const fieldErrors = error.issues ? error.issues.map(err => ({
                    field: err.path.join('.'), 
                    message: err.message       
                })) : [];

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

