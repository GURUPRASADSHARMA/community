import { Router } from "express";
import { acceptRequest, findMe, findUser, pendingRequest, refreshAccessToken, registerUser, sendFriendRequest, userLogin, userLogout, verifyEmail } from "../controllers/user.controller.js";
import { verifyJwtToken } from "../middleware/auth.js"
import { upload } from "../middleware/multer.middleware.js";


const router=Router()
router.route("/register").post(
    upload.fields([
        {
            name:"profileImage",
            maxCount:1
        }
    ])
    ,registerUser)
router.route("/verifyemail").post(verifyEmail)
router.route("/login").post(userLogin)
router.route("/logout").post(verifyJwtToken,userLogout)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/find-user").post(findUser)
router.route("/send-request").post(verifyJwtToken,sendFriendRequest)
router.route("/pending-request").get(pendingRequest)
router.route("/accept-request").get(acceptRequest)
router.route("/findMe").get(verifyJwtToken,findMe)


export default router