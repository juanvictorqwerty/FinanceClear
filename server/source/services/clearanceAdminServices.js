import { pool } from '../config/database.js';

// Get all clearances
export const getAllClearances = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM clearance');
        return { success: true, data: rows };
    } catch (error) {
        console.error('Error fetching clearances:', error);
        return { success: false, message: 'Database error while fetching clearances.' };
    }
};

// Search clearances by user or receipt_id
export const searchClearances = async (searchTerm) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM clearance WHERE receipt_user LIKE ? OR receipt_id LIKE ?`,
            [`%${searchTerm}%`, `%${searchTerm}%`]
        );
        return { success: true, data: rows };
    } catch (error) {
        console.error('Error searching clearances:', error);
        return { success: false, message: 'Database error while searching clearances.' };
    }
};
