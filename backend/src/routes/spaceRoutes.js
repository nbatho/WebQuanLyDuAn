import express from "express";
import {
  getSpacesByWorkspaceId,
  createSpace,
  getSpaceById,
  updateSpaces,
  deleteSpaces,
  getSpaceMembers,
} from "../controllers/spaceController.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Spaces
 */

/**
 * @swagger
 * /api/v1/spaces/workspaces/{workspaceId}:
 *   get:
 *     summary: Get all spaces in a workspace
 *     tags: [Spaces]
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *          type: string
 *     responses:
 *       200:
 *         description: List of spaces in the workspace
 *       400:
 *         description: Invalid workspace ID
 *       500:
 *         description: Server error
 *
 */

router.get("/workspaces/:workspaceId", getSpacesByWorkspaceId);

/**
 * @swagger
 * /api/v1/spaces/workspaces/{workspaceId}:
 *   post:
 *     summary: Create a new space in a workspace
 *     tags: [Spaces]
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
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
 *                 example: "My Space"
 *               description:
 *                 type: string
 *                 example: "A description for the space"
 *               isPrivate:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Space created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */

router.post("/workspaces/:workspaceId", createSpace);

/**
 * @swagger
 * /api/v1/spaces/{spaceId}:
 *   get:
 *     summary: Get space details by ID
 *     tags: [Spaces]
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Space details
 *       400:
 *         description: Invalid space ID
 *       404:
 *         description: Space not found
 *       500:
 *         description: Server error

 */

router.get("/:spaceId", getSpaceById);

/**
 * @swagger
 * /api/v1/spaces/{spaceId}:
 *   put:
 *    summary: Update space details
 *    tags: [Spaces]
 *    parameters:
 *      - in: path
 *        name: spaceId
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: "Updated Space Name"
 *              description:
 *                type: string
 *                example: "An updated description for the space"
 *              isPrivate:
 *                type: boolean
 *                example: false
 *    responses:
 *      200:
 *        description: Space updated successfully
 *      400:
 *        description: Invalid request data
 *      404:
 *        description: Space not found
 *      500:
 *        description: Server error
 */


router.put("/:spaceId", updateSpaces);

/**
 * @swagger
 * /api/v1/spaces/{spaceId}:
 *   delete:
 *     summary: Delete a space
 *     tags: [Spaces]
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Space deleted successfully
 *       400:
 *         description: Invalid space ID
 *       404:
 *         description: Space not found
 *       500:
 *         description: Server error
 */

router.delete("/:spaceId", deleteSpaces);

/**
 * @swagger
 * /api/v1/spaces/{spaceId}/members:
 *   get:
 *     summary: Get members of a space
 *     tags: [Spaces]
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of space members
 *       400:
 *         description: Invalid space ID
 *       500:
 *         description: Server error
 */


router.get("/:spaceId/members", getSpaceMembers);

export default router;
