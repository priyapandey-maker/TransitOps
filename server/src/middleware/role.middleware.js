"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const express_1 = require("express");
// Placeholder for role middleware (Task S3-001)
const authorize = (...roles) => {
    return (req, res, next) => {
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=role.middleware.js.map