"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findById = exports.findAll = exports.create = void 0;
const base_repository_1 = require("./base.repository");
const create = async (fuel) => {
    const sql = `
    INSERT INTO fuel_logs (vehicle_id, trip_id, liters, cost, date, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
    return (0, base_repository_1.execute)(sql, [
        fuel.vehicle_id,
        fuel.trip_id || null,
        fuel.liters,
        fuel.cost,
        fuel.date,
        fuel.created_by
    ]);
};
exports.create = create;
const findAll = async (limit, offset) => {
    const sql = `SELECT * FROM fuel_logs ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    return (0, base_repository_1.query)(sql, [limit.toString(), offset.toString()]);
};
exports.findAll = findAll;
const findById = async (id) => {
    const sql = `SELECT * FROM fuel_logs WHERE id = ?`;
    return (0, base_repository_1.queryOne)(sql, [id]);
};
exports.findById = findById;
