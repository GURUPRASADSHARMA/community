import mongoose from "mongoose"
import { asyncHandler } from "../asyncHandler.js"
import { FriendRequest } from "../models/friendsRequest.moddels.js"
import { User } from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/apiResponse.js"
// import ApiResponse from "../utils/ApiResponse"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import SendVerificationCode from "../utils/SendVerificationCode.js"

const generateAccessAndRefreshToken = async (userId) => {

    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAcessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        console.log("problem during creating or setting tokens")
        throw new ApiError(400, "problem during setting or creating tokens")
    }

}


const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, fullname } = req.body

    if (
        [username, email, password, fullname].some((field) => field?.trim() == "")
    ) {
        throw new ApiError(400, "all field are required")
    }
    const existingUserWithSameUsername = await User.findOne({ username });
    if (existingUserWithSameUsername) {
        throw new ApiError(409, "Username is already taken");
    }
    // const existedUserByUsername = await User.findOne({
    //     username: username,
    //     isVerified: true
    // })
    // if (existedUserByUsername) {
    //     throw new ApiError(409,"username is already taken")
    // }

    const existedUserByEmail = await User.findOne({ email: email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existedUserByEmail) {
        if (existedUserByEmail.isVerified) {
            throw new ApiError(409, "email is already registered");
        }
        else {
            existedUserByEmail.username = username;
            existedUserByEmail.password = password;
            existedUserByEmail.fullname = fullname;
            existedUserByEmail.verifyCode = verifyCode;
            existedUserByEmail.expireyVerificationCode = new Date(Date.now() + 3600000);
            const profileImagePath = req.files?.profileImage?.[0]?.path;
            if (!profileImagePath) throw new ApiError(400, "Profile image path is missing");
            const uploaded = await uploadOnCloudinary(profileImagePath);
            if (!uploaded) throw new ApiError(400, "Failed to upload profile image");
            existedUserByEmail.profileImage = uploaded?.url
            await existedUserByEmail.save();
        }
    }
    else {

        const profileImagePath = req.files?.profileImage?.[0]?.path;
        if (!profileImagePath) throw new ApiError(400, "Profile image path is missing");
        const uploaded = await uploadOnCloudinary(profileImagePath);
        if (!uploaded) throw new ApiError(400, "Failed to upload profile image");
        const user = await User.create({
            username: username,
            fullname,
            email,
            password,
            profileImage: uploaded?.url,
            verifyCode: verifyCode,
            expireyVerificationCode: new Date(Date.now() + 3600000)

        })
    }

    const sendEmailResponse = await SendVerificationCode(email, username, verifyCode);
    if (!sendEmailResponse) {
        throw new ApiError(500, "their is an error during email verification")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "user registered succesfully"))

})

const verifyEmail = asyncHandler(async (req, res) => {
    console.log("verifyemail")
    const { email, verifyCode } = req.body
    console.log(email)
    console.log(verifyCode)
    if (!email || !verifyCode) {
        throw new ApiError(400, "please provide valid credential")
    }
    const user = await User.findOne({ email: email }).select("-refreshToken -password -friends")

    if (!user) {
        throw new ApiError(404, "please provide an valid email")
    }


    if (user.verifyAttempt == 0) {
        throw new ApiError(429, "Too many incorrect attempts. Try again later.");
    }

    if (user.verifyCode != verifyCode) {
        user.verifyAttempt--;
        await user.save();
        throw new ApiError(404, "invalid verification code")
    }

    if (user.expireyVerificationCode < Date.now()) {
        throw new ApiError(404, "your token is invalid")
    }
    if (user.verifyCode == verifyCode)
        user.isVerified = true;
    user.verifyAttempt = 0;

    await user.save()
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "user verified sucessfully"))

})

const userLogin = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({
        $or: [{ username }, { password }]
    })
    if (!user) {
        throw new ApiError(400, "account does not available")
    }

    if (!user.isVerified) {
        throw new ApiError(404, "please verify your email before login")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "password is incorrect")

    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -verifyCode -expireyVerificationCode")
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            {
                user: loggedInUser
            },
            "user logged in sucessfully"
        ))
})

const userLogout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }

    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "logged out successfully"))


})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "invalid refresh Token")
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "invalid refresh Token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, " refresh Token is expired or used")
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("acessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken }, "acess token get refreshed"))

    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
    }

})

const findUser = asyncHandler(async (req, res) => {
    const { username } = req.body

    const users = await User.find({
        username: { $regex: username, $options: "i" }
    }).select(" -password -refreshToken ").limit(10).sort({ username: 1 })
    if (users.length == 0) {
        throw new ApiError(400, "no user of this username is found ")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, users, "user found sucessfully"))
})

const changeProfileImage = asyncHandler(async (req, res) => {
    const newProfileImagePath = req.files?.path
    const newProfileUrl = await uploadOnCloudinary(newProfileImagePath)
    if (!newProfileUrl.url) {
        throw new ApiError(400, "error occured during uploading profile")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                profileImage: newProfileUrl.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, { user }, "profile image updated succesfully"))

})

const passwordReset = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "old password does not matched")
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false })
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "your password reset sucessfuly"))

})

const findMe = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user?._id).select("-password -refreshToken");
        if (!user) {
            throw new Error("your token is expired")
        }
        return res
            .status(200)
            .json(new ApiResponse(200, {
                user
            }, "user verified succesfully"))

    } catch (error) {
        console.log(req.user)
        throw new Error("please refresh the token.token is invalid")
    }
})

const sendFriendRequest = asyncHandler(async (req, res) => {

    const { receiverId } = req.body;
    const senderId = req.user._id;
    // console.log(receiverId)
    // console.log(senderId)
    if (!receiverId) {
        throw new ApiError(400, "please provide a valid receiverId")
    }
    if (senderId.toString() === receiverId.toString()) {
        throw new ApiError(400, "you cannot send follow request to yourself")
    }
    const receiver = await User.findById(receiverId).select("_id username");
    if (!receiver) {
        throw new ApiError(404, "Receiver not found");
    }
    try {
        const existingRequest = await FriendRequest.findOne({ sender: senderId, receiver: receiverId })
        if (existingRequest) {
            throw new ApiError(409, "request already sent")
        }

        const friendRequest = new FriendRequest({ sender: senderId, receiver: receiverId })
        await friendRequest.save({ validateBeforeSave: false })


        // loaded and slower version or logic

        // const reciever = await User.findById(receiverId).select("-password -refreshToken -friends -requestSent -pendingRequest")
        // if (!reciever) {
        //     throw new ApiError(404, "Receiver not found");
        // }
        // reciever.pendingRequest.push(senderId);
        // await reciever.save()
        // const sender = await User.findByIdAndUpdate(senderId,
        //     {
        //         $push: { requestSent: receiverId || "" }
        //     },
        //     { new: true }
        // )

        //faster logic and less db call

        await Promise.all([
            User.findByIdAndUpdate(senderId, { $addToSet: { requestSent: receiverId } }),
            User.findByIdAndUpdate(receiverId, { $addToSet: { pendingRequest: senderId } })

        ])
        return res
            .status(200)
            .json(new ApiResponse(200, { receiver: receiver?.username }, "friend request sent succesfully"))
    } catch (error) {
        throw new ApiError(500, error.message || "error during sending friend request")
    }
})

const pendingRequest = asyncHandler(async (req, res) => {
    try {
        const request = await FriendRequest.find({
            receiver: req.user?._id,
            status: "pending"
        }).populate("sender", "username email profileImage _id fullname")
         if (request.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "No friends found"));}
        return res
            .status(200)
            .json(new ApiResponse(200, request, "pending request fetched succesfully"))

    } catch (error) {
        throw new ApiError(500, error.message || "error during fetching request")
    }
})
const requestSent = asyncHandler(async (req, res) => {
    try {
        const request = await FriendRequest.find({
            sender: req.user?._id,
            status: "pending"
        }).populate("receiver", "username email profileImage _id fullname")
        if (request.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "No friends found"));}
        return res
            .status(200)
            .json(new ApiResponse(200, request, "pending request fetched succesfully"))

    } catch (error) {
        throw new ApiError(500, error.message || "error during fetching request")
    }
})

const acceptRequest = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession()
    const { senderUsername } = req.body
    if (!senderUsername) {
        throw new ApiError(404, "please provide a valid username to accept the friend request")
    }
    const sender = await User.findOne({
        username: senderUsername
    }).select(" _id username ")
    const receiverId = req.user?._id;
    if (!receiverId) {
        throw new ApiError(404, "please login")
    }
    if (senderUsername === req.user.username) {
        throw new ApiError(400, "Cannot accept your own friend request");
    }
    session.startTransaction();
    try {
        const updateFriendRequestModel = await FriendRequest.findOneAndUpdate({
            senderId: sender?._id,
            receiverId: receiverId
        },
            { status: "accepted" },
            { new: true, session }
        )

        if (!updateFriendRequestModel) {
            throw new ApiError(404, "failed to update friendrequest model")
        }
        const recieverUsername = req.user?.username
        await session.commitTransaction();
        session.endSession()
        return res.status(202).json({
            message: `${sender.username} and ${recieverUsername} are now friends`
        });
    } catch (error) {
        await session.abortTransaction()
        throw new ApiError(500, "something went wrong during accepting friend request")
    }

})

const getFriends = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const friends = await FriendRequest.find({
        $or: [
            {
                sender: userId,
                status: "accepted"
            },
            {
                receiver: userId,
                status: "accepted"
            }
        ]
    })
        .populate("sender", "username fullname _id profileImage email")
        .populate("receiver", "username fullname _id profileImage email")


        if (friends.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "No friends found"));
}

    const friendList = friends.map((req) => {
        const isSender = req.sender._id.toString() === userId.toString();
        const friendUser = isSender ? req.receiver : req.sender

        return {
            _id: friendUser._id,
            username: friendUser.username,
            fullname: friendUser.fullname,
            email: friendUser.email,
            profileImage: friendUser.profileImage,

        }
    })

return res
.status(200)
.json(new ApiResponse(200,friendList,"friends are fetched sucessfully"))

})




export {
    registerUser,
    userLogin,
    userLogout,
    refreshAccessToken,
    findUser,
    changeProfileImage,
    passwordReset,
    sendFriendRequest,
    pendingRequest,
    acceptRequest,
    findMe,
    verifyEmail,
    getFriends,
    requestSent
}