import con from '../config/connect.js';

export const findPrioritiesBySpaceId = async (space_id) => {
    try {
        const query = `SELECT * FROM task_priority WHERE space_id = $1 ORDER BY position ASC`;
        const values = [space_id];
        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

export const findPriorityById = async (priority_id) => {
    try {
        const query = `SELECT * FROM task_priority WHERE priority_id = $1`;
        const values = [priority_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const createPriority = async (space_id, priority_name, color, position) => {
    try {
        const query = `INSERT INTO task_priority (space_id, priority_name, color, position) 
                       VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [space_id, priority_name, color || '#6C63FF', position || 0];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const updatePriorityById = async (priority_id, priority_name, color) => {
    try {
        const fields = [];
        const values = [];
        let count = 1;

        if (priority_name !== undefined) { fields.push(`priority_name = $${count++}`); values.push(priority_name); }
        if (color !== undefined) { fields.push(`color = $${count++}`); values.push(color); }

        if (fields.length === 0) return null;

        values.push(priority_id);
        const query = `UPDATE task_priority SET ${fields.join(', ')} WHERE priority_id = $${count} RETURNING *`;
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const deletePriorityById = async (priority_id) => {
    try {
        const query = `DELETE FROM task_priority WHERE priority_id = $1 RETURNING *`;
        const values = [priority_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const reorderPriorities = async (priority_id, new_position) => {
    try {
        const query = `UPDATE task_priority SET position = $1 WHERE priority_id = $2 RETURNING *`;
        const values = [new_position, priority_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};
