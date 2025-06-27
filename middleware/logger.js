// server/middleware/logger.js
const winston = require('winston');
const path = require('path');

// Define log levels and colors
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};
winston.addColors(colors);

// Define the format of the logs
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
);

// Create a logger instance
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
    },
    format: logFormat,
    transports: [
        new winston.transports.Console(),
        // Corrected path: '../logs/error.log' (one level up from middleware, then into logs)
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/error.log'),
            level: 'error',
        }),
        // Corrected path: '../logs/combined.log'
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/combined.log'),
        }),
    ],
    exitOnError: false,
});

module.exports = logger;