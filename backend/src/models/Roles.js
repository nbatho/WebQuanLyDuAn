import con from '../config/connect.js';

export const findAllRoles = async () => {
    try {
        const query = `SELECT * FROM roles ORDER BY role_id ASC`;
        const result = await con.query(query);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

export const findRoleById = async (role_id) => {
    try {
        const query = `SELECT * FROM roles WHERE role_id = $1`;
        const values = [role_id];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const findRoleByName = async (role_name) => {
    try {
        const query = `SELECT * FROM roles WHERE role_name = $1`;
        const values = [role_name];
        const result = await con.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const findPermissionsByRoleId = async (role_id) => {
    try {
        const query = `SELECT p.* FROM permissions p 
                       JOIN role_permissions rp ON p.permission_id = rp.permission_id 
                       WHERE rp.role_id = $1 
                       ORDER BY p.category, p.permission_name`;
        const values = [role_id];
        const result = await con.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

export const findAllPermissions = async () => {
    try {
        const query = `SELECT * FROM permissions ORDER BY category, permission_name`;
        const result = await con.query(query);
        return result.rows;
    } catch (error) {
        throw error;
    }
};
