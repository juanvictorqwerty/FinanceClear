import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// POST /api/profile/get-profile
router.post('/get-profile', async (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ success: false, message: 'Username is required' });
    }
    try {
        const [rows] = await pool.query('SELECT used_receipt FROM profile WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

export default router;
