import express from 'express';
import {
  getActivitiesByTaskId,
  createActivityLog,
  getMyActivities,
  getActivitiesBySpaceId,
} from '../controllers/activityLogController.js';

const router = express.Router();
router.get('/me', getMyActivities);
router.get('/spaces/:spaceId', getActivitiesBySpaceId);
router.get('/tasks/:taskId', getActivitiesByTaskId);
router.post('/tasks/:taskId', createActivityLog);

export default router;
