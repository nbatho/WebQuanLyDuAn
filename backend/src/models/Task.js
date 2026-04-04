import con from '../config/connect.js';

export const findAllTasksBySpaceId = async (space_id) => {
    try {
        const query = `SELECT * FROM tasks WHERE space_id = $1`;
        const values = [space_id];
        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

export const createTask = async (name, description, space_id, due_date) => {
    try {
        const query = `INSERT INTO tasks (name, description, space_id, start_date, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [name, description, space_id, new Date(), due_date];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}   

export const findTaskById = async (task_id) => {    
    try {
        const query = `SELECT * FROM tasks WHERE task_id = $1`;
        const values = [task_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const updateTask = async (task_id, name, description, due_date) => {
    try {
        const query = `UPDATE tasks SET name = $1, description = $2, due_date = $3 WHERE task_id = $4 RETURNING *`;
        const values = [name, description, due_date, task_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const deleteTask = async (task_id) => {
    try {
        const query = `DELETE FROM tasks WHERE task_id = $1 RETURNING *`;   
        const values = [task_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }   
}   

export const getSubtasksByTaskId = async (task_id) => {
    try {
        const query = `SELECT * FROM tasks WHERE parent_task_id = $1`;
        const values = [task_id];
        const result = await con.query(query, values);
        return result.rows;
    }
    catch (error) {
        throw error;
    }
}

export const createSubtask = async (name, description, task_id) => {
    try {
        const query = `INSERT INTO tasks (name, description, parent_task_id, space_id) VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [name, description, task_id, null];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const updateSubtask = async (task_id, parent_task_id, name, description, due_date) => {
    try {
        const query = `UPDATE tasks SET name = $1, description = $2, due_date = $3 WHERE task_id = $4 AND parent_task_id = $5 RETURNING *`;
        const values = [name, description, due_date, task_id, parent_task_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const deleteSubtask = async (task_id, parent_task_id) => {    
    try {
        const query = `DELETE FROM tasks WHERE task_id = $1 AND parent_task_id = $2 RETURNING *`;
        const values = [task_id, parent_task_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }   
}

export const getCommentsByTaskId = async (task_id) => { 
    try {
        const query = `SELECT * FROM comments WHERE task_id = $1`;
        const values = [task_id];
        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

export const createComment = async (content, task_id, user_id) => {
    try {
        const query = `INSERT INTO comments (content, task_id, user_id) VALUES ($1, $2, $3) RETURNING *`;
        const values = [content, task_id, user_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}
export const updateComment = async (comment_id, content) => {
    try {
        const query = `UPDATE comments SET content = $1 WHERE comment_id = $2 RETURNING *`;
        const values = [content, comment_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {       
        throw error;
    }   
}

export const deleteComment = async (comment_id) => {
    try {
        const query = `DELETE FROM comments WHERE comment_id = $1 RETURNING *`;
        const values = [comment_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const assignUserToTask = async (task_id, user_id) => {
    try {
        const query = `INSERT INTO task_assigns (task_id, user_id) VALUES ($1, $2) RETURNING *`;
        const values = [task_id, user_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }   
}

export const unassignUserFromTask = async (task_id, user_id) => {
    try {
        const query = `DELETE FROM task_assigns WHERE task_id = $1 AND user_id = $2 RETURNING *`;
        const values = [task_id, user_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const getAssignedUsersByTaskId = async (task_id) => {
    try {
        const query = `SELECT u.user_id, u.username, u.email FROM users u JOIN task_assigns ta ON u.user_id = ta.user_id WHERE ta.task_id = $1`;
        const values = [task_id];
        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

export const getAttachmentsByTaskId = async (task_id) => {
    try {
        const query = `SELECT a.*, u.username as uploaded_by_username 
                       FROM attachments a 
                       LEFT JOIN users u ON a.uploaded_by = u.user_id 
                       WHERE a.task_id = $1 
                       ORDER BY a.created_at DESC`;
        const values = [task_id];
        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

export const deleteAttachment = async (attachment_id) => {
    try {
        const query = `DELETE FROM attachments WHERE attachment_id = $1 RETURNING *`;
        const values = [attachment_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const createAttachment = async (task_id, file_name, file_url, file_size, mime_type, uploaded_by, comment_id = null) => {
    try {
        const query = `INSERT INTO attachments (task_id, comment_id, file_name, file_url, file_size, mime_type, uploaded_by) 
                       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
        const values = [task_id, comment_id, file_name, file_url, file_size, mime_type, uploaded_by];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}
