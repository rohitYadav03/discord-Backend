import { StatusCodes } from "http-status-codes";
import { addChannelToWorkspaceService, addMemberToWorkspaceService, createWorkspaceService, deleteWorkSpaceSerice, getWorkspaceByJoinCodeService, updateWorkspaceService } from "../services/workspaceService.js"
import { customErrorResponse, internalErrorResponse, successResponse } from "../utils/common/responseObject.js";
import {getWorkspaceUserIsPartOfService} from "../services/workspaceService.js"


export const createWorkspaceController  = async(req,res) => {
try {
  const response =    await createWorkspaceService({...req.body, owner : req.user});
    return res.status(StatusCodes.CREATED).json(successResponse(response, "workspace created successfully"))

} catch (error) {
    console.log(`Controller workspace ${error}`);
       if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error))
          }
          return res.status(StatusCodes.BAD_REQUEST).json(internalErrorResponse(error))
}
}


export const getWorkspaceUserIsPartController = async(req,res) => {
   console.log(`request body : ${req.body}`);
  console.log(`request user : ${req.user}`);
  console.log(req.body);
  
  try {
     const response = await getWorkspaceUserIsPartOfService(req.user);
     return res.status(StatusCodes.OK).json(successResponse(response, "Workspace user is part of : "))
  } catch (error) {
    console.log(`error controller ${error}`);
    if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error))
          }
          return res.status(StatusCodes.BAD_REQUEST).json(internalErrorResponse(error))
  }
}


export const deleteWorkSpaceController = async(req,res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const response = await deleteWorkSpaceSerice(req.user , workspaceId)
    return res.status(StatusCodes.OK).json(successResponse(response, "Workspace deleted successfully"))

  } catch (error) {
    console.log(`error controller delete ${error}`);
    if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error))
          }
          return res.status(StatusCodes.BAD_REQUEST).json(internalErrorResponse(error))
  }
}

export const getWorkspaceByJoinCodeController = async(req,res) => {
  try {
    const joinCode = req.params.joincode;
    const response = await getWorkspaceByJoinCodeService(joinCode, req.user);
    return res.status(StatusCodes.OK).json(successResponse(response, "Workspace details"))

  } catch (error) {
    console.log(`getWorkspaceByJoinCode controller ${error}`);
    if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error))
          }
          return res.status(StatusCodes.BAD_REQUEST).json(internalErrorResponse(error))
  }
}

export const updateWorkspaceController = async(req,res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const response = await updateWorkspaceService(workspaceId , req.body, req.user);
    return res.status(StatusCodes.OK).json(successResponse(response, "Workspace updated"))

  } catch (error) {
    console.log(`updateWorkspace controller ${error}`);
    if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error))
          }
          return res.status(StatusCodes.BAD_REQUEST).json(internalErrorResponse(error))
  }
}


export const addMemberToWorkspaceController = async(req,res) => {
  try{
    const workspaceId = req.params.workspaceId;
    const memberId = req.body.memberId;
    const role = req.body.role || "member";
 const response = await addMemberToWorkspaceService(workspaceId,memberId, role,req.user);

   return res.status(StatusCodes.OK).json(successResponse(response, "Workspace updated"))
  } catch (error) {
    console.log(`add memeber to workspace controller ${error}`);
    if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error))
          }
          return res.status(StatusCodes.BAD_REQUEST).json(internalErrorResponse(error))
  }
}

export const addChannelToWorkspaceController = async(req,res) => {
try {
const workspaceId = req.params.workspaceId;
const channelName = req.body.channelName;

const response = await addChannelToWorkspaceService(workspaceId,channelName, req.user);

 return res.status(StatusCodes.OK).json(successResponse(response, "Workspace updated"))
  } catch (error) {
    console.log(`add memeber to workspace controller ${error}`);
    if(error.statusCode){
            return res.status(error.statusCode).json(customErrorResponse(error))
          }
          return res.status(StatusCodes.BAD_REQUEST).json(internalErrorResponse(error))
  }

}

