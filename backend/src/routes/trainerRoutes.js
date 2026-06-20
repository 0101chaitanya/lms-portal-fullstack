import express from 'express';
import { getTrainerMetrics } from '../controllers/trainerController.js';
import { protect, trainer } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/metrics', protect, trainer, getTrainerMetrics);

export default router;
