import express from 'express';
import {
  getTimeLogsByTaskId,
  getMyTimeLogs,
  getRunningTimer,
  startTimerForTask,
  stopTimerById,
  deleteTimeLogById,
  getTotalTime,
} from '../controllers/timeLogController.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/timelogs/me:
 *   get:
 *     summary: Lấy danh sách time log của tôi
 *     tags: [Time Logs]
 *     responses:
 *       200:
 *         description: Danh sách time logs
 */
router.get('/me', getMyTimeLogs);

/**
 * @swagger
 * /api/v1/timelogs/running:
 *   get:
 *     summary: Lấy timer đang chạy của tôi
 *     tags: [Time Logs]
 *     responses:
 *       200:
 *         description: Timer đang chạy (null nếu không có)
 */
router.get('/running', getRunningTimer);

/**
 * @swagger
 * /api/v1/timelogs/tasks/{taskId}:
 *   get:
 *     summary: Lấy danh sách time log theo task
 *     tags: [Time Logs]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách time logs
 */
router.get('/tasks/:taskId', getTimeLogsByTaskId);

/**
 * @swagger
 * /api/v1/timelogs/tasks/{taskId}/total:
 *   get:
 *     summary: Lấy tổng thời gian theo task
 *     tags: [Time Logs]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tổng thời gian (seconds)
 */
router.get('/tasks/:taskId/total', getTotalTime);

/**
 * @swagger
 * /api/v1/timelogs/tasks/{taskId}/start:
 *   post:
 *     summary: Bắt đầu timer cho task
 *     tags: [Time Logs]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Timer đã bắt đầu
 *       409:
 *         description: Đã có timer đang chạy
 */
router.post('/tasks/:taskId/start', startTimerForTask);

/**
 * @swagger
 * /api/v1/timelogs/{timeLogId}/stop:
 *   put:
 *     summary: Dừng timer
 *     tags: [Time Logs]
 *     parameters:
 *       - in: path
 *         name: timeLogId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Timer đã dừng
 */
router.put('/:timeLogId/stop', stopTimerById);

/**
 * @swagger
 * /api/v1/timelogs/{timeLogId}:
 *   delete:
 *     summary: Xóa time log
 *     tags: [Time Logs]
 *     parameters:
 *       - in: path
 *         name: timeLogId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Time log đã được xóa
 */
router.delete('/:timeLogId', deleteTimeLogById);

export default router;
