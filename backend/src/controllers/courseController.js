import Course from '../models/Course.js';
import Topic from '../models/Topic.js';
import Enrollment from '../models/Enrollment.js';

export const createCourse = async (req, res) => {
    const { title, description, thumbnail, category } = req.body;

    try {
        const course = await Course.create({
            title,
            description,
            thumbnail,
            category,
            trainerId: req.user._id, 
        });

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourses = async (req, res) => {
    try {
        
        const filter = req.query.trainerId ? { trainerId: req.query.trainerId } : {};

        const courses = await Course.find(filter).populate('trainerId', 'name email profileImage');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

export const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

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

export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.trainerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this course' });
        }

        await Topic.deleteMany({ courseId: course._id });
        
        await Enrollment.deleteMany({ courseId: course._id });
        
        await Course.deleteOne({ _id: course._id });

        res.status(200).json({ message: 'Course and associated topics and enrollments deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
