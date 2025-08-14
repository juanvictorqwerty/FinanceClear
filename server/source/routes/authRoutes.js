import express from 'express';
import { registerUsersController,loginUserController } from '../controllers/authController.js';

const router = express.Router();

router.post('/register-user',registerUsersController);
router.post('/login-user',loginUserController);

export default router;