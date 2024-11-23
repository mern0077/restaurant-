import express from "express";
import { checkAuth, forgotPassword, login, logOut, resetpassword, signUp, updateProfile, verifyEmail } from "../controller/user.controller.js";
import { isAuthencated } from "../middlewares/isAuthencated.js";


const router = express.Router();

router.route("/check-auth").get(isAuthencated, checkAuth);
router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/logout").post(logOut);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetpassword);
router.route("/profile/update").put(isAuthencated,updateProfile);
  
export default router;