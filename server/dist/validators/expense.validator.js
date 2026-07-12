"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateExpense = void 0;
const common_validator_1 = require("./common.validator");
const errors_1 = require("../utils/errors");
const validateExpense = (req, res, next) => {
    const { amount, category, date, vehicle_id, trip_id } = req.body;
    if (vehicle_id !== undefined && !(0, common_validator_1.isPositiveNumber)(vehicle_id)) {
        return next(new errors_1.BadRequestError('vehicle_id must be a positive number'));
    }
    if (trip_id !== undefined && !(0, common_validator_1.isPositiveNumber)(trip_id)) {
        return next(new errors_1.BadRequestError('trip_id must be a positive number'));
    }
    if (!(0, common_validator_1.isPositiveNumber)(amount))
        return next(new errors_1.BadRequestError('amount must be a positive number greater than 0'));
    if (!(0, common_validator_1.isValidDate)(date))
        return next(new errors_1.BadRequestError('date must be a valid date'));
    const validCategories = ['Fuel', 'Maintenance', 'Toll', 'Misc'];
    if (!validCategories.includes(category)) {
        return next(new errors_1.BadRequestError(`Invalid category. Must be one of: ${validCategories.join(', ')}`));
    }
    next();
};
exports.validateExpense = validateExpense;
