import User from '../models/User.js';
import Course from '../models/Course.js';
import Topic from '../models/Topic.js';
import Enrollment from '../models/Enrollment.js';

export const getDashboardMetrics = async (req, res) => {
    try {
        const totalTrainers = await User.countDocuments({ role: 'trainer' });
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalCourses = await Course.countDocuments();
        const totalTopics = await Topic.countDocuments();

        res.status(200).json({
            totalTrainers,
            totalStudents,
            totalCourses,
            totalTopics,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addTrainer = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const trainer = await User.create({
            name,
            email,
            password,
            role: 'trainer',
            isVerified: true, 
        });

        res.status(201).json({
            _id: trainer._id,
            name: trainer.name,
            email: trainer.email,
            role: trainer.role,
            message: 'Trainer added successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsersByRole = async (req, res) => {
    const { role } = req.query;

    try {
        
        if (role !== 'trainer' && role !== 'student') {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        const users = await User.find({ role }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    const { name, email } = req.body;

    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;

            const updatedUser = await user.save();
            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.role === 'admin') {
                return res.status(400).json({ message: 'Cannot delete admin users' });
            }

            if (user.role === 'student') {
                
                await Enrollment.deleteMany({ studentId: user._id });
            } else if (user.role === 'trainer') {
                
                const courses = await Course.find({ trainerId: user._id });
                const courseIds = courses.map(c => c._id);
                await Topic.deleteMany({ courseId: { $in: courseIds } });
                await Enrollment.deleteMany({ courseId: { $in: courseIds } });
                await Course.deleteMany({ trainerId: user._id });
            }

            await User.deleteOne({ _id: user._id });
            res.status(200).json({ message: 'User and all associated records deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.role === 'admin') {
                return res.status(400).json({ message: 'Cannot change admin status' });
            }

            user.status = user.status === 'active' ? 'inactive' : 'active';
            await user.save();

            res.status(200).json({
                message: `User status changed to ${user.status}`,
                status: user.status,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
