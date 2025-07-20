import { StatusCodes } from "http-status-codes";

class clientError extends Error {
  constructor(error) {
    super();
    this.message = error.message || "Client error";
    this.explanation = error.explanation || "";
    this.statusCode = error.statusCode || StatusCodes.BAD_REQUEST; 
  }
}

export default clientError;
