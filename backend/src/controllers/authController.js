import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';
import { Resend } from 'resend';
import dotenv from "dotenv";
dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper to generate a 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
export const registerStudent = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate 6-digit OTP and set expiration to 10 minutes from now
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        // Create user (unverified by default)
        const user = await User.create({
            name,
            email,
            password,
            role: 'student',
            isVerified: false,
            otp,
            otpExpires,
        });

        if (user) {
            // Send OTP email via Resend
            await resend.emails.send({
                from: 'Acme <onboarding@resend.dev>', // Update with your verified Resend domain
                to: [user.email],
                subject: 'Your LMS Portal Verification Code',
                html: `
          <h2>Welcome to the LMS Portal, ${user.name}!</h2>
          <p>Your email verification code is:</p>
          <h1 style="letter-spacing: 5px; color: #aa3bff;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        `,
            });

            res.status(201).json({
                message: 'Registration successful! Please check your email for the OTP.',
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify user email with OTP
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email is already verified.' });
        }

        // Check if OTP matches and hasn't expired
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        if (user.otpExpires < new Date()) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        // Update user to verified and remove OTP fields
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // Enforce OTP verification
        if (user && !user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email using the OTP before logging in.' });
        }

        // Check if user exists, is active, and passwords match
        if (user && user.status === 'active' && (await user.matchPassword(password))) {
            const accessToken = generateAccessToken(user._id, user.role);
            generateRefreshToken(res, user._id);

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken,
            });
        } else if (user && user.status === 'inactive') {
            res.status(401).json({ message: 'Your account has been deactivated. Please contact an Admin.' });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};
