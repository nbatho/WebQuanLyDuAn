import con from '../config/connect.js';

export const findUserByUsername = async (username) => {
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];
    try {
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    try {
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}
export const findUserById = async (user_id) => {
    const query = 'SELECT * FROM users WHERE user_id = $1';
    const values = [user_id];
    try {
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const createUser = async (username, hashedPassword, email, name = null, avatarUrl = null, sdt = null) => {
    const query = 'INSERT INTO users (username, name, email, password_hash, avatar_url, sdt) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [username, name, email, hashedPassword, avatarUrl, sdt];
    try {
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}