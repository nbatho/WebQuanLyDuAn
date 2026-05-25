import {
    getSpaceIdByTaskId,
    getSpaceIdByListId,
    getSpaceIdByFolderId,
    getSpaceIdByAttachmentId,
    getSpaceIdByCommentId,
    getSpaceIdBySprintId,
    getSpaceIdByMilestoneId,
    getSpaceIdByStatusId,
    getSpaceIdByTimeLogId,
    checkSpacePermission,
    checkInheritedWorkspacePermission,
    checkWorkspacePermission,
} from '../models/Permission.js';

// Bảng tra cứu: param trong URL → hàm lấy spaceId từ DB
const PARAM_TO_SPACE_LOOKUP = [
    { param: 'taskId',       fn: getSpaceIdByTaskId,       notFoundMsg: 'Task không tồn tại hoặc đã bị xóa.' },
    { param: 'listId',       fn: getSpaceIdByListId,       notFoundMsg: 'List không tồn tại hoặc đã bị xóa.' },
    { param: 'list_id',      fn: getSpaceIdByListId,       notFoundMsg: 'List không tồn tại hoặc đã bị xóa.' },
    { param: 'folderId',     fn: getSpaceIdByFolderId,     notFoundMsg: 'Folder không tồn tại hoặc đã bị xóa.' },
    { param: 'folder_id',    fn: getSpaceIdByFolderId,     notFoundMsg: 'Folder không tồn tại hoặc đã bị xóa.' },
    { param: 'attachmentId', fn: getSpaceIdByAttachmentId, notFoundMsg: 'Tệp đính kèm không tồn tại hoặc đã bị xóa.' },
    { param: 'commentId',    fn: getSpaceIdByCommentId,    notFoundMsg: 'Bình luận không tồn tại hoặc đã bị xóa.' },
    { param: 'sprintId',     fn: getSpaceIdBySprintId,     notFoundMsg: 'Sprint không tồn tại hoặc đã bị xóa.' },
    { param: 'milestoneId',  fn: getSpaceIdByMilestoneId,  notFoundMsg: 'Milestone không tồn tại hoặc đã bị xóa.' },
    { param: 'statusId',     fn: getSpaceIdByStatusId,     notFoundMsg: 'Trạng thái không tồn tại.' },
    { param: 'timeLogId',    fn: getSpaceIdByTimeLogId,    notFoundMsg: 'Time log không tồn tại hoặc đã bị xóa.' },
];

// Dò ngược spaceId từ các entity con trong req.params
async function resolveSpaceIdFromParams(params) {
    for (const { param, fn, notFoundMsg } of PARAM_TO_SPACE_LOOKUP) {
        if (!params[param]) continue;
        const spaceId = await fn(params[param]);
        if (!spaceId) return { spaceId: null, error: notFoundMsg };
        return { spaceId, error: null };
    }
    return { spaceId: null, error: null };
}

/**
 * Middleware kiểm tra quyền.
 *
 * @param {string} requiredPermission - Tên quyền cần có (VD: 'TASK_CREATE')
 * @param {Object} [options]
 * @param {boolean} [options.allowNoSpace=false] - Nếu true và không tìm được
 *   spaceId/workspaceId, cho phép đi qua (chỉ cần xác thực JWT). Dùng cho
 *   các route cá nhân không gắn với space cụ thể (VD: timer cá nhân).
 */
export const requirePermission = (requiredPermission, options = {}) => async (req, res, next) => {
    const { allowNoSpace = false } = options;
    try {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ message: 'Chưa xác thực. Vui lòng đăng nhập.' });
        }

        // Lấy spaceId: trực tiếp từ URL/body, hoặc dò ngược từ entity con
        let spaceId = req.params.spaceId || req.params.space_id
                   || req.body?.spaceId  || req.body?.space_id
                   || null;

        if (!spaceId) {
            const lookup = await resolveSpaceIdFromParams(req.params);
            if (lookup.error) return res.status(404).json({ message: lookup.error });
            spaceId = lookup.spaceId;
        }

        const workspaceId = req.params.workspaceId
                         || req.body?.workspaceId || req.body?.workspace_id
                         || null;

        let hasPermission = false;

        if (spaceId) {
            hasPermission = await checkSpacePermission(spaceId, userId, requiredPermission);
            if (!hasPermission) {
                hasPermission = await checkInheritedWorkspacePermission(spaceId, userId, requiredPermission);
            }
            req.resolvedSpaceId = spaceId;
        } else if (workspaceId) {
            hasPermission = await checkWorkspacePermission(workspaceId, userId, requiredPermission);
        } else {
            if (allowNoSpace) return next();
            return res.status(400).json({
                message: 'Không thể xác định ngữ cảnh phân quyền. Thiếu spaceId hoặc workspaceId.',
            });
        }

        if (!hasPermission) {
            return res.status(403).json({
                message: `Forbidden: Bạn không có quyền [${requiredPermission}] để thực hiện hành động này.`,
            });
        }

        return next();
    } catch (error) {
        console.error('[requirePermission] Lỗi:', error);
        return res.status(500).json({ message: 'Lỗi máy chủ khi kiểm tra quyền truy cập.' });
    }
};

export default requirePermission;