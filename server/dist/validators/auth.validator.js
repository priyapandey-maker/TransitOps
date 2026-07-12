"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = void 0;
const common_validator_1 = require("./common.validator");
const errors_1 = require("../utils/errors");
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!(0, common_validator_1.isValidEmail)(email)) {
        return next(new errors_1.BadRequestError('Invalid or missing email'));
    }
    if (!(0, common_validator_1.isRequired)(password)) {
        return next(new errors_1.BadRequestError('Password is required'));
    }
    next();
};
exports.validateLogin = validateLogin;
