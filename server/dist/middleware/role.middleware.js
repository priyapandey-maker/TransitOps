"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const errors_1 = require("../utils/errors");
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return next(new errors_1.UnauthorizedError('User is not authenticated properly'));
        }
        if (!roles.includes(req.user.role)) {
            return next(new errors_1.ForbiddenError('Access denied: insufficient permissions'));
        }
        next();
    };
};
exports.authorize = authorize;
