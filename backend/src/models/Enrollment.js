// src/models/Enrollment.js
import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        enrolledAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true } // Creates createdAt and updatedAt automatically
);

// Prevent a student from enrolling in the same course twice
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
export default Enrollment;
