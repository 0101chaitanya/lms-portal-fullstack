// backend/src/createAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully.');

        const adminEmail = 'ololchaitanya@yahoo.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists!');
            process.exit(0);
        }

        const admin = await User.create({
            name: 'Mr. Admin',
            email: adminEmail,
            password: 'Pass@123', // Automatically hashed by User model middleware
            role: 'admin',
            isVerified: true,
            status: 'active'
        });

        console.log(`Admin user created: ${admin.email}`);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error.message);
        process.exit(1);
    }
};

createAdmin();
