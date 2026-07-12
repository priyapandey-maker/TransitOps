"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDriverStatus = exports.validateDriver = void 0;
const common_validator_1 = require("./common.validator");
const errors_1 = require("../utils/errors");
const validateDriver = (req, res, next) => {
    const { license_number, license_expiry, first_name, last_name, phone, safety_score } = req.body;
    if (!(0, common_validator_1.isRequired)(license_number))
        return next(new errors_1.BadRequestError('license_number is required'));
    if (!(0, common_validator_1.isRequired)(first_name))
        return next(new errors_1.BadRequestError('first_name is required'));
    if (!(0, common_validator_1.isRequired)(last_name))
        return next(new errors_1.BadRequestError('last_name is required'));
    if (!(0, common_validator_1.isRequired)(phone))
        return next(new errors_1.BadRequestError('phone is required'));
    if (!(0, common_validator_1.isValidDate)(license_expiry))
        return next(new errors_1.BadRequestError('license_expiry must be a valid date'));
    if (safety_score !== undefined) {
        const score = Number(safety_score);
        if (isNaN(score) || score < 0 || score > 100) {
            return next(new errors_1.BadRequestError('safety_score must be a number between 0 and 100'));
        }
    }
    next();
};
exports.validateDriver = validateDriver;
const validateDriverStatus = (req, res, next) => {
    const { status } = req.body;
    const validStatuses = ['Available', 'On Trip', 'Inactive'];
    if (!validStatuses.includes(status)) {
        return next(new errors_1.BadRequestError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`));
    }
    next();
};
exports.validateDriverStatus = validateDriverStatus;
