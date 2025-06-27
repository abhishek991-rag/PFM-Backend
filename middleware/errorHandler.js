// server/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Agar response code 200 hai, toh 500 internal server error set karein

    res.status(statusCode);

    res.json({
        message: err.message,
        // Development mode mein stack trace dikhayein
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorHandler;