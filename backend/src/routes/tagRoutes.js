import express from 'express';
import {
  getTagsBySpaceId,
  createTags,
  getTagById,
  updateTags,
  deleteTags,
  getTaskTags,
  addTagToTasks,
  removeTagFromTasks,
} from '../controllers/tagController.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/tags/spaces/{spaceId}:
 *   get:
 *     summary: Lấy danh sách tag theo Space
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách tags
 */
router.get('/spaces/:spaceId', getTagsBySpaceId);

/**
 * @swagger
 * /api/v1/tags/spaces/{spaceId}:
 *   post:
 *     summary: Tạo tag mới cho Space
 *     tags: [Tags]
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
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tag đã được tạo
 */
router.post('/spaces/:spaceId', createTags);

/**
 * @swagger
 * /api/v1/tags/{tagId}:
 *   get:
 *     summary: Lấy chi tiết tag
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết tag
 */
router.get('/:tagId', getTagById);

/**
 * @swagger
 * /api/v1/tags/{tagId}:
 *   put:
 *     summary: Cập nhật tag
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tag đã được cập nhật
 */
router.put('/:tagId', updateTags);

/**
 * @swagger
 * /api/v1/tags/{tagId}:
 *   delete:
 *     summary: Xóa tag
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tag đã được xóa
 */
router.delete('/:tagId', deleteTags);

/**
 * @swagger
 * /api/v1/tags/tasks/{taskId}:
 *   get:
 *     summary: Lấy danh sách tag của task
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách tags của task
 */
router.get('/tasks/:taskId', getTaskTags);

/**
 * @swagger
 * /api/v1/tags/tasks/{taskId}:
 *   post:
 *     summary: Gán tag cho task
 *     tags: [Tags]
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
 *             required: [tagId]
 *             properties:
 *               tagId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tag đã được gán cho task
 */
router.post('/tasks/:taskId', addTagToTasks);

/**
 * @swagger
 * /api/v1/tags/tasks/{taskId}/{tagId}:
 *   delete:
 *     summary: Gỡ tag khỏi task
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tag đã được gỡ khỏi task
 */
router.delete('/tasks/:taskId/:tagId', removeTagFromTasks);

export default router;
