import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { type } from "os";


const userSchema = new Schema({

        username:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
            index:true 
        },
        fullname:{
                type:String,
                required:true,
                trim:true
        },

        email:{
            type:String,
            required:true,
            trim:true,
            lowercase:true,
            unique:true
        },
        
        profileImage:{
                type:String,
                required:true
                
        },

        password:{
            type:String,
            required:[true,"password is required"]
        },

        refreshToken:{
            type:String,
        },
        isVerified:{
            type:Boolean,
            default:false,
            required:true
        },


        verifyCode:{
            type:String,
            required:[ true || "verification code is required"],
            required:true
        },


        expireyVerificationCode:{
            type:Date,
            required:true
        },


         verifyAttempt:{
            type:Number,
            default:5
         },


        friends:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
       
        ],
        
        pendingRequest:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
             }
        ],
        requestSent:[
            {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
        ]

},{timestamps:true})

userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next();
})

userSchema.methods.isPasswordCorrect= async function (password){
    return await bcrypt.compare(password,this.password)
    
}

userSchema.methods.generateAcessToken = function (){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRATE,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIREY
        }
    )
}

userSchema.methods.generateRefreshToken= function (){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIREY
        }
    )
}

export const User = mongoose.model("User",userSchema)
//  Mongoose automatically creates the collection name in lowercase and makes it plural ie. "User" => "users"
