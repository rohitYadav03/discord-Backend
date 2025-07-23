import { StatusCodes } from "http-status-codes";
import { getChannelByIdService } from "../services/channelService.js";
import { customErrorResponse, internalErrorResponse, successResponse } from "../utils/common/responseObject.js";


export  const getChannelByIdController = async(req,res) => {
  try {
   const channelId = req.params.channelId
    const channel = await getChannelByIdService(channelId, req.user);
     return res.status(StatusCodes.OK).json(successResponse(channel, "channel details"))
     } catch (error) {
      console.log(`ERROR channel controller : ${error}`);
       if(error.statusCode){
          return res.status(error.statusCode).json(customErrorResponse(error))
        }
  
        return res.status(StatusCodes.BAD_REQUEST).json(internalErrorResponse(error))
     }
}