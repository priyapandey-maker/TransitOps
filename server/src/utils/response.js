"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const express_1 = require("express");
const sendSuccess = (res, statusCode, message, data) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, statusCode, message, errors) => {
    res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
};
exports.sendError = sendError;
//# sourceMappingURL=response.js.map