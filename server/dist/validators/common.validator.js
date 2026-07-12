"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = exports.isValidDate = exports.isNonNegativeNumber = exports.isPositiveNumber = exports.isRequired = void 0;
const isRequired = (value) => {
    if (value === null || value === undefined)
        return false;
    if (typeof value === 'string' && value.trim() === '')
        return false;
    return true;
};
exports.isRequired = isRequired;
const isPositiveNumber = (value) => {
    if (!(0, exports.isRequired)(value))
        return false;
    const num = Number(value);
    return !isNaN(num) && num > 0;
};
exports.isPositiveNumber = isPositiveNumber;
const isNonNegativeNumber = (value) => {
    if (!(0, exports.isRequired)(value))
        return false;
    const num = Number(value);
    return !isNaN(num) && num >= 0;
};
exports.isNonNegativeNumber = isNonNegativeNumber;
const isValidDate = (value) => {
    if (!(0, exports.isRequired)(value))
        return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
};
exports.isValidDate = isValidDate;
const isValidEmail = (value) => {
    if (!(0, exports.isRequired)(value))
        return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
};
exports.isValidEmail = isValidEmail;
