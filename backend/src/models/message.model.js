import mongoose from 'mongoose'


const messageSchema = new mongoose.Schema({

    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },

    roomId:{
        type:String,
        index:true
    },

    status:{
        type:String,
        enum:["sent","delivered","read"],
        default:"sent",
        index:true
    },

    message:{
        type:String,
        required:true,
        trim:true
    },

    deliveredAt: { type: Date },
    readAt: { type: Date },

},{timestamps:true})

export const Message = mongoose.model("Message",messageSchema);