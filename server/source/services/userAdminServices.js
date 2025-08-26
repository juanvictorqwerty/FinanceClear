import { pool } from '../config/database.js';

// Get all users with email, username, and matricule
export const getAllUsers = async () => {
    try {
        const [rows] = await pool.query('SELECT email, username, matricule FROM user');
        return { success: true, data: rows };
    } catch (error) {
        console.error('Error fetching users:', error);
        return { success: false, message: 'Database error while fetching users.' };
    }
};

// Search users by username, email, or matricule
export const searchUsers = async (searchTerm) => {
    try {
        const [rows] = await pool.query(
            `SELECT email, username, matricule FROM user WHERE username LIKE ? OR email LIKE ? OR matricule LIKE ?`,
            [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
        );
        return { success: true, data: rows };
    } catch (error) {
        console.error('Error searching users:', error);
        return { success: false, message: 'Database error while searching users.' };
    }
};
