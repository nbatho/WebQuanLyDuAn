import express from 'express';
import {
    getTasksBySpaceId,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    getSubTasksByTaskId,
    getCommentsByTaskId,
    createComment,
    getAttachmentsByTaskId,
    createAttachment,
    deleteAttachment,
    addAssigneeToTask,
    removeAssigneeFromTask
} from '../controllers/taskController.js';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Tasks
 */

router.get('/spaces/:spaceId/tasks', getTasksBySpaceId);
router.post('/spaces/:spaceId/tasks', createTask);
router.get('/tasks/:taskId', getTaskById);
router.put('/tasks/:taskId', updateTask);
router.delete('/tasks/:taskId', deleteTask);
router.get('/tasks/:taskId/subtasks', getSubTasksByTaskId);
router.get('/tasks/:taskId/comments', getCommentsByTaskId);
router.post('/tasks/:taskId/comments', createComment);
router.get('/tasks/:taskId/attachments', getAttachmentsByTaskId);
router.post('/tasks/:taskId/attachments', createAttachment);
router.delete('/attachments/:attachmentId', deleteAttachment);
router.post('/tasks/:taskId/assignees', addAssigneeToTask);
router.delete('/tasks/:taskId/assignees/:userId', removeAssigneeFromTask);


export default router;