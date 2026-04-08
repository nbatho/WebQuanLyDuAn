import con from '../config/connect.js';

export const findNotificationsByUserId = async (user_id, limit = 50, offset = 0) => {
    try {
        const query = `SELECT n.*, u.username as actor_username, u.name as actor_name, u.avatar_url as actor_avatar
                       FROM notifications n 
                       LEFT JOIN users u ON n.actor_id = u.user_id 
                       WHERE n.user_id = $1 
                       ORDER BY n.created_at DESC 
                       LIMIT $2 OFFSET $3`;
        const values = [user_id, limit, offset];
        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

export const countUnreadNotifications = async (user_id) => {
    try {
        const query = `SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = FALSE`;
        const values = [user_id];
        const result = await con.query(query, values);
        return parseInt(result.rows[0].count);
    } catch (error) {
        throw error;
    }
};

export const markAsRead = async (notification_id, user_id) => {
    try {
        const query = `UPDATE notifications SET is_read = TRUE 
                       WHERE notification_id = $1 AND user_id = $2 RETURNING *`;
        const values = [notification_id, user_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const markAllAsRead = async (user_id) => {
    try {
        const query = `UPDATE notifications SET is_read = TRUE 
                       WHERE user_id = $1 AND is_read = FALSE RETURNING *`;
        const values = [user_id];
        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

export const deleteNotificationById = async (notification_id, user_id) => {
    try {
        const query = `DELETE FROM notifications WHERE notification_id = $1 AND user_id = $2 RETURNING *`;
        const values = [notification_id, user_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const createNotification = async (user_id, actor_id, entity_id, entity_type, type, content) => {
    try {
        const query = `INSERT INTO notifications (user_id, actor_id, entity_id, entity_type, type, content) 
                       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        const values = [user_id, actor_id, entity_id, entity_type, type, content];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};
