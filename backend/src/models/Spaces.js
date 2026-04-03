import con from "../config/connect";

export const findAllSpacesByWorkspaceId = async (workspace_id) => {
    try {
        const query = `SELECT * FROM spaces WHERE workspace_id = $1`;
        const values = [workspace_id];
        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

export const createSpace = async (name, description, workspace_id) => {
    try {
        const query = `INSERT INTO spaces (name, description, workspace_id) VALUES ($1, $2, $3) RETURNING *`;
        const values = [name, description, workspace_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }   
}

export const findSpaceById = async (space_id) => {
    try {
        const query = `SELECT * FROM spaces WHERE space_id = $1`;
        const values = [space_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}
export const updateSpace = async (space_id, name, description) => { 
    try {
        const query = `UPDATE spaces SET name = $1, description = $2 WHERE space_id = $3 RETURNING *`;
        const values = [name, description, space_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const deleteSpace = async (space_id, user_id) => {
    try {
        const query = `DELETE FROM spaces WHERE space_id = $1 RETURNING *`;
        const values = [space_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}