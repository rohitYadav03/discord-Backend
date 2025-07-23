import { StatusCodes } from "http-status-codes";
import channelRepostry from "../repositories/channelRepository.js";
import clientError from "../utils/Error/clientError.js";

export const getChannelByIdService = async(channelId , userId) => {
try {
const channelDetails = await channelRepostry.getChannelByIddetails(channelId);

if(!channelDetails){
    throw new clientError({
                   message : "channel not found with the given Id",
                    explanation : "channel not found",
                    statusCode : StatusCodes.NOT_FOUND
    })
}
const isUserMemebrOfWorkSpace = channelDetails.workspaceId.members.find((eachMember) =>  eachMember.memberId.toString() === userId.toString())

if(!isUserMemebrOfWorkSpace){
 throw new clientError({
                   message : "user not part of wrokspace",
                    explanation : "user not part of workspace",
                    statusCode : StatusCodes.FORBIDDEN
    })
}
return channelDetails;
} catch (error) {
    console.log("error channel service",error);
    throw error;
}
}