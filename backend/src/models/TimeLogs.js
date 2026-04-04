import con from '../config/connect.js';

export const findTimeLogsByTaskId = async (task_id) => {
    try {
        const query = `SELECT tl.*, u.username, u.name as user_name 
                       FROM time_logs tl 
                       JOIN users u ON tl.user_id = u.user_id 
                       WHERE tl.task_id = $1 
                       ORDER BY tl.started_at DESC`;
        const values = [task_id];
        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

export const findTimeLogsByUserId = async (user_id) => {
    try {
        const query = `SELECT tl.*, t.name as task_name 
                       FROM time_logs tl 
                       JOIN tasks t ON tl.task_id = t.task_id 
                       WHERE tl.user_id = $1 
                       ORDER BY tl.started_at DESC`;
        const values = [user_id];
        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

export const findRunningTimer = async (user_id) => {
    try {
        const query = `SELECT tl.*, t.name as task_name 
                       FROM time_logs tl 
                       JOIN tasks t ON tl.task_id = t.task_id 
                       WHERE tl.user_id = $1 AND tl.stopped_at IS NULL`;
        const values = [user_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const startTimer = async (task_id, user_id, note) => {
    try {
        const query = `INSERT INTO time_logs (task_id, user_id, note) 
                       VALUES ($1, $2, $3) RETURNING *`;
        const values = [task_id, user_id, note || null];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const stopTimer = async (time_log_id, user_id) => {
    try {
        const query = `UPDATE time_logs SET stopped_at = CURRENT_TIMESTAMP 
                       WHERE time_log_id = $1 AND user_id = $2 AND stopped_at IS NULL 
                       RETURNING *`;
        const values = [time_log_id, user_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const deleteTimeLog = async (time_log_id) => {
    try {
        const query = `DELETE FROM time_logs WHERE time_log_id = $1 RETURNING *`;
        const values = [time_log_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const getTotalTimeByTaskId = async (task_id) => {
    try {
        const query = `SELECT COALESCE(SUM(duration_secs), 0) as total_seconds 
                       FROM time_logs 
                       WHERE task_id = $1 AND stopped_at IS NOT NULL`;
        const values = [task_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};
