import con from '../config/connect.js';

export const findTagsBySpaceId = async (space_id) => {
    try {
        const query = `SELECT * FROM tags WHERE space_id = $1 ORDER BY created_at DESC`;
        const values = [space_id];
        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

export const findTagById = async (tag_id) => {
    try {
        const query = `SELECT * FROM tags WHERE tag_id = $1`;
        const values = [tag_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const createTag = async (space_id, name, color, created_by) => {
    try {
        const query = `INSERT INTO tags (space_id, name, color, created_by) 
                       VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [space_id, name, color || '#6C63FF', created_by];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const updateTagById = async (tag_id, name, color) => {
    try {
        const fields = [];
        const values = [];
        let count = 1;

        if (name !== undefined) { fields.push(`name = $${count++}`); values.push(name); }
        if (color !== undefined) { fields.push(`color = $${count++}`); values.push(color); }

        if (fields.length === 0) return null;

        values.push(tag_id);
        const query = `UPDATE tags SET ${fields.join(', ')} WHERE tag_id = $${count} RETURNING *`;
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const deleteTagById = async (tag_id) => {
    try {
        const query = `DELETE FROM tags WHERE tag_id = $1 RETURNING *`;
        const values = [tag_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Task-Tag relationship
export const addTagToTask = async (task_id, tag_id) => {
    try {
        const query = `INSERT INTO task_tags (task_id, tag_id) VALUES ($1, $2) RETURNING *`;
        const values = [task_id, tag_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const removeTagFromTask = async (task_id, tag_id) => {
    try {
        const query = `DELETE FROM task_tags WHERE task_id = $1 AND tag_id = $2 RETURNING *`;
        const values = [task_id, tag_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const findTagsByTaskId = async (task_id) => {
    try {
        const query = `SELECT t.* FROM tags t 
                       JOIN task_tags tt ON t.tag_id = tt.tag_id 
                       WHERE tt.task_id = $1`;
        const values = [task_id];
        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
};
