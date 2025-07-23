import mongoose, { Mongoose } from "mongoose";

const workSpaceSchema = new mongoose.Schema({
    name : {
        type : String,
       unique : true,
        required : [true, "name is required"]
    },
    description : {
        type : String
    }, 
    members : [
        {
            memberId : {
                type : mongoose.Schema.Types.ObjectId,
                 ref : "User",
        required : [true, "memeberId is required"]
            },
            role : {
                type : String,
                enum : ["admin", "member"],
                default : "member"
            }
        }
    ],
    joinCode : {
        type : String,
        required : [true, "join code is required"]
    },
    channels : [
        {
            type : mongoose.Schema.Types.ObjectId,
             ref : "channel",
        required : [true, "channel is required"]
        }
    ]
})

const WorkSpace = mongoose.model("workspace", workSpaceSchema);

export default WorkSpace;