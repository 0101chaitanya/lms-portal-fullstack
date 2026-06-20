import express from 'express';
import {
    createTopic,
    getTopicsByCourse,
    updateTopic,
    deleteTopic,
} from '../controllers/topicController.js';
import { protect, trainer } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:courseId', getTopicsByCourse);

router.post('/', protect, trainer, createTopic);
router.put('/:id', protect, trainer, updateTopic);
router.delete('/:id', protect, trainer, deleteTopic);

export default router;
