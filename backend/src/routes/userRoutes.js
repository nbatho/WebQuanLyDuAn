import express from "express";
import {
  authMe,
  getProfiles,
  updateProfiles,
} from "../controllers/userControllers.js";
const router = express.Router();

router.get("/me", authMe);
router.get("/profiles", getProfiles);
router.put("/profiles", updateProfiles);

export default router;
