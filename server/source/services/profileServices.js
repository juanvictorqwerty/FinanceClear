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

        // 1. Get user's email from profile
        const [profileRows] = await connection.query(`SELECT email, used_receipt FROM profile WHERE username = ?`, [username]);
        if (profileRows.length === 0) {
            throw new Error('User profile not found for updating receipts.');
        }
        const userEmail = profileRows[0].email;
        let usedReceiptJson = [];
        if (profileRows[0].used_receipt) {
            try {
                const parsed = JSON.parse(profileRows[0].used_receipt);
                if (Array.isArray(parsed)) {
                    usedReceiptJson = parsed;
                } else if (parsed) {
                    usedReceiptJson = [parsed];
                }
            } catch (e) {
                // If parsing fails, start fresh
                usedReceiptJson = [];
            }
        }

        // 2. Insert into clearance table and get clearance_id
        let clearanceId = null;
        if (receiptIds && receiptIds.length > 0) {
            // Insert one row for this clearance (could be one per receipt, but let's do one for the batch)
            const [clearanceResult] = await connection.query(
                `INSERT INTO clearance (receipt_user, receipt_id) VALUES (?, ?)`,
                [userEmail, receiptIds.join(",")]
            );
            clearanceId = clearanceResult.insertId;
        }

        // 3. Update profile's used_receipt JSON field
        if (clearanceId) {
            usedReceiptJson.push({
                clearance_id: clearanceId,
                email: userEmail,
                receipt_ids: receiptIds
            });
            await connection.query(
                `UPDATE profile SET used_receipt = ? WHERE username = ?`,
                [JSON.stringify(usedReceiptJson), username]
            );
        }

        // 4. Update penalty and excess fee
        await connection.query(`UPDATE profile SET penalty_fee = 0, excess_fee = ? WHERE username = ?`, [newExcessFee, username]);

        // 5. Insert into usedUBA_receipt as before
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