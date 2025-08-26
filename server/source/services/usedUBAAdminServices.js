import { pool } from '../config/database.js';

// Get all usedUBA_receipt
export const getAllUsedUBAReceipts = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM usedUBA_receipt');
        return { success: true, data: rows };
    } catch (error) {
        console.error('Error fetching usedUBA_receipt:', error);
        return { success: false, message: 'Database error while fetching usedUBA_receipt.' };
    }
};

// Search usedUBA_receipt by user or receipt_id
export const searchUsedUBAReceipts = async (searchTerm) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM usedUBA_receipt WHERE receipt_user LIKE ? OR receipt_id LIKE ?`,
            [`%${searchTerm}%`, `%${searchTerm}%`]
        );
        return { success: true, data: rows };
    } catch (error) {
        console.error('Error searching usedUBA_receipt:', error);
        return { success: false, message: 'Database error while searching usedUBA_receipt.' };
    }
};
