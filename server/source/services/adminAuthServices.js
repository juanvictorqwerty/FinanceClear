import { pool } from '../config/database.js';
import bcrypt from 'bcrypt';

// Find an admin by their email address
export const findAdminByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM admin WHERE email = ?', [email]);
    return rows[0]; // Returns the admin record or undefined if not found
};

// Create a new admin user
export const createAdmin = async (username, email, password) => {
    const saltRounds = 10; // Standard salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.query(
        'INSERT INTO admin (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
    );
    return result.insertId; // Return the ID of the newly created admin
};