import express from 'express';
import {
  getActivitiesByTaskId,
  createActivityLog,
  getMyActivities,
  getActivitiesBySpaceId,
} from '../controllers/activityLogController.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/activities/me:
 *   get:
 *     summary: Lấy danh sách hoạt động của tôi
 *     tags: [Activity Logs]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Danh sách activities
 */
router.get('/me', getMyActivities);

/**
 * @swagger
 * /api/v1/activities/spaces/{spaceId}:
 *   get:
 *     summary: Lấy danh sách hoạt động theo Space
 *     tags: [Activity Logs]
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Danh sách activities
 */
router.get('/spaces/:spaceId', getActivitiesBySpaceId);

/**
 * @swagger
 * /api/v1/activities/tasks/{taskId}:
 *   get:
 *     summary: Lấy danh sách hoạt động theo Task
 *     tags: [Activity Logs]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Danh sách activities
 */
router.get('/tasks/:taskId', getActivitiesByTaskId);

/**
 * @swagger
 * /api/v1/activities/tasks/{taskId}:
 *   post:
 *     summary: Tạo activity log cho task
 *     tags: [Activity Logs]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [action]
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [created, updated, deleted, status_changed, priority_changed, assigned, unassigned, commented, attachment_added, attachment_removed, due_date_changed, start_date_changed, moved, archived, restored, timer_started, timer_stopped, sprint_assigned, milestone_assigned, tag_added, tag_removed, subtask_added, story_points_changed]
 *               oldValue:
 *                 type: object
 *               newValue:
 *                 type: object
 *     responses:
 *       201:
 *         description: Activity log đã được tạo
 */
router.post('/tasks/:taskId', createActivityLog);

export default router;
