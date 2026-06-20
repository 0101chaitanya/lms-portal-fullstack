import Course from '../models/Course.js';
import Topic from '../models/Topic.js';
import Enrollment from '../models/Enrollment.js';

// @desc    Get trainer dashboard metrics
// @route   GET /api/trainer/metrics
// @access  Private (Trainer)
export const getTrainerMetrics = async (req, res) => {
    try {
        const trainerId = req.user._id;

        // Get all courses owned by this trainer
        const courses = await Course.find({ trainerId });
        const courseIds = courses.map(course => course._id);

        const totalCourses = courses.length;
        const totalTopics = await Topic.countDocuments({ courseId: { $in: courseIds } });
        const totalStudentsEnrolled = await Enrollment.countDocuments({ courseId: { $in: courseIds } });

        res.status(200).json({
            totalCourses,
            totalTopics,
            totalStudentsEnrolled,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
