"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMaintenance = void 0;
const common_validator_1 = require("./common.validator");
const errors_1 = require("../utils/errors");
const validateMaintenance = (req, res, next) => {
    const { vehicle_id, description, cost, start_date } = req.body;
    if (!(0, common_validator_1.isPositiveNumber)(vehicle_id))
        return next(new errors_1.BadRequestError('vehicle_id is required and must be a positive number'));
    if (!(0, common_validator_1.isRequired)(description))
        return next(new errors_1.BadRequestError('description is required'));
    if (!(0, common_validator_1.isPositiveNumber)(cost))
        return next(new errors_1.BadRequestError('cost must be a positive number greater than 0'));
    if (!(0, common_validator_1.isValidDate)(start_date))
        return next(new errors_1.BadRequestError('start_date must be a valid date'));
    next();
};
exports.validateMaintenance = validateMaintenance;
