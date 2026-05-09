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

// Import Middleware Phân quyền
import { requirePermission } from '../middlewares/roleMiddlewares.js';

const router = express.Router();


router.get('/spaces/:spaceId', getTagsBySpaceId);

// Quản lý tag -> Yêu cầu quyền: SETTING_MANAGE (Admin + Manager)
router.post('/spaces/:spaceId', requirePermission('SETTING_MANAGE'), createTags);


router.get('/:tagId', getTagById);

// Cập nhật tag -> Yêu cầu quyền: SETTING_MANAGE (Admin + Manager)
router.put('/:tagId', requirePermission('SETTING_MANAGE'), updateTags);


// Xóa tag -> Yêu cầu quyền: SETTING_MANAGE (Admin + Manager)
router.delete('/:tagId', requirePermission('SETTING_MANAGE'), deleteTags);


router.get('/tasks/:taskId', getTaskTags);


// Gán tag cho task = cập nhật task -> Yêu cầu quyền: TASK_UPDATE
router.post('/tasks/:taskId', requirePermission('TASK_UPDATE'), addTagToTasks);


// Gỡ tag khỏi task = cập nhật task -> Yêu cầu quyền: TASK_UPDATE
router.delete('/tasks/:taskId/:tagId', requirePermission('TASK_UPDATE'), removeTagFromTasks);

export default router;
