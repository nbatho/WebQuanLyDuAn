import express from 'express';
import {
  getPrioritiesBySpaceId,
  createTaskPriority,
  getPriorityById,
  updateTaskPriority,
  deleteTaskPriority,
  reorderPriority,
} from '../controllers/taskPriorityController.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/priorities/spaces/{spaceId}:
 *   get:
 *     summary: Lấy danh sách priority theo Space
 *     tags: [Task Priority]
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách priority
 */
router.get('/spaces/:spaceId', getPrioritiesBySpaceId);

/**
 * @swagger
 * /api/v1/priorities/spaces/{spaceId}:
 *   post:
 *     summary: Tạo priority mới cho Space
 *     tags: [Task Priority]
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
 *             required: [priorityName]
 *             properties:
 *               priorityName:
 *                 type: string
 *               color:
 *                 type: string
 *               position:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Priority đã được tạo
 */
router.post('/spaces/:spaceId', createTaskPriority);

/**
 * @swagger
 * /api/v1/priorities/{priorityId}:
 *   get:
 *     summary: Lấy chi tiết priority
 *     tags: [Task Priority]
 *     parameters:
 *       - in: path
 *         name: priorityId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết priority
 */
router.get('/:priorityId', getPriorityById);

/**
 * @swagger
 * /api/v1/priorities/{priorityId}:
 *   put:
 *     summary: Cập nhật priority
 *     tags: [Task Priority]
 *     parameters:
 *       - in: path
 *         name: priorityId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               priorityName:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Priority đã được cập nhật
 */
router.put('/:priorityId', updateTaskPriority);

/**
 * @swagger
 * /api/v1/priorities/{priorityId}:
 *   delete:
 *     summary: Xóa priority
 *     tags: [Task Priority]
 *     parameters:
 *       - in: path
 *         name: priorityId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Priority đã được xóa
 */
router.delete('/:priorityId', deleteTaskPriority);

/**
 * @swagger
 * /api/v1/priorities/{priorityId}/reorder:
 *   put:
 *     summary: Thay đổi thứ tự priority
 *     tags: [Task Priority]
 *     parameters:
 *       - in: path
 *         name: priorityId
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
 *         description: Priority đã được sắp xếp lại
 */
router.put('/:priorityId/reorder', reorderPriority);

export default router;
