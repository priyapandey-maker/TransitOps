"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertHistory = exports.updateStatus = exports.findById = exports.findAll = exports.create = void 0;
const base_repository_1 = require("./base.repository");
const create = async (trip) => {
    const sql = `
    INSERT INTO trips (vehicle_id, driver_id, origin, destination, purpose, created_by, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
    return (0, base_repository_1.execute)(sql, [
        trip.vehicle_id,
        trip.driver_id,
        trip.origin,
        trip.destination,
        trip.purpose || null,
        trip.created_by,
        trip.status || 'Draft'
    ]);
};
exports.create = create;
const findAll = async (limit, offset) => {
    const sql = `SELECT * FROM trips ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    return (0, base_repository_1.query)(sql, [limit.toString(), offset.toString()]);
};
exports.findAll = findAll;
const findById = async (id) => {
    const sql = `SELECT * FROM trips WHERE id = ?`;
    return (0, base_repository_1.queryOne)(sql, [id]);
};
exports.findById = findById;
const updateStatus = async (id, status, connection) => {
    const sql = `UPDATE trips SET status = ? WHERE id = ?`;
    return (0, base_repository_1.execute)(sql, [status, id], connection);
};
exports.updateStatus = updateStatus;
const insertHistory = async (tripId, prevStatus, newStatus, userId, connection) => {
    const sql = `
    INSERT INTO trip_status_history (trip_id, previous_status, new_status, changed_by)
    VALUES (?, ?, ?, ?)
  `;
    return (0, base_repository_1.execute)(sql, [tripId, prevStatus, newStatus, userId], connection);
};
exports.insertHistory = insertHistory;
