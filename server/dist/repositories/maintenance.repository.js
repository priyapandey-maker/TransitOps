"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusAndEndDate = exports.findOpenByVehicleId = exports.findById = exports.findAll = exports.create = void 0;
const base_repository_1 = require("./base.repository");
const create = async (maint, connection) => {
    const sql = `
    INSERT INTO maintenance_logs (vehicle_id, description, cost, start_date, created_by, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
    return (0, base_repository_1.execute)(sql, [
        maint.vehicle_id,
        maint.description,
        maint.cost,
        maint.start_date,
        maint.created_by,
        maint.status || 'Open'
    ], connection);
};
exports.create = create;
const findAll = async (limit, offset) => {
    const sql = `SELECT * FROM maintenance_logs ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    return (0, base_repository_1.query)(sql, [limit.toString(), offset.toString()]);
};
exports.findAll = findAll;
const findById = async (id) => {
    const sql = `SELECT * FROM maintenance_logs WHERE id = ?`;
    return (0, base_repository_1.queryOne)(sql, [id]);
};
exports.findById = findById;
const findOpenByVehicleId = async (vehicleId) => {
    const sql = `SELECT * FROM maintenance_logs WHERE vehicle_id = ? AND status = 'Open'`;
    return (0, base_repository_1.queryOne)(sql, [vehicleId]);
};
exports.findOpenByVehicleId = findOpenByVehicleId;
const updateStatusAndEndDate = async (id, status, endDate, connection) => {
    const sql = `UPDATE maintenance_logs SET status = ?, end_date = ? WHERE id = ?`;
    return (0, base_repository_1.execute)(sql, [status, endDate, id], connection);
};
exports.updateStatusAndEndDate = updateStatusAndEndDate;
