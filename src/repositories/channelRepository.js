import crudRepository from "./crudRepository.js";
import Channel from "../schema/channel.js";
import clientError from "../utils/Error/clientError.js";
import { StatusCodes } from "http-status-codes";

const channelRepostry = {
    ...crudRepository(Channel),

    getChannelByIddetails : async(channelId) => {
       const response = await Channel.findById(channelId).populate("workspaceId");
       if(!response){
        throw new clientError({
            message : "channel not found with the given Id",
            explanation : "channel not found",
            statusCode : StatusCodes.NOT_FOUND
        })
       };
       return response;
    }
}

export default channelRepostry;
