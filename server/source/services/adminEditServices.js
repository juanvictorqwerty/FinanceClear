import { pool } from '../config/database.js';

// Update user email and username
export const updateUserEmailUsername = async (oldEmail, oldUsername, newEmail, newUsername) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // The WHERE clause must use AND to uniquely identify the user record to update.
        // Using OR is dangerous as it can match multiple records if another user
        // shares either the old email or the old username. This leads to unintended updates
        // and "duplicate entry" errors if a unique key (like email) is violated.
        const userUpdateQuery = 'UPDATE user SET email = ?, username = ? WHERE email = ? AND username = ?';
        const [userUpdateResult] = await conn.query(userUpdateQuery, [newEmail, newUsername, oldEmail, oldUsername]);

        // If no user was updated, it means no user matched the combination of oldEmail and oldUsername.
        if (userUpdateResult.affectedRows === 0) {
            await conn.rollback();
            return { success: false, message: 'User not found with the provided current email and username.' };
        }

        // Also update the profile table. A similar check for affectedRows could be added here for robustness.
        const profileUpdateQuery = 'UPDATE profile SET email = ?, username = ? WHERE email = ? AND username = ?';
        await conn.query(profileUpdateQuery, [newEmail, newUsername, oldEmail, oldUsername]);

        await conn.commit();
        return { success: true };
    } catch (error) {
        await conn.rollback();
        console.error('Error updating user/profile:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            // The error message from SQL is quite informative and should be returned.
            return { success: false, message: `Update failed: ${error.sqlMessage}` };
        }
        return { success: false, message: 'Database error while updating user and profile.' };
    } finally {
        conn.release();
    }
};

// Update profile fees
export const updateProfileFees = async (username, school_fee_due, penalty_fee, excess_fee) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(
            'UPDATE profile SET school_fee_due = ?, penalty_fee = ?, excess_fee = ? WHERE username = ?',
            [school_fee_due, penalty_fee, excess_fee, username]
        );

        if (result.affectedRows === 0) {
            return { success: false, message: `Profile for username '${username}' not found.` };
        }
        return { success: true };
    } catch (error) {
        console.error('Error updating profile fees:', error);
        return { success: false, message: 'Database error while updating profile fees.' };
    } finally {
        if (conn) conn.release();
    }
};
