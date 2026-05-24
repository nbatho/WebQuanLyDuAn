import express from "express";
import {
  authMe,
  getProfiles,
  updateProfiles,
  changePassword,
  requestPasswordChangeOtp,
  verifyAndChangePassword,
} from "../controllers/userControllers.js";
const router = express.Router();

router.get("/me", authMe);
router.get("/profiles", getProfiles);
router.put("/profiles", updateProfiles);
router.put("/change-password", changePassword);
router.post("/request-password-otp", requestPasswordChangeOtp);
router.post("/verify-change-password", verifyAndChangePassword);

export default router;
