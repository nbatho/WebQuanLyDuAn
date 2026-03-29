import con from '../config/db.js';

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

export const createTask = async (name, description, space_id) => {
    try {
        const query = `INSERT INTO tasks (name, description, space_id) VALUES ($1, $2, $3) RETURNING *`;
        const values = [name, description, space_id];
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

export const updateTask = async (task_id, name, description) => {
    try {
        const query = `UPDATE tasks SET name = $1, description = $2 WHERE task_id = $3 RETURNING *`;
        const values = [name, description, task_id];
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
        const query = `SELECT * FROM subtasks WHERE task_id = $1`;
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
        const query = `INSERT INTO subtasks (name, description, task_id) VALUES ($1, $2, $3) RETURNING *`;
        const values = [name, description, task_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const updateSubtask = async (subtask_id, name, description) => {
    try {
        const query = `UPDATE subtasks SET name = $1, description = $2 WHERE subtask_id = $3 RETURNING *`;
        const values = [name, description, subtask_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const deleteSubtask = async (subtask_id) => {    
    try {
        const query = `DELETE FROM subtasks WHERE subtask_id = $1 RETURNING *`;
        const values = [subtask_id];
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
        const query = `INSERT INTO task_assignments (task_id, user_id) VALUES ($1, $2) RETURNING *`;
        const values = [task_id, user_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }   
}

export const unassignUserFromTask = async (task_id, user_id) => {
    try {
        const query = `DELETE FROM task_assignments WHERE task_id = $1 AND user_id = $2 RETURNING *`;
        const values = [task_id, user_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const getAssignedUsersByTaskId = async (task_id) => {
    try {
        const query = `SELECT u.user_id, u.username, u.email FROM users u JOIN task_assignments ta ON u.user_id = ta.user_id WHERE ta.task_id = $1`;
        const values = [task_id];
        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}
