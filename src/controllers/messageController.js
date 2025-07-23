import { StatusCodes } from "http-status-codes";
import { customErrorResponse, internalErrorResponse, successResponse } from "../utils/common/responseObject.js";
import { getMessagesService } from "../services/messageService.js";


 export const getMessageController = async(req,res) => {
   try{
const response = await getMessagesService({ channelId : req.parmas.channelId},req.query.page || 1, req.query.limit|| 10 , req.user)
   return res.status(StatusCodes.OK).json(successResponse(response, "Messages fetched successfully"))
          } catch (error) {
           console.log(`ERROR user controller : ${error}`);
            if(error.statusCode){
               return res.status(error.statusCode).json(customErrorResponse(error))
             }
       
             return res.status(StatusCodes.BAD_REQUEST).json(internalErrorResponse(error))
          }
}