import con from "../config/connect.js";

export const findAllWorkspacesByUserId = async (user_id) => {
    try {
        const query = `SELECT w.* FROM workspaces w
        JOIN workspace_members wm ON w.workspace_id = wm.workspace_id
        WHERE wm.user_id = $1`;
        const values = [user_id];
        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

export const createWorkspace = async (name, description, slug, owner_id) => {
    const client = await con.connect(); 

    try {
        await client.query('BEGIN'); 

        const query = `INSERT INTO workspaces (name, description, slug, created_by) VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [name, description, slug, owner_id];
        const result = await client.query(query, values);
        const newWorkspace = result.rows[0];

        const insertMemberQuery = `
            INSERT INTO workspace_members (workspace_id, user_id, role_id) 
            VALUES ($1, $2, (SELECT role_id FROM roles WHERE role_name = 'admin'))
        `;
        const memberValues = [newWorkspace.workspace_id, owner_id];
        await client.query(insertMemberQuery, memberValues);
        
        await client.query('COMMIT'); 
        
        return newWorkspace;
    } catch (error) {
        await client.query('ROLLBACK'); 
        throw error;
    } finally {
        client.release(); 
    }
}

export const findWorkspaceById = async (workspace_id) => {
    try {
        const query = `SELECT * FROM workspaces WHERE workspace_id = $1`;
        const values = [workspace_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const updateWorkspace = async (workspace_id, name, description) => {
    try {
        const query = `UPDATE workspaces SET name = $1, description = $2 WHERE workspace_id = $3 RETURNING *`;
        const values = [name, description, workspace_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const deleteWorkspace = async (workspace_id, owner_id) => {
    try {
        const query = `DELETE FROM workspaces WHERE workspace_id = $1 AND created_by = $2`;
        const values = [workspace_id, owner_id];
        await con.query(query, values);
    } catch (error) {
        throw error;
    }
}

export const findWorkspaceMembers = async (workspace_id) => {
    try {
        const query = `
            SELECT 
                u.user_id, 
                u.username, 
                u.name, 
                u.email, 
                u.avatar_url,
                r.role_name
            FROM users u
            JOIN workspace_members wm ON u.user_id = wm.user_id
            LEFT JOIN roles r ON wm.role_id = r.role_id
            WHERE wm.workspace_id = $1
        `;
        const values = [workspace_id];
        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

export const findWorkspaceInvitations = async (workspace_id) => {}

export const createWorkspaceInvitation = async (workspace_id, user_id) => {}

export const acceptWorkspaceInvitation = async (invitation_id) => {}

export const rejectWorkspaceInvitation = async (invitation_id) => {}

