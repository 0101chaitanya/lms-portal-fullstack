// src/utils/generateTokens.js
import jwt from 'jsonwebtoken';

export const generateAccessToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '15m', // Short-lived access token
    });
};

export const generateRefreshToken = (res, id) => {
    const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d', // Long-lived refresh token
    });

    // Set refresh token in HttpOnly cookie
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return refreshToken;
};
