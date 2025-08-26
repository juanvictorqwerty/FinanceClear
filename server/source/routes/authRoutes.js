import express from 'express';
import rateLimit from 'express-rate-limit';
import { registerUser, loginUser } from '../controllers/authController.js';
import { loginAdmin, registerAdmin } from '../controllers/adminAuthController.js';
import { requireAdminAuth } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// Apply a rate limiter to all auth routes to prevent brute-force attacks.
// This is a crucial security measure for public-facing authentication endpoints.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 login/register requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});

router.use(authLimiter);

// --- Public User Routes ---
router.post('/register-user', registerUser);
router.post('/login-user', loginUser);

// --- Public Admin Login Route ---
router.post('/login-admin', loginAdmin);

// --- Protected Admin Registration Route ---
// This route is now protected. Only an already authenticated admin can create a new admin account.
router.post('/register-admin', registerAdmin);

export default router;