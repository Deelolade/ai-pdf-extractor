"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const globalErrorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Internal server error";
    res.status(status).json({
        success: false,
        message
    });
};
exports.globalErrorHandler = globalErrorHandler;
