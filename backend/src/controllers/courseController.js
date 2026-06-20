import Course from '../models/Course.js';
import Topic from '../models/Topic.js';

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Trainer/Admin)
export const createCourse = async (req, res) => {
    const { title, description, thumbnail, category } = req.body;

    try {
        const course = await Course.create({
            title,
            description,
            thumbnail,
            category,
            trainerId: req.user._id, // Tied to the logged-in trainer or admin
        });

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all courses (for public catalog or admin/trainer view)
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
    try {
        // Optionally filter by trainerId if passed as a query
        const filter = req.query.trainerId ? { trainerId: req.query.trainerId } : {};

        // Populate trainer details
        const courses = await Course.find(filter).populate('trainerId', 'name email profileImage');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('trainerId', 'name email');

        if (course) {
            res.status(200).json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Trainer/Admin)
export const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Ensure the user updating the course is the owner OR an admin
        if (course.trainerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this course' });
        }

        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Trainer/Admin)
export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.trainerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this course' });
        }

        // Delete associated topics first
        await Topic.deleteMany({ courseId: course._id });
        // Then delete the course
        await Course.deleteOne({ _id: course._id });

        res.status(200).json({ message: 'Course and associated topics deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
