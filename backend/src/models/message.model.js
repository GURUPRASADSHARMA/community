import mongoose from 'mongoose'


const messageSchema = new mongoose.Schema({

    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    recieverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    roomId:{
        type:String,
        index:true
    },

    status:{
        type:String,
        index:["sent","delivered","read"],
        default:"sent",
        index:true
    },

    message:{
        type:String,
        required:true,
        trim:true
    },

},{timestamps:true})

export const Message = mongoose.model("Message",messageSchema);