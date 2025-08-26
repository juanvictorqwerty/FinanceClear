import { pool } from '../config/database.js';

/**
 * Fetches a user's financial profile from the database.
 * @param {string} username - The user's username.
 * @returns {Promise<Object>} Result object with profile data.
 */
export const getUserProfileByUsername = async (username) => {
    try {
        const [rows] = await pool.query(`SELECT school_fee_due, penalty_fee, excess_fee FROM profile WHERE username = ?`, [username]);
        if (rows.length === 0) {
            return { success: false, message: "User profile not found." };
        }
        return { success: true, data: rows[0] };
    } catch (error) {
        console.error(`Error fetching profile for ${username}:`, error);
        return { success: false, message: "Database error while fetching user profile." };
    }
};

/**
 * Fetches all used receipt IDs for a specific user.
 * @param {string} username - The user's username.
 * @returns {Promise<Object>} Result object with an array of used receipts.
 */
export const getUsedReceiptsForUser = async (username) => {
    try {
        const [rows] = await pool.query(`SELECT receipt_id FROM usedUBA_receipt WHERE receipt_user = ?`, [username]);
        return { success: true, data: rows };
    } catch (error) {
        console.error(`Error fetching used receipts for ${username}:`, error);
        return { success: false, message: "Database error while fetching used receipts." };
    }
};

/**
 * Atomically updates a user's financial status (clears dues, sets new excess fee)
 * and marks the provided receipts as used in a single transaction.
 * @param {string} username - The user's username.
 * @param {number} newExcessFee - The calculated new excess fee.
 * @param {Array<string>} receiptIds - The list of valid receipt IDs to mark as used.
 * @returns {Promise<Object>} Result object indicating transaction success or failure.
 */
export const updateUserAndMarkReceipts = async (username, newExcessFee, receiptIds) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query(`UPDATE profile SET penalty_fee = 0, excess_fee = ? WHERE username = ?`, [newExcessFee, username]);

        if (receiptIds && receiptIds.length > 0) {
            const usedReceiptsQuery = `INSERT INTO usedUBA_receipt (receipt_id, receipt_user) VALUES ?`;
            const usedReceiptsValues = receiptIds.map(id => [id, username]);
            await connection.query(usedReceiptsQuery, [usedReceiptsValues]);
        }

        await connection.commit();
        return { success: true, message: "User profile and receipts updated successfully." };
    } catch (error) {
        await connection.rollback();
        console.error(`Transaction error for ${username}:`, error);
        return { success: false, message: "Database transaction failed." };
    } finally {
        connection.release();
    }
};