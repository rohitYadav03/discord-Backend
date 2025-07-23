import { StatusCodes } from "http-status-codes";
import WorkSpace from "../schema/workspace.js";
import clientError from "../utils/Error/clientError.js";
import crudRepository from "./crudRepository.js";
import User from "../schema/user.js"
import channelRepostry from "./channelRepository.js";

console.log("here in repo");

const workspaceRepostry = {
  
  
   ...crudRepository(WorkSpace),

   getWorkspaceDetailsById :  async(workSpaceId) => {
  const workSpace = await WorkSpace.findById(workSpaceId).populate('members.memberId','username email avatar')
      .populate('channels');
  if(!workSpace){
    throw new clientError({
        explanation : "Work space not found By this Id",
        statusCode : StatusCodes.NOT_FOUND,
        message : "No work space found"
    })
  }
  return workSpace;
   },

   getWorkspaceDetailsByName :  async(workSpaceName) => {
  const workSpace = await WorkSpace.findOne({name : workSpaceName});
  if(!workSpace){
    throw new clientError({
        explanation : "Work space not found By this name",
        statusCode : StatusCodes.NOT_FOUND,
        message : "No work space found"
    })
  }
  return workSpace;
   },

   getWorkspaceByJoinCode : async(joinCode) => {
  const workSpace = await WorkSpace.findOne({joinCode : joinCode});
   if(!workSpace){
    throw new clientError({
        explanation : "Work space not found By this code",
        statusCode : StatusCodes.NOT_FOUND,
        message : "No work space found"
    })
  }
  return workSpace;
   },

  
addMemberToWorkspace : async(memberId, role , workspaceId) => { 
     const workSpace = await WorkSpace.findById(workspaceId);
  if(!workSpace){
    throw new clientError({
        explanation : "Work space not found By this Id",
        statusCode : StatusCodes.NOT_FOUND,
        message : "No work space found"
    })
  }

const user = await User.findById(memberId); 
if(!user){
     throw new clientError({
        explanation : "No user found By this Id",
        statusCode : StatusCodes.NOT_FOUND,
        message : "No User found"
    })
}

const isMemberAlreadyPartOfWorkspace = workSpace.members.find(
    (member) => member.memberId.toString() === memberId.toString()
);

    if (isMemberAlreadyPartOfWorkspace) {
      throw new clientError({
        explanation: 'Invalid data sent from the client',
        message: 'User already part of workspace',
        statusCode: StatusCodes.FORBIDDEN
      });
    }

workSpace.members.push({memberId, role}); 

await workSpace.save();
return workSpace;
},

addChannelToWorkspace : async(workspaceId , channelName) => {
  const workSpace = await WorkSpace.findById(workspaceId);
  if(!workSpace){
    throw new clientError({
        explanation : "Work space not found By this Id",
        statusCode : StatusCodes.NOT_FOUND,
        message : "No work space found"
    })
  }

const channel = await channelRepostry.create({ name : channelName, workspaceId: workspaceId});
workSpace.channels.push(channel)
await workSpace.save();
return workSpace;
},

  fetchAllWorkspaceByMemberId: async function (memberId) {
    console.log(`member id ; ${memberId}`);
    
    const workspaces = await WorkSpace.find({
        'members.memberId' : memberId
    });
    return workspaces;
  }
}

export default workspaceRepostry;