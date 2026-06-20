import express from 'express';
import {
    registerStudent,
    verifyEmail,
    loginUser,
    logoutUser,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerStudent);
router.post('/verify-email', verifyEmail); // Using POST because we are submitting an OTP
router.post('/login', loginUser);

// Protected routes
router.post('/logout', protect, logoutUser);

export default router;
