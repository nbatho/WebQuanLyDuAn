import express from 'express';
import {
  getStatusesByListId,
  createTaskStatus,
  getStatusById,
  updateTaskStatus,
  deleteTaskStatus,
  reorderStatus,
} from '../controllers/taskStatusController.js';

// Import Middleware Phân quyền
import { requirePermission } from '../middlewares/roleMiddlewares.js';

const router = express.Router();

router.get('/:listId', getStatusesByListId);


// Quản lý cài đặt status -> Yêu cầu quyền: SETTING_MANAGE (Admin + Manager)
router.post('/spaces/:spaceId', requirePermission('SETTING_MANAGE'), createTaskStatus);


router.get('/:statusId', getStatusById);


// Cập nhật status -> Yêu cầu quyền: SETTING_MANAGE (Admin + Manager)
router.put('/:statusId', requirePermission('SETTING_MANAGE'), updateTaskStatus);


// Xóa status -> Yêu cầu quyền: SETTING_MANAGE (Admin + Manager)
router.delete('/:statusId', requirePermission('SETTING_MANAGE'), deleteTaskStatus);

// Reorder status -> Yêu cầu quyền: SETTING_MANAGE (Admin + Manager)
router.put('/:statusId/reorder', requirePermission('SETTING_MANAGE'), reorderStatus);

export default router;