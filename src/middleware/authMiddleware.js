import { StatusCodes } from "http-status-codes";
import { customErrorResponse, internalErrorResponse } from "../utils/common/responseObject.js"; // FIXED: missing `internalErrorResponse`
import jwt from "jsonwebtoken";
import { JWT_SECREAT } from "../config/serverConfig.js"; // spelling: SECRET not SECREAT
import userRepositories from "../repositories/userRepositories.js";

const isAuthenticated = async (req, res, next) => {
  try {

    const token = req.headers['auth-token'];

    if (!token) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: "Invalid data sent from the client",
          message: "No token found"
        })
      );
    }

    const responseData = jwt.verify(token, JWT_SECREAT);
    if (!responseData) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: "Invalid data sent from the client",
          message: "Token doesn't match or is invalid"
        })
      );
    }

    const user = await userRepositories.getById(responseData.id);

    req.user = user.id; // this is fine (string version of _id)
    next();

  } catch (error) {
    console.log('Auth middleware error', error);
    
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: 'Invalid data sent from the client',
          message: 'Invalid or expired auth token provided'
        })
      );
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export default isAuthenticated;
