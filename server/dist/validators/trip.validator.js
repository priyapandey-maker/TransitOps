"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateTrip = void 0;
const common_validator_1 = require("./common.validator");
const errors_1 = require("../utils/errors");
const validateCreateTrip = (req, res, next) => {
    const { vehicle_id, driver_id, origin, destination } = req.body;
    if (!(0, common_validator_1.isPositiveNumber)(vehicle_id))
        return next(new errors_1.BadRequestError('vehicle_id is required and must be a positive number'));
    if (!(0, common_validator_1.isPositiveNumber)(driver_id))
        return next(new errors_1.BadRequestError('driver_id is required and must be a positive number'));
    if (!(0, common_validator_1.isRequired)(origin))
        return next(new errors_1.BadRequestError('origin is required'));
    if (!(0, common_validator_1.isRequired)(destination))
        return next(new errors_1.BadRequestError('destination is required'));
    next();
};
exports.validateCreateTrip = validateCreateTrip;
