import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/messages';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});
const upload = multer({ storage });


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
router.post('/:conversationId', upload.single('file'), postMessage);

export default router;
