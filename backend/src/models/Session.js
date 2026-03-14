import con from "../config/connect.js";

export const createSession = async (user_id, refresh_token) => {
    const query = 'INSERT INTO user_sessions (user_id, refresh_token) VALUES ($1, $2) RETURNING *';
    const values = [user_id, refresh_token];
    try {
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}
export const deleteSessionByRefreshToken = async (refresh_token) => {
    const query = 'DELETE FROM user_sessions WHERE refresh_token = $1';
    const values = [refresh_token];
    try {
        await con.query(query, values);
    } catch (error) {
        throw error;
    }
}