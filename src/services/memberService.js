import { StatusCodes } from "http-status-codes";
import userRepositories from "../repositories/userRepositories.js";
import workspaceRepostry from "../repositories/workSpaceRepository.js";
import clientError from "../utils/Error/clientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";


export  const isMemberPartofWorkspaceService = async(workSpaceId, userId) => {
try {
    const workSpace = await workspaceRepostry.getById(workSpaceId);
    if(!workSpace){
         throw new clientError({
        message: "Workspace not found",
        statusCode: StatusCodes.NOT_FOUND,
        explanation: "Invalid join code",
      });
    }
    console.log(`work space : ${workSpace}`);
    
    const isValidUser = await userRepositories.getById(userId);
    
       if(!isValidUser){
        throw new clientError({
            message: "no user found",
            statusCode: StatusCodes.NOT_FOUND,
            explanation: "Invalid Id code",
          });
       }

    const isPartOfWorkSpace = isUserMemberOfWorkspace(workSpace, userId);
  if(!isPartOfWorkSpace){
        throw new clientError({
            message: "you are not the member of the workspace",
            statusCode: StatusCodes.FORBIDDEN,
            explanation: "you are not the member of the workspace",
          });
       }

       return isValidUser;

} catch (error) {
    throw error;
}
}