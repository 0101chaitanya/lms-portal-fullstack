import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

export const enrollInCourse = async (req, res) => {
    const { courseId } = req.body;

    try {
        
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const alreadyEnrolled = await Enrollment.findOne({
            studentId: req.user._id,
            courseId,
        });

        if (alreadyEnrolled) {
            return res.status(400).json({ message: 'You are already enrolled in this course' });
        }

        const enrollment = await Enrollment.create({
            studentId: req.user._id,
            courseId,
        });

        res.status(201).json({
            message: 'Successfully enrolled in course',
            enrollment,
        });
    } catch (error) {
        
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You are already enrolled in this course' });
        }
        res.status(500).json({ message: error.message });
    }
};

export const getEnrolledCourses = async (req, res) => {
    try {
        
        const enrollments = await Enrollment.find({ studentId: req.user._id })
            .populate({
                path: 'courseId',
                populate: {
                    path: 'trainerId',
                    select: 'name email profileImage'
                }
            })
            .sort('-enrolledAt'); 

        const validEnrollments = enrollments.filter(enrollment => enrollment.courseId);

        const enrolledCourses = validEnrollments.map(enrollment => ({
            ...enrollment.courseId._doc, 
            enrolledAt: enrollment.enrolledAt, 
        }));

        res.status(200).json(enrolledCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getStudentMetrics = async (req, res) => {
    try {
        const totalEnrolled = await Enrollment.countDocuments({ studentId: req.user._id });

        res.status(200).json({
            totalEnrolledCourses: totalEnrolled,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
