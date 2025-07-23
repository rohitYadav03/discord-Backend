import channelRepostry from "../repositories/channelRepository.js";
import messageReposiyry from "../repositories/messageRepositry.js";

export const getMessagesService = async (channelId, limit, page, userId) => {
  try {
    const channelDetails = await  channelRepostry.getChannelByIddetails(channelId);
    if (!channelDetails) {
      throw new clientError({
        message: "Channel not found with the given Id",
        explanation: "Channel not found",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    // Check membership
    const isUserMember = channelDetails.workspaceId.members.find(
      (member) => member.memberId.toString() === userId.toString()
    );

    if (!isUserMember) {
      throw new clientError({
        message: "Forbidden",
        statusCode: StatusCodes.FORBIDDEN,
        explanation: "Only members can see details of the workspace",
      });
    }

    const messages = await messageReposiyry.getPaginatedMessaged(
      { channelId }, limit, page
    );

    return messages;
  } catch (error) {
    throw error;
  }
};


export const createdMessageService = async(message)=> {

  const newMessage = await messageReposiyry.create(message);
  return newMessage;
}