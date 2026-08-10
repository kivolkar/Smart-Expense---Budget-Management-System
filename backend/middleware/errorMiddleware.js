// Middleware for catching requests to unhandled routes (404 Not Found)
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Passes the error to our errorHandler
};

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
    // If the status code is still 200, set it to 500 (Internal Server Error)
    // Otherwise, keep the existing error status code (like 400 or 401)
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Send JSON response with error details
    res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export { notFound, errorHandler };
