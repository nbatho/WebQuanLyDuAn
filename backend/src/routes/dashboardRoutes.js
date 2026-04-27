import express from 'express';
import {
  getKanbanBoard,
  getMyTaskSummary,
  getSpaceStats,
  getWorkspaceStats,
} from '../controllers/dashboardController.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/dashboard/kanban/{spaceId}:
 *   get:
 *     summary: Lấy Kanban board data cho Space
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kanban board data với đầy đủ thông tin task
 */
router.get('/kanban/:spaceId', getKanbanBoard);

/**
 * @swagger
 * /api/v1/dashboard/my-summary:
 *   get:
 *     summary: Lấy thống kê task của tôi
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: spaceId
 *         schema:
 *           type: integer
 *         description: Filter theo space (optional)
 *     responses:
 *       200:
 *         description: Thống kê task (total, done, overdue, time)
 */
router.get('/my-summary', getMyTaskSummary);

/**
 * @swagger
 * /api/v1/dashboard/spaces/{spaceId}:
 *   get:
 *     summary: Lấy thống kê tổng quan Space
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thống kê space (total_tasks, completed, overdue, members, time)
 */
router.get('/spaces/:spaceId', getSpaceStats);

/**
 * @swagger
 * /api/v1/dashboard/workspaces/{workspaceId}:
 *   get:
 *     summary: Lấy thống kê tổng quan Workspace
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thống kê workspace (total_spaces, total_tasks, completed, members)
 */
router.get('/workspaces/:workspaceId', getWorkspaceStats);

export default router;
