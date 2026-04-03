import express from 'express';
import {
    getSpacesByWorkspaceId,
    createSpace,
    getSpaceById,
    updateSpace,
    deleteSpace,
    getSpaceMembers
} from '../controllers/spaceController.js';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Spaces
 */

router.get('/workspaces/:workspaceId/spaces', getSpacesByWorkspaceId);
router.post('/workspaces/:workspaceId/spaces', createSpace);
router.get('/spaces/:spaceId', getSpaceById);
router.put('/spaces/:spaceId', updateSpace);
router.delete('/spaces/:spaceId', deleteSpace);
router.get('/spaces/:spaceId/members', getSpaceMembers);


export default router;