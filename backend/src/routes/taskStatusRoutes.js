import express from 'express';
import {
  getStatusesBySpaceId,
  createTaskStatus,
  getStatusById,
  updateTaskStatus,
  deleteTaskStatus,
  reorderStatus,
} from '../controllers/taskStatusController.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/statuses/spaces/{spaceId}:
 *   get:
 *     summary: Lấy danh sách status theo Space
 *     tags: [Task Status]
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách status
 */
router.get('/spaces/:spaceId', getStatusesBySpaceId);

/**
 * @swagger
 * /api/v1/statuses/spaces/{spaceId}:
 *   post:
 *     summary: Tạo status mới cho Space
 *     tags: [Task Status]
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [statusName]
 *             properties:
 *               statusName:
 *                 type: string
 *               color:
 *                 type: string
 *               position:
 *                 type: integer
 *               isDoneState:
 *                 type: boolean
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Status đã được tạo
 */
router.post('/spaces/:spaceId', createTaskStatus);

/**
 * @swagger
 * /api/v1/statuses/{statusId}:
 *   get:
 *     summary: Lấy chi tiết status
 *     tags: [Task Status]
 *     parameters:
 *       - in: path
 *         name: statusId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết status
 */
router.get('/:statusId', getStatusById);

/**
 * @swagger
 * /api/v1/statuses/{statusId}:
 *   put:
 *     summary: Cập nhật status
 *     tags: [Task Status]
 *     parameters:
 *       - in: path
 *         name: statusId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statusName:
 *                 type: string
 *               color:
 *                 type: string
 *               isDoneState:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Status đã được cập nhật
 */
router.put('/:statusId', updateTaskStatus);

/**
 * @swagger
 * /api/v1/statuses/{statusId}:
 *   delete:
 *     summary: Xóa status
 *     tags: [Task Status]
 *     parameters:
 *       - in: path
 *         name: statusId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Status đã được xóa
 */
router.delete('/:statusId', deleteTaskStatus);

/**
 * @swagger
 * /api/v1/statuses/{statusId}/reorder:
 *   put:
 *     summary: Thay đổi thứ tự status
 *     tags: [Task Status]
 *     parameters:
 *       - in: path
 *         name: statusId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [position]
 *             properties:
 *               position:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Status đã được sắp xếp lại
 */
router.put('/:statusId/reorder', reorderStatus);

export default router;