import con from '../config/connect.js';

// Sử dụng view kanban_tasks đã được định nghĩa trong schema
export const getKanbanTasks = async (space_id) => {
    try {
        const query = `SELECT * FROM kanban_tasks WHERE space_id = $1 ORDER BY position ASC`;
        const values = [space_id];
        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

// Sử dụng view user_task_summary
export const getUserTaskSummary = async (user_id, space_id) => {
    try {
        let query = `SELECT * FROM user_task_summary WHERE user_id = $1`;
        const values = [user_id];

        if (space_id) {
            query += ` AND space_id = $2`;
            values.push(space_id);
        }

        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

// Thống kê tổng quan cho 1 space
export const getSpaceOverview = async (space_id) => {
    try {
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM tasks WHERE space_id = $1 AND is_archived = FALSE AND deleted_at IS NULL) as total_tasks,
                (SELECT COUNT(*) FROM tasks t JOIN task_status ts ON t.status_id = ts.status_id 
                 WHERE t.space_id = $1 AND ts.is_done_state = TRUE AND t.is_archived = FALSE AND t.deleted_at IS NULL) as completed_tasks,
                (SELECT COUNT(*) FROM tasks WHERE space_id = $1 AND due_date < CURRENT_DATE 
                 AND is_archived = FALSE AND completed_at IS NULL AND deleted_at IS NULL) as overdue_tasks,
                (SELECT COUNT(*) FROM tasks WHERE space_id = $1 AND is_archived = FALSE 
                 AND completed_at IS NULL AND deleted_at IS NULL) as in_progress_tasks,
                (SELECT COUNT(DISTINCT ta.user_id) FROM task_assigns ta 
                 JOIN tasks t ON ta.task_id = t.task_id 
                 WHERE t.space_id = $1 AND t.deleted_at IS NULL AND ta.deleted_at IS NULL) as total_members,
                (SELECT COALESCE(SUM(tl.duration_secs), 0) FROM time_logs tl 
                 JOIN tasks t ON tl.task_id = t.task_id 
                 WHERE t.space_id = $1 AND t.deleted_at IS NULL AND tl.stopped_at IS NOT NULL) as total_time_secs
        `;
        const values = [space_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Thống kê tổng quan cho 1 workspace
export const getWorkspaceOverview = async (workspace_id) => {
    try {
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM spaces WHERE workspace_id = $1 AND deleted_at IS NULL) as total_spaces,
                (SELECT COUNT(*) FROM tasks t 
                 JOIN spaces s ON t.space_id = s.space_id 
                 WHERE s.workspace_id = $1 AND s.deleted_at IS NULL AND t.is_archived = FALSE AND t.deleted_at IS NULL) as total_tasks,
                (SELECT COUNT(*) FROM tasks t 
                 JOIN spaces s ON t.space_id = s.space_id 
                 JOIN task_status ts ON t.status_id = ts.status_id
                 WHERE s.workspace_id = $1 AND s.deleted_at IS NULL AND ts.is_done_state = TRUE AND t.is_archived = FALSE AND t.deleted_at IS NULL) as completed_tasks,
                (SELECT COUNT(DISTINCT wm.user_id) FROM workspace_members wm 
                 WHERE wm.workspace_id = $1 AND wm.deleted_at IS NULL) as total_members
        `;
        const values = [workspace_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};
