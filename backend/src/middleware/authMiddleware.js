import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user || req.user.status === 'inactive') {
                return res.status(401).json({ message: 'Not authorized, account inactive or not found' });
            }

            return next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

export const trainer = (req, res, next) => {
    if (req.user && (req.user.role === 'trainer' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized to manage courses' });
    }
};

export const student = (req, res, next) => {
    if (req.user && req.user.role === 'student') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a student' });
    }
};
