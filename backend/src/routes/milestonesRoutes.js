import express from "express";
import {
  getMilestonesBySpaceId,
  createMilestone,
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
} from "../controllers/milestonesController.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Milestones
 *     description: Milestone management within spaces
 */

/**
 * @swagger
 * /api/v1/milestones/spaces/{spaceId}/milestones:
 *   get:
 *     summary: Get all milestones in a space
 *     tags: [Milestones]
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the space
 *     responses:
 *       200:
 *         description: List of milestones with task progress
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   milestone_id:
 *                     type: integer
 *                   space_id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [on_track, at_risk, completed, cancelled]
 *                   color:
 *                     type: string
 *                   due_date:
 *                     type: string
 *                     format: date
 *                   created_by:
 *                     type: integer
 *                   creator_name:
 *                     type: string
 *                   total_tasks:
 *                     type: integer
 *                   done_tasks:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Invalid space ID
 *       500:
 *         description: Server error
 */

router.get("/spaces/:spaceId/milestones", getMilestonesBySpaceId);

/**
 * @swagger
 * /api/v1/milestones/spaces/{spaceId}/milestones:
 *   post:
 *     summary: Create a new milestone in a space
 *     tags: [Milestones]
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the space
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Version 1.0 Release"
 *               description:
 *                 type: string
 *                 example: "First major release with core features"
 *               status:
 *                 type: string
 *                 enum: [on_track, at_risk, completed, cancelled]
 *                 default: on_track
 *                 example: "on_track"
 *               color:
 *                 type: string
 *                 example: "#00D4AA"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-06-30"
 *     responses:
 *       201:
 *         description: Milestone created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */

router.post("/spaces/:spaceId/milestones", createMilestone);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 milestone_id:
 *                   type: integer
 *                 space_id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [on_track, at_risk, completed, cancelled]
 *                 color:
 *                   type: string
 *                 due_date:
 *                   type: string
 *                   format: date
 *                 creator_name:
 *                   type: string
 *                 total_tasks:
 *                   type: integer
 *                 done_tasks:
 *                   type: integer
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

router.put("/:milestoneId", updateMilestone);

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

router.delete("/:milestoneId", deleteMilestone);

export default router;
