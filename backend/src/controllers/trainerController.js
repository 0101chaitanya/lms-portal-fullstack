import Course from '../models/Course.js';
import Topic from '../models/Topic.js';
import Enrollment from '../models/Enrollment.js';

export const getTrainerMetrics = async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';
        const filter = isAdmin ? {} : { trainerId: req.user._id };

        const courses = await Course.find(filter);
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
