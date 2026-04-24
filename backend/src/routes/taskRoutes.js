import express from 'express';
import {
    getTasksBySpaceId,
    getTasksByListId,
    getTasksByFolderId,
    createTasks,
    createTasksForList,
    getTaskById,
    updateTasks,
    deleteTasks,
    getSubTasksByTaskIds,
    getCommentsByTaskIds,
    createComments,
    getAttachmentsByTaskIds,
    createAttachments,
    deleteAttachments,
    addAssigneeToTasks,
    removeAssigneeFromTasks
} from '../controllers/taskController.js';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Tasks
 *     description: Task management endpoints
 *   - name: Subtasks
 *     description: Subtask management endpoints
 *   - name: Comments
 *     description: Task comment endpoints
 *   - name: Attachments
 *     description: Task attachment endpoints
 *   - name: Assignees
 *     description: Task assignee endpoints
 */

/**
 * @swagger
 * /api/v1/tasks/spaces/{spaceId}:
 *   get:
 *     summary: Get all tasks in a space
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the space
 *     responses:
 *       200:
 *         description: A list of tasks
 *       400:
 *         description: Bad request - Space ID is required
 *       500:
 *         description: Internal server error
 */

router.get('/spaces/:spaceId', getTasksBySpaceId);

/**
 * @swagger
 * /api/v1/tasks/lists/{listId}:
 *   get:
 *     summary: Get all tasks in a list
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the list
 *     responses:
 *       200:
 *         description: A list of tasks
 *       400:
 *         description: Bad request - List ID is required
 *       500:
 *         description: Internal server error
 */

router.get('/lists/:listId', getTasksByListId);

/**
 * @swagger
 * /api/v1/tasks/folders/{folderId}:
 *   get:
 *     summary: Get all tasks in a folder
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: folderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the folder
 *     responses:
 *       200:
 *         description: List of tasks in the folder
 *       400:
 *         description: Bad request - Folder ID is required
 *       500:
 *         description: Internal server error
 */

router.get('/folders/:folderId', getTasksByFolderId);

/**
 * @swagger
 * /api/v1/tasks/lists/{listId}:
 *   post:
 *     summary: Create a new task in a list
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the list
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
 *                 example: "Design homepage"
 *               description:
 *                 type: string
 *                 example: "Create the initial homepage design"
 *               due_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-01T00:00:00.000Z"
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Bad request - Name is required
 *       500:
 *         description: Internal server error
 */

router.post('/lists/:listId', createTasksForList);

/**
 * @swagger
 * /api/v1/tasks/spaces/{spaceId}:
 *   post:
 *     summary: Create a new task in a space
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: spaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the space
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Design homepage"
 *               description:
 *                 type: string
 *                 example: "Create the initial homepage design"
 *               due_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-01T00:00:00.000Z"
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Bad request - Name and description are required
 *       500:
 *         description: Internal server error
 */

router.post('/spaces/:spaceId', createTasks);

/**
 * @swagger
 * /api/v1/tasks/{taskId}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task
 *     responses:
 *       200:
 *         description: Task details
 *       400:
 *         description: Bad request - Task ID is required
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */

router.get('/:taskId', getTaskById);

/**
 * @swagger
 * /api/v1/tasks/{taskId}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated task name"
 *               description:
 *                 type: string
 *                 example: "Updated task description"
 *               due_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-01T00:00:00.000Z"
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Bad request - Task ID is required
 *       500:
 *         description: Internal server error
 */

router.put('/:taskId', updateTasks);

/**
 * @swagger
 * /api/v1/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       400:
 *         description: Bad request - Task ID is required
 *       500:
 *         description: Internal server error
 */

router.delete('/:taskId', deleteTasks);

/**
 * @swagger
 * /api/v1/tasks/{taskId}/subtasks:
 *   get:
 *     summary: Get all subtasks of a task
 *     tags: [Subtasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the parent task
 *     responses:
 *       200:
 *         description: A list of subtasks
 *       400:
 *         description: Bad request - Task ID is required
 *       500:
 *         description: Internal server error
 */

router.get('/:taskId/subtasks', getSubTasksByTaskIds);

/**
 * @swagger
 * /api/v1/tasks/{taskId}/comments:
 *   get:
 *     summary: Get all comments on a task
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task
 *     responses:
 *       200:
 *         description: A list of comments
 *       400:
 *         description: Bad request - Task ID is required
 *       500:
 *         description: Internal server error
 */

router.get('/:taskId/comments', getCommentsByTaskIds);

/**
 * @swagger
 * /api/v1/tasks/{taskId}/comments:
 *   post:
 *     summary: Add a comment to a task
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This task needs more details."
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Bad request - Comment content is required
 *       500:
 *         description: Internal server error
 */

router.post('/:taskId/comments', createComments);

/**
 * @swagger
 * /api/v1/tasks/{taskId}/attachments:
 *   get:
 *     summary: Get all attachments of a task
 *     tags: [Attachments]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task
 *     responses:
 *       200:
 *         description: A list of attachments
 *       400:
 *         description: Bad request - Task ID is required
 *       500:
 *         description: Internal server error
 */

router.get('/:taskId/attachments', getAttachmentsByTaskIds);

/**
 * @swagger
 * /api/v1/tasks/{taskId}/attachments:
 *   post:
 *     summary: Add an attachment to a task
 *     tags: [Attachments]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 example: "https://example.com/file.pdf"
 *               description:
 *                 type: string
 *                 example: "Project requirements document"
 *     responses:
 *       201:
 *         description: Attachment created successfully
 *       400:
 *         description: Bad request - Attachment URL is required
 *       500:
 *         description: Internal server error
 */

router.post('/:taskId/attachments', createAttachments);

/**
 * @swagger
 * /api/v1/tasks/attachments/{attachmentId}:
 *   delete:
 *     summary: Delete an attachment
 *     tags: [Attachments]
 *     parameters:
 *       - in: path
 *         name: attachmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the attachment
 *     responses:
 *       200:
 *         description: Attachment deleted successfully
 *       400:
 *         description: Bad request - Attachment ID is required
 *       500:
 *         description: Internal server error
 */

router.delete('/attachments/:attachmentId', deleteAttachments);

/**
 * @swagger
 * /api/v1/tasks/{taskId}/assignees:
 *   post:
 *     summary: Assign a user to a task
 *     tags: [Assignees]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user-uuid-123"
 *     responses:
 *       200:
 *         description: Assignee added successfully
 *       400:
 *         description: Bad request - Task ID and User ID are required
 *       500:
 *         description: Internal server error
 */

router.post('/:taskId/assignees', addAssigneeToTasks);

/**
 * @swagger
 * /api/v1/tasks/{taskId}/assignees/{userId}:
 *   delete:
 *     summary: Remove a user from a task
 *     tags: [Assignees]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to remove
 *     responses:
 *       200:
 *         description: Assignee removed successfully
 *       400:
 *         description: Bad request - Task ID and User ID are required
 *       500:
 *         description: Internal server error
 */

router.delete('/:taskId/assignees/:userId', removeAssigneeFromTasks);


export default router;