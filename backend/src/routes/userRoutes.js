import express from "express";
import {
  authMe,
  getProfiles,
  updateProfiles,
  changePassword,
} from "../controllers/userControllers.js";
const router = express.Router();

router.get("/me", authMe);
router.get("/profiles", getProfiles);
router.put("/profiles", updateProfiles);
router.put("/change-password", changePassword);

export default router;
