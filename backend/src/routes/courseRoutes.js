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

router.get('/', getCourses);
router.get('/:id', getCourseById);

router.post('/', protect, trainer, createCourse);
router.put('/:id', protect, trainer, updateCourse);
router.delete('/:id', protect, trainer, deleteCourse);

export default router;
