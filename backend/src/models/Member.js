import con from "../config/connect.js";

export const createInvitations = async (workspace_id, email, token, invited_by) => {
    try {
        const query = `
            INSERT INTO workspace_invitations (workspace_id, email, token, invited_by) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *;
        `;
        const result = await con.query(query, [workspace_id, email, token, invited_by]);

        return result.rows[0];
    } catch (error) {
        console.error("Database Error in createInvitations:", error);
        throw error;
    }
};

export const checkExistingInvitation = async (workspace_id, email) => {
    try {
        const query = `SELECT * FROM workspace_invitations WHERE workspace_id = $1 AND email = $2 AND status = 'pending'`;
        const result = await con.query(query, [workspace_id, email]);
        return result.rows[0];
    } catch (error) {
        console.error("Database Error in checkExistingInvitation:", error);
        throw error;
    }
};

export const deleteInvitation = async (invitation_id) => {
    try {
        const query = `DELETE FROM workspace_invitations WHERE invitation_id = $1`;
        const result = await con.query(query, [invitation_id]);
        return result.rowCount > 0;
    } catch (error) {
        console.error("Database Error in deleteInvitation:", error);
        throw error;
    }
};

export const addMemberToWorkspace = async (workspace_id, user_id) => {
    try {
        const query = `
            INSERT INTO workspace_members (workspace_id, user_id) 
            VALUES ($1, $2) 
            RETURNING *;
        `;
        const result = await con.query(query, [workspace_id, user_id]);
        return result.rows[0];
    } catch (error) {
        console.error("Database Error in addMemberToWorkspace:", error);
        throw error;
    }
};

export const updateInvitationStatus = async (invitation_id, status) => {
    try {
        const query = `UPDATE workspace_invitations SET status = $1 WHERE invitation_id = $2`;
        const result = await con.query(query, [status, invitation_id]);
        return result.rowCount > 0;
    } catch (error) {
        console.error("Database Error in updateInvitationStatus:", error);
        throw error;
    }
};