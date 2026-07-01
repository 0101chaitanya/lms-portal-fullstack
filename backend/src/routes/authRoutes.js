import express from 'express';
import {
    registerStudent,
    verifyEmail,
    loginUser,
    logoutUser,
    refreshAccessToken,
    updateUserProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerStudent);
router.post('/verify-email', verifyEmail); 
router.post('/login', loginUser);
router.post('/refresh', refreshAccessToken);

router.post('/logout', protect, logoutUser);
router.put('/profile', protect, updateUserProfile);

export default router;
