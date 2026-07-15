import { Router } from "express";
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  verifyEmail,
  resendOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
} from "../controllers/userAuthController";

import { protectUser } from "../middlewares/userAuthMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/profile", protectUser, getProfile);
router.put("/profile", protectUser, updateProfile);
router.post("/change-password", protectUser, changePassword);

router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password",forgotPassword);
router.post("/verify-reset-otp",verifyResetOTP);
router.post("/reset-password",resetPassword);

export default router;