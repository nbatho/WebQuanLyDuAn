import express from "express";
import {
  getSprintsBySpaceId,
  createSprint,
  getSprintById,
  updateSprint,
  deleteSprint,
} from "../controllers/sprintController.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Sprints
 *     description: Sprint management within spaces (Scrum)
 */

/**
 * @swagger
 * /api/v1/sprints/spaces/{spaceId}/sprints:
 *   get:
 *     summary: Get all sprints in a space
 *     tags: [Sprints]
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the space
 *     responses:
 *       200:
 *         description: List of sprints with task and story point progress
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sprint_id:
 *                     type: integer
 *                   space_id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   goal:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [planning, active, completed, cancelled]
 *                   velocity:
 *                     type: integer
 *                   start_date:
 *                     type: string
 *                     format: date
 *                   end_date:
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
 *                   total_story_points:
 *                     type: integer
 *                   completed_story_points:
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

router.get("/spaces/:spaceId/sprints", getSprintsBySpaceId);

/**
 * @swagger
 * /api/v1/sprints/spaces/{spaceId}/sprints:
 *   post:
 *     summary: Create a new sprint in a space
 *     tags: [Sprints]
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
 *                 example: "Sprint 1"
 *               description:
 *                 type: string
 *                 example: "First sprint of the project"
 *               goal:
 *                 type: string
 *                 example: "Complete user authentication module"
 *               status:
 *                 type: string
 *                 enum: [planning, active, completed, cancelled]
 *                 default: planning
 *                 example: "planning"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-04-07"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-04-21"
 *     responses:
 *       201:
 *         description: Sprint created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */

router.post("/spaces/:spaceId/sprints", createSprint);

/**
 * @swagger
 * /api/v1/sprints/{sprintId}:
 *   get:
 *     summary: Get sprint details by ID
 *     tags: [Sprints]
 *     parameters:
 *       - in: path
 *         name: sprintId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sprint
 *     responses:
 *       200:
 *         description: Sprint details with task and story point progress
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sprint_id:
 *                   type: integer
 *                 space_id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 goal:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [planning, active, completed, cancelled]
 *                 velocity:
 *                   type: integer
 *                 start_date:
 *                   type: string
 *                   format: date
 *                 end_date:
 *                   type: string
 *                   format: date
 *                 creator_name:
 *                   type: string
 *                 total_tasks:
 *                   type: integer
 *                 done_tasks:
 *                   type: integer
 *                 total_story_points:
 *                   type: integer
 *                 completed_story_points:
 *                   type: integer
 *       400:
 *         description: Invalid sprint ID
 *       404:
 *         description: Sprint not found
 *       500:
 *         description: Server error
 */

router.get("/:sprintId", getSprintById);

/**
 * @swagger
 * /api/v1/sprints/{sprintId}:
 *   put:
 *     summary: Update a sprint
 *     tags: [Sprints]
 *     parameters:
 *       - in: path
 *         name: sprintId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sprint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sprint 1 - Updated"
 *               description:
 *                 type: string
 *                 example: "Updated sprint description"
 *               goal:
 *                 type: string
 *                 example: "Updated sprint goal"
 *               status:
 *                 type: string
 *                 enum: [planning, active, completed, cancelled]
 *                 example: "active"
 *               velocity:
 *                 type: integer
 *                 example: 21
 *                 description: Story points completed in this sprint
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-04-07"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-04-21"
 *     responses:
 *       200:
 *         description: Sprint updated successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Sprint not found
 *       500:
 *         description: Server error
 */

router.put("/:sprintId", updateSprint);

/**
 * @swagger
 * /api/v1/sprints/{sprintId}:
 *   delete:
 *     summary: Delete a sprint
 *     tags: [Sprints]
 *     parameters:
 *       - in: path
 *         name: sprintId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sprint
 *     responses:
 *       200:
 *         description: Sprint deleted successfully
 *       400:
 *         description: Invalid sprint ID
 *       404:
 *         description: Sprint not found
 *       500:
 *         description: Server error
 */

router.delete("/:sprintId", deleteSprint);

export default router;
