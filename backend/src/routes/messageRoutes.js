import express from 'express';
import {
    getConversations,
    startDirectMessage,
    createNewChannel,
    getOrCreateSpaceChat,
    addMember,
    removeMember,
    getConversationMessages,
    postMessage,
} from '../controllers/messageController.js';

const router = express.Router();


// ── Conversations ────────────────────────────────
router.get('/conversations', getConversations);
router.post('/direct', startDirectMessage);
router.post('/channels', createNewChannel);
router.post('/space', getOrCreateSpaceChat);

// ── Conversation Members ─────────────────────────
router.post('/conversations/:id/members', addMember);
router.delete('/conversations/:id/members/:userId', removeMember);

// ── Messages ─────────────────────────────────────
router.get('/:conversationId', getConversationMessages);
router.post('/:conversationId', postMessage);

export default router;
