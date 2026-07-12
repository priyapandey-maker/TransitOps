"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPagination = exports.getPagination = void 0;
const constants_1 = require("../config/constants");
const getPagination = ({ page, limit }) => {
    const parsedPage = Math.max(1, parseInt(String(page), 10) || constants_1.PAGINATION.DEFAULT_PAGE);
    const parsedLimit = Math.max(1, parseInt(String(limit), 10) || constants_1.PAGINATION.DEFAULT_LIMIT);
    const safeLimit = Math.min(parsedLimit, constants_1.PAGINATION.MAX_LIMIT);
    const offset = (parsedPage - 1) * safeLimit;
    return {
        limit: safeLimit,
        offset,
    };
};
exports.getPagination = getPagination;
const applyPagination = (baseSql, pagination) => {
    return `${baseSql} LIMIT ${pagination.limit} OFFSET ${pagination.offset}`;
};
exports.applyPagination = applyPagination;
