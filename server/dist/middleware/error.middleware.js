"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const response_1 = require("../utils/response");
const env_1 = require("../config/env");
const errorHandler = (err, req, res, next) => {
    // Handle known HTTP AppErrors securely
    if (err instanceof errors_1.AppError) {
        return (0, response_1.sendError)(res, err.statusCode, err.message, err.errors);
    }
    // Log unexpected errors
    console.error('[Unexpected Error]', err);
    // Mask unexpected error details in production to prevent leakage
    const message = env_1.env.NODE_ENV === 'production' ? 'Internal Server Error' : (err.message || 'Unknown Error');
    return (0, response_1.sendError)(res, 500, message);
};
exports.errorHandler = errorHandler;
