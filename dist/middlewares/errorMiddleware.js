"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const notFound = (req, res, _next) => {
    res.status(404).json({ success: false, message: `Route not found - ${req.originalUrl}` });
};
exports.notFound = notFound;
const errorHandler = (err, _req, res, _next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    console.error(err);
    if (err.code === 'P2002')
        return res.status(400).json({ success: false, message: 'Duplicate entry' });
    if (err.name === 'ZodError')
        return res.status(400).json({ success: false, message: 'Validation failed', errors: err.errors });
    res.status(statusCode).json({ success: false, message: err.message || 'Server Error', stack: process.env.NODE_ENV === 'production' ? undefined : err.stack });
};
exports.errorHandler = errorHandler;
