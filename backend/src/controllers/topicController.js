import Topic from '../models/Topic.js';
import Course from '../models/Course.js';

// @desc    Create a topic for a course
// @route   POST /api/topics
// @access  Private (Trainer/Admin)
export const createTopic = async (req, res) => {
    const { courseId, title, description, videoUrl, order } = req.body;

    try {
        // Verify course exists and user has permission
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        if (course.trainerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to add topics to this course' });
        }

        const topic = await Topic.create({
            courseId,
            title,
            description,
            videoUrl, // Storing the YouTube URL as requested
            order,
        });

        res.status(201).json(topic);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all topics for a specific course
// @route   GET /api/topics/:courseId
// @access  Public (Students will access this to view topics)
export const getTopicsByCourse = async (req, res) => {
    try {
        // Sort by the 'order' field so they play sequentially
        const topics = await Topic.find({ courseId: req.params.courseId }).sort('order');
        res.status(200).json(topics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a topic
// @route   PUT /api/topics/:id
// @access  Private (Trainer/Admin)
export const updateTopic = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        if (!topic) return res.status(404).json({ message: 'Topic not found' });

        const course = await Course.findById(topic.courseId);
        if (course.trainerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedTopic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedTopic);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a topic
// @route   DELETE /api/topics/:id
// @access  Private (Trainer/Admin)
export const deleteTopic = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        if (!topic) return res.status(404).json({ message: 'Topic not found' });

        const course = await Course.findById(topic.courseId);
        if (course.trainerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Topic.deleteOne({ _id: topic._id });
        res.status(200).json({ message: 'Topic deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
