import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// Route to check if a user exists
// This will be accessible at GET /api/users/check_user?name=some_username
router.get('/check_user', async (req, res) => {
    // The frontend sends the username in the 'name' query parameter
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        // It's a good practice to normalize the input on the backend for consistency
        const normalizedUsername = name.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

        // This query assumes you have a 'users' table with a 'username' column.
        const [rows] = await pool.query('SELECT username FROM users WHERE username = ?', [normalizedUsername]);

        res.json({ user_exists: rows.length > 0 });
    } catch (error) {
        console.error('Error checking user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export { router };