"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVehicleStatus = exports.validateVehicle = void 0;
const common_validator_1 = require("./common.validator");
const errors_1 = require("../utils/errors");
const validateVehicle = (req, res, next) => {
    const { registration_number, make, model, year, capacity, odometer, acquisition_cost } = req.body;
    if (!(0, common_validator_1.isRequired)(registration_number))
        return next(new errors_1.BadRequestError('registration_number is required'));
    if (!(0, common_validator_1.isRequired)(make))
        return next(new errors_1.BadRequestError('make is required'));
    if (!(0, common_validator_1.isRequired)(model))
        return next(new errors_1.BadRequestError('model is required'));
    const y = Number(year);
    if (isNaN(y) || y < 1990)
        return next(new errors_1.BadRequestError('year must be 1990 or later'));
    if (!(0, common_validator_1.isPositiveNumber)(capacity))
        return next(new errors_1.BadRequestError('capacity must be a positive number greater than 0'));
    if (!(0, common_validator_1.isNonNegativeNumber)(odometer))
        return next(new errors_1.BadRequestError('odometer must be a non-negative number'));
    if (!(0, common_validator_1.isNonNegativeNumber)(acquisition_cost))
        return next(new errors_1.BadRequestError('acquisition_cost must be a non-negative number'));
    next();
};
exports.validateVehicle = validateVehicle;
const validateVehicleStatus = (req, res, next) => {
    const { status } = req.body;
    const validStatuses = ['Available', 'On Trip', 'In Shop', 'Retired'];
    if (!validStatuses.includes(status)) {
        return next(new errors_1.BadRequestError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`));
    }
    next();
};
exports.validateVehicleStatus = validateVehicleStatus;
