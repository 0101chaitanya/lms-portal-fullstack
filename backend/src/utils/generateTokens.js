
import jwt from 'jsonwebtoken';

export const generateAccessToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '15m', 
    });
};

export const generateRefreshToken = (res, id) => {
    const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d', 
    });

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', 
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
        partitioned: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return refreshToken;
};
