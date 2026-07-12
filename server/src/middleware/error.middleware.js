"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const express_1 = require("express");
const response_1 = require("../utils/response");
const env_1 = require("../config/env");
const errorHandler = (err, req, res, next) => {
    console.error('[Error]', err);
    const message = env_1.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
    return (0, response_1.sendError)(res, err.statusCode || 500, message);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map