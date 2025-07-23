import { v4 as uuidv4 } from 'uuid';
import workspaceRepostry from "../repositories/workSpaceRepository.js"
import validationError from '../utils/Error/validationError.js';
import clientError from '../utils/Error/clientError.js';
import { StatusCodes } from 'http-status-codes';
import channelRepostry from '../repositories/channelRepository.js';
import userRepositories from '../repositories/userRepositories.js';
import { addEmailToMailQueue } from '../producers/mailQueueProducers.js';
import { workSpaceJoinMail } from '../utils/common/mailObject.js';



const isUserAdminOfWorkspace  = (workSpaceData , memberId) => {
  const isAdmin = workSpaceData.members.find(
      (eachMember) =>
       ( eachMember.memberId._id.toString() === memberId || eachMember.memberId.toString() === memberId) &&
        eachMember.role === "admin"
    );
  return isAdmin;
}

export const isUserMemberOfWorkspace = (workspace, userId) => {
  return workspace.members.find(
    (member) => member.memberId.toString() === userId.toString()
  );
};


const isChannelAlredyPartOfWorkSpace = (workSpace, channelName) => {
   return workSpace.channels.find((channel) => channel.name.toUpperCase() === channelName.toUpperCase())
}

export const createWorkspaceService = async(workspaceData) => {
    try {
        const joinCode = uuidv4().substring(0,8).toUpperCase();
        const response = await workspaceRepostry.create({
            name : workspaceData.name,
            description : workspaceData.description,
            joinCode
        });

        await workspaceRepostry.addMemberToWorkspace(
            workspaceData.owner,
            "admin", // the member which will  create workspace will be the admin of that workspace by defult
            response._id
        )

     const updateInfo =   await workspaceRepostry.addChannelToWorkspace(response._id, 'general')
        console.log(`updated info ${updateInfo}`);
        
        return updateInfo;
    } catch (error) {
        console.log(`workspace service error : ${error}`);
if(error.name === "ValidationError"){
    throw new validationError(
        {
        error : error.errors
        },
    error.message
);
  }

 if(error.code === 11000 || error.cause?.code === 11000 ){
    throw new validationError({
        error : ["A workspace with same name alredy exist"]
    },
   "A workspace with same name alredy exist"
)}
        throw error;
    }
}

export const getWorkspaceUserIsPartOfService = async(userId) => {
    
   try {
      const response = await workspaceRepostry.fetchAllWorkspaceByMemberId(userId);
      return response;
     
   } catch (error) {
    console.log(`error in service ${error}`);

    if(error.name === "ValidationError"){
    throw new validationError(
        {
        error : error.errors
        },
    error.message
);
  }
    throw error;
   }
}

export const deleteWorkSpaceSerice = async (memberId, workspaceId) => {
  try {
    const workSpaceData = await workspaceRepostry.getWorkspaceDetailsById(workspaceId);

    if (!workSpaceData) {
      throw new clientError({
        message: "Workspace not found",
        statusCode: StatusCodes.NOT_FOUND,
        explanation: "Invalid workspace ID",
      });
    }

    const isAdmin = workSpaceData.members.find(
      (eachMember) =>
        eachMember.memberId.toString() === memberId.toString() &&
        eachMember.role === "admin"
    );

    if (!isAdmin) {
      throw new clientError({
        message: "Forbidden",
        statusCode: StatusCodes.FORBIDDEN,
        explanation: "Only admins can delete a workspace",
      });
    }

    const allChannelId = workSpaceData.channels.map((channel) => channel._id);
    
    if (allChannelId.length > 0) {
      await channelRepostry.deleteMany(allChannelId);
    }

    const result = await workspaceRepostry.delete(workspaceId);

    return result;
   
  } catch (error) {
    console.error("Delete Workspace Error:", error);
    throw error;
  }
};

export const getWorkspaceService = async(workspaceId, memberId) => {
    try {
        const workspace = await workspaceRepostry.getWorkspaceDetailsById(workspaceId);

         if (!workspace) {
      throw new clientError({
        message: "Workspace not found",
        statusCode: StatusCodes.NOT_FOUND,
        explanation: "Invalid workspace ID",
      });
    }

const isMember =  workspace.members.find((eachMember) => eachMember.memberId.toString() === memberId.toString());
  if (!isMember) {
      throw new clientError({
        message: "Forbidden",
        statusCode: StatusCodes.FORBIDDEN,
        explanation: "Only member can see detials of the workspace",
      });
    }
    return workspace;

    } catch (error) {
        throw error;
    }
}

export const getWorkspaceByJoinCodeService  = async(joinCode , userId) => {
  try {
     const workspace = await workspaceRepostry.getWorkspaceByJoinCode(joinCode);
   if(!workspace){
     throw new clientError({
        message: "Workspace not found",
        statusCode: StatusCodes.NOT_FOUND,
        explanation: "Invalid join code",
      });
   }

   const isMember = isUserMemberOfWorkspace(workspace, userId);
   if(!isMember){
     throw new clientError({
        explanation: 'User is not a member of the workspace',
        message: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
   }

   return workspace;
  } catch (error) {
    console.log(error);
    throw error;
  }

}

export const updateWorkspaceService  = async(workSpaceId, workspaceData, userId) => {
try {
    const workspace = await workspaceRepostry.getWorkspaceDetailsById(workSpaceId);
   if(!workspace){
     throw new clientError({
        message: "Workspace not found",
        statusCode: StatusCodes.NOT_FOUND,
        explanation: "Invalid join code",
      });
   }
   console.log(`workspace data : ${workspace}`);
   
const isAdmin = isUserAdminOfWorkspace(workspace, userId);
console.log(`is admin : ${isAdmin}`);

if(!isAdmin){
     throw new clientError({
        explanation: 'User is not an admin of the workspace',
        message: 'User is not an admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
}

const updatedWorkSpace = await workspaceRepostry.update(workSpaceId, workspaceData);
return updatedWorkSpace;

} catch (error) {
  console.log(`in servie update error : ${error}`);
  
    throw error
}


}

export const addMemberToWorkspaceService  = async(workspaceId, memberId, role, userId) => {
  try {
    const workspace = await workspaceRepostry.getWorkspaceDetailsById(workspaceId);
   if(!workspace){
     throw new clientError({
        message: "Workspace not found",
        statusCode: StatusCodes.NOT_FOUND,
        explanation: "Invalid join code",
      });
   }

   const isAdmin = isUserAdminOfWorkspace(workspace, userId);
   if(!isAdmin){
     throw new clientError({
        explanation: 'User is not an admin of the workspace',
        message: 'User is not an admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
   }

   const isValidUser = await userRepositories.getById(memberId);

   if(!isValidUser){
    throw new clientError({
        message: "no user found",
        statusCode: StatusCodes.NOT_FOUND,
        explanation: "Invalid Id code",
      });
   }

   const isAlreadyMember = isUserMemberOfWorkspace(workspace, memberId);

   if(isAlreadyMember){
    throw new clientError({
        explanation: 'User is already a member of the workspace',
        message: 'User is already a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
   }

   const response = await workspaceRepostry.addMemberToWorkspace(memberId, role, workspaceId)

   addEmailToMailQueue({
    ...workSpaceJoinMail(response), to : isValidUser.email
   })


   return response;

  } catch (error) {
    throw error;
  }
}

export const addChannelToWorkspaceService  = async(workspaceId, channelName, userId) => {
    try {
   const workspace = await workspaceRepostry.getWorkspaceDetailsById(workspaceId);
   if(!workspace){
     throw new clientError({
        message: "Workspace not found",
        statusCode: StatusCodes.NOT_FOUND,
        explanation: "Invalid join code",
      });
   }

   const isAdmin = isUserAdminOfWorkspace(workspace, userId);
   if(!isAdmin){
     throw new clientError({
        explanation: 'User is not an admin of the workspace',
        message: 'User is not an admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
   }

const channelExist = isChannelAlredyPartOfWorkSpace(workspace, channelName);
if (channelExist) {
      throw new clientError({
        explanation: 'Invalid data sent from the client',
        message: 'Channel already part of workspace',
        statusCode: StatusCodes.FORBIDDEN
      });
    }

  const response = await workspaceRepostry.addChannelToWorkspace(workspaceId, channelName);
    return response;

    } catch (error) {
        console.log(`channel error : ${error}`);
        throw error;
    }
}
