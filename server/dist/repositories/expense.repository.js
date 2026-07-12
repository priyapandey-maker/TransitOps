"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findById = exports.findAll = exports.create = void 0;
const base_repository_1 = require("./base.repository");
const create = async (expense) => {
    const sql = `
    INSERT INTO expenses (vehicle_id, trip_id, amount, category, description, date, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
    return (0, base_repository_1.execute)(sql, [
        expense.vehicle_id || null,
        expense.trip_id || null,
        expense.amount,
        expense.category,
        expense.description || null,
        expense.date,
        expense.created_by
    ]);
};
exports.create = create;
const findAll = async (limit, offset) => {
    const sql = `SELECT * FROM expenses ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    return (0, base_repository_1.query)(sql, [limit.toString(), offset.toString()]);
};
exports.findAll = findAll;
const findById = async (id) => {
    const sql = `SELECT * FROM expenses WHERE id = ?`;
    return (0, base_repository_1.queryOne)(sql, [id]);
};
exports.findById = findById;
