import express from 'express';
import {
    getDashboardMetrics,
    addTrainer,
    getUsersByRole,
    updateUser,
    deleteUser,
    toggleUserStatus,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect and admin middleware to all routes in this file
router.use(protect, admin);

// Dashboard
router.get('/metrics', getDashboardMetrics);

// Trainers
router.post('/trainers', addTrainer);

// Generic User Management (query ?role=trainer or ?role=student)
router.get('/users', getUsersByRole);
router.route('/users/:id')
    .put(updateUser)
    .delete(deleteUser);

// Status Toggle
router.patch('/users/:id/status', toggleUserStatus);

export default router;
