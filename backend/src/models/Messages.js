import con from '../config/connect.js';

// ══════════════════════════════════════════════════
// DB MIGRATION — Create messaging tables if not exist
// ══════════════════════════════════════════════════

export async function ensureMessagingTables() {
    try {
        await con.query(`
            CREATE TABLE IF NOT EXISTS conversations (
                conversation_id   SERIAL       PRIMARY KEY,
                workspace_id      INT          NOT NULL REFERENCES workspaces(workspace_id) ON DELETE CASCADE,
                type              VARCHAR(20)  NOT NULL DEFAULT 'DIRECT'
                                               CHECK (type IN ('DIRECT','CHANNEL','SPACE')),
                name              VARCHAR(100),
                space_id          INT          REFERENCES spaces(space_id) ON DELETE CASCADE,
                created_by        INT          REFERENCES users(user_id) ON DELETE SET NULL,
                created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS conversation_members (
                conversation_id   INT NOT NULL REFERENCES conversations(conversation_id) ON DELETE CASCADE,
                user_id           INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                joined_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (conversation_id, user_id)
            );

            CREATE TABLE IF NOT EXISTS messages (
                message_id        SERIAL      PRIMARY KEY,
                conversation_id   INT         NOT NULL REFERENCES conversations(conversation_id) ON DELETE CASCADE,
                sender_id         INT         NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                content           TEXT        NOT NULL DEFAULT '',
                file_url          TEXT,
                file_name         TEXT,
                file_type         VARCHAR(100),
                created_at        TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_url TEXT;
            ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_name TEXT;
            ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_type VARCHAR(100);
            ALTER TABLE messages ALTER COLUMN content SET DEFAULT '';

            CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_conv_members_user ON conversation_members(user_id);
        `);
        console.log('✅ Messaging tables ready');
    } catch (err) {
        console.error('❌ Messaging migration failed:', err.message);
    }
}

// ══════════════════════════════════════════════════
// CONVERSATIONS
// ══════════════════════════════════════════════════

/** Get all conversations the user is a member of */
export async function getUserConversations(userId, workspaceId) {
    const result = await con.query(`
        SELECT c.*,
            (SELECT json_agg(json_build_object(
                'user_id', u.user_id, 'name', u.name, 'username', u.username, 'avatar_url', u.avatar_url
            )) FROM conversation_members cm2
            JOIN users u ON cm2.user_id = u.user_id
            WHERE cm2.conversation_id = c.conversation_id
            ) AS members,
            (SELECT json_build_object('content', m.content, 'sender_id', m.sender_id, 'created_at', m.created_at, 'sender_name', u2.name)
             FROM messages m JOIN users u2 ON m.sender_id = u2.user_id
             WHERE m.conversation_id = c.conversation_id
             ORDER BY m.created_at DESC LIMIT 1
            ) AS last_message,
            (SELECT COUNT(*)::int FROM messages WHERE conversation_id = c.conversation_id) AS message_count
        FROM conversations c
        JOIN conversation_members cm ON c.conversation_id = cm.conversation_id AND cm.user_id = $1
        WHERE c.workspace_id = $2
        ORDER BY COALESCE(
            (SELECT MAX(created_at) FROM messages WHERE conversation_id = c.conversation_id),
            c.created_at
        ) DESC
    `, [userId, workspaceId]);
    return result.rows;
}

/** Find or create a direct conversation between two users */
export async function findOrCreateDirect(workspaceId, userId1, userId2) {
    // Check if direct conversation already exists
    const existing = await con.query(`
        SELECT c.conversation_id FROM conversations c
        WHERE c.type = 'DIRECT' AND c.workspace_id = $1
        AND EXISTS (SELECT 1 FROM conversation_members WHERE conversation_id = c.conversation_id AND user_id = $2)
        AND EXISTS (SELECT 1 FROM conversation_members WHERE conversation_id = c.conversation_id AND user_id = $3)
    `, [workspaceId, userId1, userId2]);

    if (existing.rows.length > 0) {
        return existing.rows[0].conversation_id;
    }

    // Create new direct conversation
    const client = await con.connect();
    try {
        await client.query('BEGIN');
        const convRes = await client.query(
            `INSERT INTO conversations (workspace_id, type, created_by) VALUES ($1, 'DIRECT', $2) RETURNING conversation_id`,
            [workspaceId, userId1]
        );
        const convId = convRes.rows[0].conversation_id;
        await client.query(
            `INSERT INTO conversation_members (conversation_id, user_id) VALUES ($1, $2), ($1, $3)`,
            [convId, userId1, userId2]
        );
        await client.query('COMMIT');
        return convId;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

/** Create a channel */
export async function createChannel(workspaceId, name, createdBy, memberIds = []) {
    const client = await con.connect();
    try {
        await client.query('BEGIN');
        const convRes = await client.query(
            `INSERT INTO conversations (workspace_id, type, name, created_by) VALUES ($1, 'CHANNEL', $2, $3) RETURNING *`,
            [workspaceId, name, createdBy]
        );
        const conv = convRes.rows[0];
        const allMembers = [...new Set([createdBy, ...memberIds])];
        for (const uid of allMembers) {
            await client.query(
                `INSERT INTO conversation_members (conversation_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                [conv.conversation_id, uid]
            );
        }
        await client.query('COMMIT');
        return conv;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

/** Create or get a space conversation */
export async function findOrCreateSpaceConversation(workspaceId, spaceId, spaceName) {
    const existing = await con.query(
        `SELECT conversation_id FROM conversations WHERE type = 'SPACE' AND space_id = $1`,
        [spaceId]
    );
    if (existing.rows.length > 0) return existing.rows[0].conversation_id;

    const client = await con.connect();
    try {
        await client.query('BEGIN');
        const convRes = await client.query(
            `INSERT INTO conversations (workspace_id, type, name, space_id) VALUES ($1, 'SPACE', $2, $3) RETURNING conversation_id`,
            [workspaceId, spaceName, spaceId]
        );
        const convId = convRes.rows[0].conversation_id;
        // Add all workspace members to space chat
        const members = await client.query(`SELECT user_id FROM workspace_members WHERE workspace_id = $1`, [workspaceId]);
        for (const m of members.rows) {
            await client.query(
                `INSERT INTO conversation_members (conversation_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                [convId, m.user_id]
            );
        }
        await client.query('COMMIT');
        return convId;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

/** Add member to conversation */
export async function addMemberToConversation(conversationId, userId) {
    await con.query(
        `INSERT INTO conversation_members (conversation_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [conversationId, userId]
    );
}

/** Remove member from conversation */
export async function removeMemberFromConversation(conversationId, userId) {
    await con.query(
        `DELETE FROM conversation_members WHERE conversation_id = $1 AND user_id = $2`,
        [conversationId, userId]
    );
}

// ══════════════════════════════════════════════════
// MESSAGES
// ══════════════════════════════════════════════════

/** Get messages for a conversation (paginated) */
export async function getMessages(conversationId, limit = 50, before = null) {
    let query = `
        SELECT m.*, u.name AS sender_name, u.username AS sender_username, u.avatar_url AS sender_avatar
        FROM messages m
        JOIN users u ON m.sender_id = u.user_id
        WHERE m.conversation_id = $1
    `;
    const params = [conversationId];

    if (before) {
        query += ` AND m.created_at < $2 ORDER BY m.created_at DESC LIMIT $3`;
        params.push(before, limit);
    } else {
        query += ` ORDER BY m.created_at DESC LIMIT $2`;
        params.push(limit);
    }

    const result = await con.query(query, params);
    return result.rows.reverse(); // oldest first
}

/** Send a message */
export async function sendMessage(conversationId, senderId, content, fileUrl = null, fileName = null, fileType = null) {
    const result = await con.query(`
        INSERT INTO messages (conversation_id, sender_id, content, file_url, file_name, file_type)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *, 
            (SELECT name FROM users WHERE user_id = $2) AS sender_name,
            (SELECT username FROM users WHERE user_id = $2) AS sender_username
    `, [conversationId, senderId, content || '', fileUrl, fileName, fileType]);
    return result.rows[0];
}
