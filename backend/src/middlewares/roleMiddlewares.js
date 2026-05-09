/**
 * =============================================================
 * FLOSWISE - AUTHORIZATION MIDDLEWARE
 * =============================================================
 * Logic phân quyền trung tâm của hệ thống.
 * 
 * Nguyên tắc hoạt động:
 * 1. Extract spaceId hoặc workspaceId từ URL params/body
 * 2. Nếu URL chỉ chứa entity con (taskId, listId, folderId, attachmentId...),
 *    thực hiện DB Lookup dò ngược để tìm spaceId
 * 3. Check quyền theo thứ tự ưu tiên:
 *    a. Quyền trực tiếp tại Space (space_members.role_id)
 *    b. Quyền kế thừa từ Workspace (workspace_members.role_id -> Space)
 *    c. Quyền trực tiếp tại Workspace (cho các API workspace-level)
 * 4. Không hardcode - mọi quyền đều mapping từ Database
 * =============================================================
 */

import {
    getSpaceIdByTaskId,
    getSpaceIdByListId,
    getSpaceIdByFolderId,
    getSpaceIdByAttachmentId,
    getSpaceIdByCommentId,
    getSpaceIdBySprintId,
    getSpaceIdByMilestoneId,
    getSpaceIdByTagId,
    getSpaceIdByStatusId,
    getSpaceIdByTimeLogId,
    checkSpacePermission,
    checkInheritedWorkspacePermission,
    checkWorkspacePermission,
} from '../models/Permission.js';

/**
 * Middleware factory: Kiểm tra xem user hiện tại có quyền cụ thể không.
 * 
 * @param {string} requiredPermission - Tên quyền cần kiểm tra (VD: 'TASK_CREATE', 'SPACE_DELETE')
 * @returns {Function} Express middleware
 * 
 * @example
 * // Trong route file:
 * router.post('/spaces/:spaceId', requirePermission('TASK_CREATE'), createTasks);
 * router.delete('/:taskId', requirePermission('TASK_DELETE'), deleteTasks);
 */
export const requirePermission = (requiredPermission) => async (req, res, next) => {
    try {
        const userId = req.user.user_id; // Đã có từ protectedRoute middleware (JWT)

        // ---------------------------------------------------
        // BƯỚC 1: Xác định spaceId hoặc workspaceId từ request
        // ---------------------------------------------------
        let spaceId = req.params.spaceId || req.params.space_id || req.body.spaceId || req.body.space_id;
        const workspaceId = req.params.workspaceId || req.body.workspaceId || req.body.workspace_id;

        // ---------------------------------------------------
        // BƯỚC 2: Nếu không có spaceId trực tiếp, 
        // thực hiện DB Lookup dò ngược từ entity con
        // ---------------------------------------------------
        if (!spaceId) {
            const lookupResult = await resolveSpaceId(req.params);
            
            if (lookupResult.error) {
                return res.status(404).json({ message: lookupResult.error });
            }
            
            spaceId = lookupResult.spaceId;
        }

        // ---------------------------------------------------
        // BƯỚC 3: Kiểm tra quyền
        // ---------------------------------------------------
        let hasPermission = false;

        if (spaceId) {
            // Ưu tiên 1: Check quyền trực tiếp tại Space
            hasPermission = await checkSpacePermission(spaceId, userId, requiredPermission);

            // Ưu tiên 2: Check quyền kế thừa từ Workspace (VD: Admin workspace có quyền trên mọi Space)
            if (!hasPermission) {
                hasPermission = await checkInheritedWorkspacePermission(spaceId, userId, requiredPermission);
            }
        } else if (workspaceId) {
            // Các API thao tác trực tiếp lên Workspace (update, delete, invite...)
            hasPermission = await checkWorkspacePermission(workspaceId, userId, requiredPermission);
        } else {
            // Không tìm được context nào để check quyền
            return res.status(400).json({
                message: 'Không thể xác định ngữ cảnh phân quyền. Thiếu spaceId hoặc workspaceId.',
            });
        }

        // ---------------------------------------------------
        // BƯỚC 4: Trả kết quả
        // ---------------------------------------------------
        if (!hasPermission) {
            return res.status(403).json({
                message: `Forbidden: Bạn không có quyền [${requiredPermission}] để thực hiện hành động này.`,
            });
        }

        // Lưu spaceId vào req để controller phía sau có thể dùng lại (tránh query lại)
        if (spaceId) {
            req.resolvedSpaceId = spaceId;
        }

        // Đủ quyền -> cho qua
        return next();
    } catch (error) {
        console.error('Lỗi Middleware Phân Quyền:', error);
        return res.status(500).json({ message: 'Lỗi máy chủ khi kiểm tra quyền truy cập.' });
    }
};

/**
 * Hàm dò ngược spaceId từ các entity con trong req.params
 * Ưu tiên theo thứ tự: taskId -> listId -> folderId -> attachmentId -> 
 *                       commentId -> sprintId -> milestoneId -> tagId -> statusId -> timeLogId
 * 
 * @param {Object} params - req.params
 * @returns {Object} { spaceId: number|null, error: string|null }
 */
async function resolveSpaceId(params) {
    // Bảng mapping: paramName -> { lookupFn, errorMessage }
    const lookupMap = [
        { param: 'taskId',        fn: getSpaceIdByTaskId,        error: 'Task không tồn tại hoặc đã bị xóa.' },
        { param: 'listId',        fn: getSpaceIdByListId,        error: 'List không tồn tại hoặc đã bị xóa.' },
        { param: 'list_id',       fn: getSpaceIdByListId,        error: 'List không tồn tại hoặc đã bị xóa.' },
        { param: 'folderId',      fn: getSpaceIdByFolderId,      error: 'Folder không tồn tại hoặc đã bị xóa.' },
        { param: 'folder_id',     fn: getSpaceIdByFolderId,      error: 'Folder không tồn tại hoặc đã bị xóa.' },
        { param: 'attachmentId',  fn: getSpaceIdByAttachmentId,  error: 'Tệp đính kèm không tồn tại hoặc đã bị xóa.' },
        { param: 'commentId',     fn: getSpaceIdByCommentId,     error: 'Bình luận không tồn tại hoặc đã bị xóa.' },
        { param: 'sprintId',      fn: getSpaceIdBySprintId,      error: 'Sprint không tồn tại hoặc đã bị xóa.' },
        { param: 'milestoneId',   fn: getSpaceIdByMilestoneId,   error: 'Milestone không tồn tại hoặc đã bị xóa.' },
        { param: 'tagId',         fn: getSpaceIdByTagId,         error: 'Tag không tồn tại hoặc đã bị xóa.' },
        { param: 'statusId',      fn: getSpaceIdByStatusId,      error: 'Trạng thái không tồn tại.' },
        { param: 'timeLogId',     fn: getSpaceIdByTimeLogId,     error: 'Time log không tồn tại hoặc đã bị xóa.' },
    ];

    for (const { param, fn, error } of lookupMap) {
        if (params[param]) {
            const spaceId = await fn(params[param]);
            if (!spaceId) {
                return { spaceId: null, error };
            }
            return { spaceId, error: null };
        }
    }

    // Không tìm thấy param nào để lookup
    return { spaceId: null, error: null };
}

export default requirePermission;