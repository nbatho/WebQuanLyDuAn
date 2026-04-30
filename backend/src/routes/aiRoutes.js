import express from "express";
import { chatWithAI, generateDescription, suggestPriority } from "../controllers/aiController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: AI
 */

router.post("/chat", chatWithAI);
router.post("/generate-description", generateDescription);
router.post("/suggest-priority", suggestPriority);

export default router;
