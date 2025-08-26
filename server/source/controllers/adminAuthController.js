import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as adminAuthServices from '../services/adminAuthServices.js';

export const loginAdmin = async (req, res) => {
    const { userEmail, password } = req.body;

    if (!userEmail || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    try {
        const admin = await adminAuthServices.findAdminByEmail(userEmail);

        if (!admin) {
            // Use a generic message to avoid revealing whether an email exists
            return res.status(401).json({ success: false, message: 'Invalid credentials. Please try again.' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials. Please try again.' });
        }

        // Create JWT payload
        const payload = { id: admin.id, email: admin.email, role: 'admin' };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Remove password from the object sent to the client
        const { password: _, ...adminData } = admin;

        res.status(200).json({
            success: true,
            message: 'Admin login successful',
            token,
            user: adminData, // The frontend expects a 'user' object
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ success: false, message: 'Server error during admin login.' });
    }
};

export const registerAdmin = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'Username, email, and password are required.' });
    }

    try {
        // Check if an admin with the same email already exists to provide a clear error
        const existingAdmin = await adminAuthServices.findAdminByEmail(email);
        if (existingAdmin) {
            return res.status(409).json({ success: false, message: 'An admin with this email already exists.' });
        }

        const newAdminId = await adminAuthServices.createAdmin(username, email, password);

        res.status(201).json({ success: true, message: 'Admin registered successfully', adminId: newAdminId });
    } catch (error) {
        console.error('Admin registration error:', error);
        // Catch potential race conditions or duplicate username errors from the DB
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'An admin with this username or email already exists.' });
        }
        res.status(500).json({ success: false, message: 'Server error during admin registration.' });
    }
};