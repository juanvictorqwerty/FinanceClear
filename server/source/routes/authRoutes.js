import express from 'express';
import { registerUsersController,loginUserController,getUserFromToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/register-user',registerUsersController);
router.post('/login-user',loginUserController);
router.get('/get-userData',getUserFromToken)

export default router;