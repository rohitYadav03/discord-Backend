import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    body : {
        type : String,
        required : [true, "Body is required"]
    },
    image : {
        type : String
    },
    channeId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "channel",
        required : [true, "channel is required"]
        
    },
    senderId : {
       type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true, "senderId is required"]
    },
    workSpaceId :  {
       type : mongoose.Schema.Types.ObjectId,
       ref : "Workspace",
       required : [true , "Workspace Id is required"]
    }
});


const Message  = mongoose.model("message", messageSchema);
export default Message;