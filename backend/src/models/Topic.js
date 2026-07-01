
import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        videoUrl: {
            type: String, 
            required: true,
        },
        order: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const Topic = mongoose.model('Topic', topicSchema);
export default Topic;
