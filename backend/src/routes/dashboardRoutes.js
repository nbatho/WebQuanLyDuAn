import express from 'express';
import {
  getKanbanBoard,
  getMyTaskSummary,
  getSpaceStats,
  getWorkspaceStats,
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/kanban/:spaceId', getKanbanBoard);

router.get('/my-summary', getMyTaskSummary);
router.get('/spaces/:spaceId', getSpaceStats);
router.get('/workspaces/:workspaceId', getWorkspaceStats);

export default router;
