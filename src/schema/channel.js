import mongoose, { Mongoose } from "mongoose";


const channelSchema = new mongoose.Schema(
    {
    name : {
        type : String,
        required : [true, "Channel name is required"]
    },
    workspaceId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "workspace",
        required : [true, "workspaceId is required"]
    }
}, {timestamps : true});

const Channel = mongoose.model("channel", channelSchema);

export default Channel;