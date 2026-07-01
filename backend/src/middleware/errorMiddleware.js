
export const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    console.error(`[Error Handler] Error occurred: ${err.message}`, {
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        url: req.originalUrl,
        method: req.method,
    });

    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
