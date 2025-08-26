import { pool } from '../config/database.js';

// Get all profiles
export const getAllProfiles = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM profile');
        return { success: true, data: rows };
    } catch (error) {
        console.error('Error fetching profiles:', error);
        return { success: false, message: 'Database error while fetching profiles.' };
    }
};

// Search profiles by username or email
export const searchProfiles = async (searchTerm) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM profile WHERE username LIKE ? OR email LIKE ?`,
            [`%${searchTerm}%`, `%${searchTerm}%`]
        );
        return { success: true, data: rows };
    } catch (error) {
        console.error('Error searching profiles:', error);
        return { success: false, message: 'Database error while searching profiles.' };
    }
};
