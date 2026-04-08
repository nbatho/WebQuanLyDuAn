import express from "express";
import { chatWithAI } from "../controllers/aiController.js";
import { checkAuth } from "../middleware/checkAuth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: AI
 */

router.post("/chat", chatWithAI);

export default router;
