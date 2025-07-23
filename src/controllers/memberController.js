import { isMemberPartofWorkspaceService } from "../services/memberService.js";
import { customErrorResponse, internalErrorResponse, successResponse } from "../utils/common/responseObject.js";


export  const isMemberPartofWorkspaceController = async(req,res) => {
    try {
      const workSpaceId = req.params.workspace;
const response = await isMemberPartofWorkspaceService(workSpaceId, req.user)
     return res.status(StatusCodes.OK).json(successResponse(response, "User is part of the workspace"))
       } catch (error) {
        console.log(`ERROR user controller : ${error}`);
         if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error))
          }
    
          return res.status(StatusCodes.BAD_REQUEST).json(internalErrorResponse(error))
       }
}
