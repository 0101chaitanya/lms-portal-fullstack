import express from 'express';
import {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
} from '../controllers/courseController.js';
import { protect, trainer } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected routes (Trainer/Admin only via the 'trainer' middleware we wrote)
router.post('/', protect, trainer, createCourse);
router.put('/:id', protect, trainer, updateCourse);
router.delete('/:id', protect, trainer, deleteCourse);

export default router;
