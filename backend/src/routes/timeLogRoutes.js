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

// Import Middleware Phân quyền
import { requirePermission } from '../middlewares/roleMiddlewares.js';

const router = express.Router();


router.get('/me', getMyTimeLogs);


router.get('/running', getRunningTimer);


router.get('/tasks/:taskId', getTimeLogsByTaskId);


router.get('/tasks/:taskId/total', getTotalTime);


// Bắt đầu timer -> Yêu cầu quyền: TIME_LOG_ADD (Admin, Manager, Member)
router.post('/tasks/:taskId/start', requirePermission('TIME_LOG_ADD'), startTimerForTask);


// Dừng timer -> Yêu cầu quyền: TIME_LOG_ADD (cùng quyền với start)
router.put('/:timeLogId/stop', requirePermission('TIME_LOG_ADD'), stopTimerById);


// Xóa time log -> Yêu cầu quyền: TIME_LOG_ADD (người tạo nên có quyền xóa)
router.delete('/:timeLogId', requirePermission('TIME_LOG_ADD'), deleteTimeLogById);

export default router;
