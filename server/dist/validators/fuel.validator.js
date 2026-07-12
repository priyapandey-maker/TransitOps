"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFuel = void 0;
const common_validator_1 = require("./common.validator");
const errors_1 = require("../utils/errors");
const validateFuel = (req, res, next) => {
    const { vehicle_id, trip_id, liters, cost, date } = req.body;
    if (!(0, common_validator_1.isPositiveNumber)(vehicle_id))
        return next(new errors_1.BadRequestError('vehicle_id is required and must be a positive number'));
    if (trip_id !== undefined && !(0, common_validator_1.isPositiveNumber)(trip_id)) {
        return next(new errors_1.BadRequestError('trip_id must be a positive number'));
    }
    if (!(0, common_validator_1.isPositiveNumber)(liters))
        return next(new errors_1.BadRequestError('liters must be a positive number greater than 0'));
    if (!(0, common_validator_1.isPositiveNumber)(cost))
        return next(new errors_1.BadRequestError('cost must be a positive number greater than 0'));
    if (!(0, common_validator_1.isValidDate)(date))
        return next(new errors_1.BadRequestError('date must be a valid date'));
    next();
};
exports.validateFuel = validateFuel;
