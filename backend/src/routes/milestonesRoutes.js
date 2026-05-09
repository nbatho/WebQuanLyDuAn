import express from "express";
import {
  getMilestonesBySpaceId,
  createMilestone,
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
} from "../controllers/milestonesController.js";

// Import Middleware Phân quyền
import { requirePermission } from '../middlewares/roleMiddlewares.js';

const router = express.Router();

router.get("/spaces/:spaceId/milestones", getMilestonesBySpaceId);

// Tạo milestone -> Yêu cầu quyền: SETTING_MANAGE (Admin + Manager)
router.post("/spaces/:spaceId/milestones", requirePermission('SETTING_MANAGE'), createMilestone);

/**
 * @swagger
 * /api/v1/milestones/{milestoneId}:
 *   get:
 *     summary: Get milestone details by ID
 *     tags: [Milestones]
 *     parameters:
 *       - in: path
 *         name: milestoneId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the milestone
 *     responses:
 *       200:
 *         description: Milestone details with task progress
 *       400:
 *         description: Invalid milestone ID
 *       404:
 *         description: Milestone not found
 *       500:
 *         description: Server error
 */

router.get("/:milestoneId", getMilestoneById);

/**
 * @swagger
 * /api/v1/milestones/{milestoneId}:
 *   put:
 *     summary: Update a milestone
 *     tags: [Milestones]
 *     parameters:
 *       - in: path
 *         name: milestoneId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the milestone
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Milestone Name"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               status:
 *                 type: string
 *                 enum: [on_track, at_risk, completed, cancelled]
 *                 example: "at_risk"
 *               color:
 *                 type: string
 *                 example: "#FF6B6B"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-07-15"
 *     responses:
 *       200:
 *         description: Milestone updated successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Milestone not found
 *       500:
 *         description: Server error
 */

// Cập nhật milestone -> Yêu cầu quyền: SETTING_MANAGE (Admin + Manager)
router.put("/:milestoneId", requirePermission('SETTING_MANAGE'), updateMilestone);

/**
 * @swagger
 * /api/v1/milestones/{milestoneId}:
 *   delete:
 *     summary: Delete a milestone
 *     tags: [Milestones]
 *     parameters:
 *       - in: path
 *         name: milestoneId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the milestone
 *     responses:
 *       200:
 *         description: Milestone deleted successfully
 *       400:
 *         description: Invalid milestone ID
 *       404:
 *         description: Milestone not found
 *       500:
 *         description: Server error
 */

// Xóa milestone -> Yêu cầu quyền: SETTING_MANAGE (Admin + Manager)
router.delete("/:milestoneId", requirePermission('SETTING_MANAGE'), deleteMilestone);

export default router;
