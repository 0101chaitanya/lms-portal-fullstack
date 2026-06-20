// src/models/Course.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String, // URL to the image (e.g., local upload or cloud)
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        trainerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);
export default Course;
