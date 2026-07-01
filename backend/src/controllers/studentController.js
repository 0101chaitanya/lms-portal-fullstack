import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

// @desc    Enroll a student in a course
// @route   POST /api/student/enroll
// @access  Private (Student)
export const enrollInCourse = async (req, res) => {
    const { courseId } = req.body;

    try {
        // Verify the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if the student is already enrolled
        const alreadyEnrolled = await Enrollment.findOne({
            studentId: req.user._id,
            courseId,
        });

        if (alreadyEnrolled) {
            return res.status(400).json({ message: 'You are already enrolled in this course' });
        }

        // Create the enrollment
        const enrollment = await Enrollment.create({
            studentId: req.user._id,
            courseId,
        });

        res.status(201).json({
            message: 'Successfully enrolled in course',
            enrollment,
        });
    } catch (error) {
        // Catch the duplicate key error from MongoDB just in case
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You are already enrolled in this course' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all courses a student is enrolled in
// @route   GET /api/student/enrolled-courses
// @access  Private (Student)
export const getEnrolledCourses = async (req, res) => {
    try {
        // Find enrollments and populate the course details along with the trainer's name
        const enrollments = await Enrollment.find({ studentId: req.user._id })
            .populate({
                path: 'courseId',
                populate: {
                    path: 'trainerId',
                    select: 'name email profileImage'
                }
            })
            .sort('-enrolledAt'); // Newest enrollments first

        // Filter out enrollments where the course no longer exists (defensive check)
        const validEnrollments = enrollments.filter(enrollment => enrollment.courseId);

        // Extract just the course objects to send back
        const enrolledCourses = validEnrollments.map(enrollment => ({
            ...enrollment.courseId._doc, // The populated course document
            enrolledAt: enrollment.enrolledAt, // Include the date they enrolled
        }));

        res.status(200).json(enrolledCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student dashboard metrics
// @route   GET /api/student/metrics
// @access  Private (Student)
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
