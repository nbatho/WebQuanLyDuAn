import {
    getUserConversations,
    findOrCreateDirect,
    createChannel,
    findOrCreateSpaceConversation,
    addMemberToConversation,
    removeMemberFromConversation,
    getMessages,
    sendMessage,
} from '../models/Messages.js';
import con from '../config/connect.js';

// ══════════════════════════════════════════════════
// CONVERSATIONS
// ══════════════════════════════════════════════════

/** GET /api/v1/messages/conversations?workspace_id=X */
export const getConversations = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { workspace_id } = req.query;
        if (!workspace_id) return res.status(400).json({ error: 'workspace_id is required' });

        const conversations = await getUserConversations(userId, workspace_id);
        res.json(conversations);
    } catch (err) {
        console.error('getConversations error:', err);
        res.status(500).json({ error: err.message });
    }
};

/** POST /api/v1/messages/direct   body: { workspace_id, target_user_id } */
export const startDirectMessage = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { workspace_id, target_user_id } = req.body;
        if (!workspace_id || !target_user_id) {
            return res.status(400).json({ error: 'workspace_id and target_user_id required' });
        }
        const conversationId = await findOrCreateDirect(workspace_id, userId, target_user_id);
        res.json({ conversation_id: conversationId });
    } catch (err) {
        console.error('startDirectMessage error:', err);
        res.status(500).json({ error: err.message });
    }
};

/** POST /api/v1/messages/channels   body: { workspace_id, name, member_ids[] } */
export const createNewChannel = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { workspace_id, name, member_ids } = req.body;
        if (!workspace_id || !name) {
            return res.status(400).json({ error: 'workspace_id and name required' });
        }
        const channel = await createChannel(workspace_id, name, userId, member_ids || []);
        res.status(201).json(channel);
    } catch (err) {
        console.error('createChannel error:', err);
        res.status(500).json({ error: err.message });
    }
};

/** POST /api/v1/messages/space   body: { workspace_id, space_id, space_name } */
export const getOrCreateSpaceChat = async (req, res) => {
    try {
        const { workspace_id, space_id, space_name } = req.body;
        if (!workspace_id || !space_id) {
            return res.status(400).json({ error: 'workspace_id and space_id required' });
        }
        const conversationId = await findOrCreateSpaceConversation(workspace_id, space_id, space_name || 'Space Chat');
        res.json({ conversation_id: conversationId });
    } catch (err) {
        console.error('getOrCreateSpaceChat error:', err);
        res.status(500).json({ error: err.message });
    }
};

/** POST /api/v1/messages/conversations/:id/members   body: { user_id } */
export const addMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id } = req.body;
        if (!user_id) return res.status(400).json({ error: 'user_id required' });
        await addMemberToConversation(id, user_id);
        res.json({ message: 'Member added' });
    } catch (err) {
        console.error('addMember error:', err);
        res.status(500).json({ error: err.message });
    }
};

/** DELETE /api/v1/messages/conversations/:id/members/:userId */
export const removeMember = async (req, res) => {
    try {
        const { id, userId } = req.params;
        await removeMemberFromConversation(id, userId);
        res.json({ message: 'Member removed' });
    } catch (err) {
        console.error('removeMember error:', err);
        res.status(500).json({ error: err.message });
    }
};

// ══════════════════════════════════════════════════
// MESSAGES
// ══════════════════════════════════════════════════

/** GET /api/v1/messages/:conversationId?limit=50&before=ISO */
export const getConversationMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { limit, before } = req.query;
        const msgs = await getMessages(conversationId, parseInt(limit) || 50, before || null);
        res.json(msgs);
    } catch (err) {
        console.error('getMessages error:', err);
        res.status(500).json({ error: err.message });
    }
};

/** POST /api/v1/messages/:conversationId   body: { content, fileUrl, fileName, fileType }, file: [attachment] */
export const postMessage = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { conversationId } = req.params;
        const { content, fileUrl: bodyFileUrl, fileName: bodyFileName, fileType: bodyFileType } = req.body;
        
        let fileUrl = bodyFileUrl || null;
        let fileName = bodyFileName || null;
        let fileType = bodyFileType || null;

        if (req.file) {
            fileUrl = `/uploads/messages/${req.file.filename}`;
            fileName = req.file.originalname;
            fileType = req.file.mimetype;
        }

        if (!content?.trim() && !req.file && !fileUrl) {
            return res.status(400).json({ error: 'content or file required' });
        }

        const msg = await sendMessage(conversationId, userId, content?.trim() || '', fileUrl, fileName, fileType);
        res.status(201).json(msg);
    } catch (err) {
        console.error('postMessage error:', err);
        res.status(500).json({ error: err.message });
    }
};
