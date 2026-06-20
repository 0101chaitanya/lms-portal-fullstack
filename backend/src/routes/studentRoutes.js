import express from 'express';
import {
    enrollInCourse,
    getEnrolledCourses,
    getStudentMetrics,
} from '../controllers/studentController.js';
import { protect, student } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are strictly for Students
router.use(protect, student);

router.post('/enroll', enrollInCourse);
router.get('/enrolled-courses', getEnrolledCourses);
router.get('/metrics', getStudentMetrics);

export default router;
