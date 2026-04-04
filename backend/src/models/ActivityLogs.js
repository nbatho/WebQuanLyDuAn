import con from '../config/connect.js';

export const findActivitiesByTaskId = async (task_id, limit = 50, offset = 0) => {
    try {
        const query = `SELECT al.*, u.username, u.name as user_name, u.avatar_url
                       FROM activity_logs al 
                       LEFT JOIN users u ON al.user_id = u.user_id 
                       WHERE al.task_id = $1 
                       ORDER BY al.created_at DESC 
                       LIMIT $2 OFFSET $3`;
        const values = [task_id, limit, offset];
        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

export const createActivity = async (task_id, user_id, action, old_value = null, new_value = null) => {
    try {
        const query = `INSERT INTO activity_logs (task_id, user_id, action, old_value, new_value) 
                       VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [
            task_id, 
            user_id, 
            action, 
            old_value ? JSON.stringify(old_value) : null, 
            new_value ? JSON.stringify(new_value) : null
        ];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const findActivitiesByUserId = async (user_id, limit = 50, offset = 0) => {
    try {
        const query = `SELECT al.*, t.name as task_name 
                       FROM activity_logs al 
                       JOIN tasks t ON al.task_id = t.task_id 
                       WHERE al.user_id = $1 
                       ORDER BY al.created_at DESC 
                       LIMIT $2 OFFSET $3`;
        const values = [user_id, limit, offset];
        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

export const findActivitiesBySpaceId = async (space_id, limit = 50, offset = 0) => {
    try {
        const query = `SELECT al.*, u.username, u.name as user_name, t.name as task_name 
                       FROM activity_logs al 
                       JOIN tasks t ON al.task_id = t.task_id 
                       LEFT JOIN users u ON al.user_id = u.user_id 
                       WHERE t.space_id = $1 
                       ORDER BY al.created_at DESC 
                       LIMIT $2 OFFSET $3`;
        const values = [space_id, limit, offset];
        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
};
