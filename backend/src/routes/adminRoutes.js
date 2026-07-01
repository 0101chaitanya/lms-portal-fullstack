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

router.use(protect, admin);

router.get('/metrics', getDashboardMetrics);

router.post('/trainers', addTrainer);

router.get('/users', getUsersByRole);
router.route('/users/:id')
    .put(updateUser)
    .delete(deleteUser);

router.patch('/users/:id/status', toggleUserStatus);

export default router;
