import express from 'express';
import { registerUsersController } from '../controllers/authController.js';

const router = express.Router();

router.post('/register-user',registerUsersController)

export default router;