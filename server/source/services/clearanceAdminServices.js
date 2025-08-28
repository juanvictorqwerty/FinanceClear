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

// Manually add a clearance to a user's profile
export const addClearanceToProfile = async (userEmail) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Get user's profile and current used_receipt from profile using email
        const [profileRows] = await connection.query(`SELECT username, used_receipt FROM profile WHERE email = ?`, [userEmail]);
        if (profileRows.length === 0) {
            throw new Error('User profile not found for this email.');
        }
        const username = profileRows[0].username;
        let usedReceiptJson = [];
        if (profileRows[0].used_receipt) {
            try {
                let raw = profileRows[0].used_receipt;
                if (Buffer.isBuffer(raw)) {
                    raw = raw.toString('utf8');
                }
                if (typeof raw === 'string' && raw.trim().length > 0) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        usedReceiptJson = parsed;
                    } else if (parsed) {
                        usedReceiptJson = [parsed];
                    }
                } else if (Array.isArray(raw)) {
                    usedReceiptJson = raw;
                }
            } catch (e) {
                // If parsing fails, start fresh
                usedReceiptJson = [];
            }
        }

        // 2. Insert into clearance table and get clearance_id
        const receiptIdString = "added by Admin_" + Date.now(); // MODIFIED LINE
        const [clearanceResult] = await connection.query(
            `INSERT INTO clearance (receipt_user, receipt_id) VALUES (?, ?)`,
            [userEmail, receiptIdString]
        );
        const clearanceId = clearanceResult.insertId;

        // 3. Update profile's used_receipt JSON field
        usedReceiptJson.push({
            id: clearanceId,
            clearance_id: clearanceId,
            email: userEmail,
            receipt_ids: [receiptIdString] // Store "added by Admin" in receipt_ids array
        });
        await connection.query(
            `UPDATE profile SET used_receipt = ? WHERE username = ?`,
            [JSON.stringify(usedReceiptJson), username]
        );

        // No insertion into usedUBA_receipt as there are no real receipt IDs

        await connection.commit();
        return { success: true, message: "Clearance added successfully to user's profile." };
    } catch (error) {
        await connection.rollback();
        console.error(`Transaction error for ${userEmail}:`, error);
        return { success: false, message: "Database transaction failed while adding clearance." };
    } finally {
        connection.release();
    }
};
