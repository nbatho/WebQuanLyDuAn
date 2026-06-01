import con from '../config/connect.js';

// ================================================================
// MEMBERSHIP MIDDLEWARE
// Kiểm tra user có thuộc workspace/space chứa resource hay không.
// Dùng cho các GET routes để ngăn IDOR (xem dữ liệu người khác).
// ================================================================

/**
 * Kiểm tra user có phải member của workspace hay không.
 * Tìm workspaceId từ: req.params.workspaceId
 */
export const requireWorkspaceMembership = async (req, res, next) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) return res.status(401).json({ message: 'Chưa xác thực.' });

        const workspaceId = req.params.workspaceId || req.params.workspace_id;
        if (!workspaceId) return res.status(400).json({ message: 'Thiếu workspaceId.' });

        const result = await con.query(
            `SELECT 1 FROM workspace_members 
             WHERE workspace_id = $1 AND user_id = $2 AND deleted_at IS NULL`,
            [workspaceId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({ message: 'Bạn không phải thành viên của Workspace này.' });
        }

        next();
    } catch (error) {
        console.error('[requireWorkspaceMembership] Lỗi:', error);
        return res.status(500).json({ message: 'Lỗi máy chủ khi kiểm tra quyền truy cập.' });
    }
};

/**
 * Kiểm tra user có thuộc space chứa resource hay không.
 * Tự động dò ngược spaceId từ các param: spaceId, listId, taskId.
 */
export const requireSpaceMembership = async (req, res, next) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) return res.status(401).json({ message: 'Chưa xác thực.' });

        let spaceId = req.params.spaceId || req.params.space_id || null;

        // Dò ngược spaceId từ listId
        if (!spaceId && (req.params.listId || req.params.list_id)) {
            const listId = req.params.listId || req.params.list_id;
            const result = await con.query(
                'SELECT space_id FROM lists WHERE list_id = $1 AND deleted_at IS NULL',
                [listId]
            );
            spaceId = result.rows[0]?.space_id;
        }

        // Dò ngược spaceId từ taskId
        if (!spaceId && req.params.taskId) {
            const result = await con.query(
                `SELECT l.space_id FROM tasks t 
                 JOIN lists l ON t.list_id = l.list_id 
                 WHERE t.task_id = $1 AND t.deleted_at IS NULL`,
                [req.params.taskId]
            );
            spaceId = result.rows[0]?.space_id;
        }

        // Dò ngược spaceId từ sprintId
        if (!spaceId && req.params.sprintId) {
            const result = await con.query(
                'SELECT space_id FROM sprints WHERE sprint_id = $1 AND deleted_at IS NULL',
                [req.params.sprintId]
            );
            spaceId = result.rows[0]?.space_id;
        }

        if (!spaceId) {
            return res.status(404).json({ message: 'Không tìm thấy resource hoặc đã bị xóa.' });
        }

        // Kiểm tra membership: space_members HOẶC workspace_members (kế thừa)
        const result = await con.query(
            `SELECT 1 FROM space_members 
             WHERE space_id = $1 AND user_id = $2 AND deleted_at IS NULL
             UNION
             SELECT 1 FROM workspace_members wm
             JOIN spaces s ON s.workspace_id = wm.workspace_id
             WHERE s.space_id = $1 AND wm.user_id = $2 AND wm.deleted_at IS NULL`,
            [spaceId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập resource này.' });
        }

        req.resolvedSpaceId = spaceId;
        next();
    } catch (error) {
        console.error('[requireSpaceMembership] Lỗi:', error);
        return res.status(500).json({ message: 'Lỗi máy chủ khi kiểm tra quyền truy cập.' });
    }
};

/**
 * Kiểm tra user có phải member của conversation hay không.
 * Dùng cho messaging API.
 */
export const requireConversationMembership = async (req, res, next) => {
    try {
        const userId = req.user?.user_id;
        if (!userId) return res.status(401).json({ message: 'Chưa xác thực.' });

        const conversationId = req.params.conversationId || req.params.id;
        if (!conversationId) return res.status(400).json({ message: 'Thiếu conversationId.' });

        const result = await con.query(
            `SELECT 1 FROM conversation_members 
             WHERE conversation_id = $1 AND user_id = $2`,
            [conversationId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({ message: 'Bạn không phải thành viên của cuộc trò chuyện này.' });
        }

        next();
    } catch (error) {
        console.error('[requireConversationMembership] Lỗi:', error);
        return res.status(500).json({ message: 'Lỗi máy chủ khi kiểm tra quyền truy cập.' });
    }
};
