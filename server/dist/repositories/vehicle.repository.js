"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.update = exports.findByRegistration = exports.findById = exports.findAll = exports.create = void 0;
const base_repository_1 = require("./base.repository");
const create = async (vehicle) => {
    const sql = `
    INSERT INTO vehicles (registration_number, make, model, year, capacity, odometer, acquisition_cost, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
    return (0, base_repository_1.execute)(sql, [
        vehicle.registration_number,
        vehicle.make,
        vehicle.model,
        vehicle.year,
        vehicle.capacity,
        vehicle.odometer,
        vehicle.acquisition_cost,
        vehicle.status || 'Available'
    ]);
};
exports.create = create;
const findAll = async (limit, offset) => {
    const sql = `SELECT * FROM vehicles ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    return (0, base_repository_1.query)(sql, [limit.toString(), offset.toString()]);
};
exports.findAll = findAll;
const findById = async (id) => {
    const sql = `SELECT * FROM vehicles WHERE id = ?`;
    return (0, base_repository_1.queryOne)(sql, [id]);
};
exports.findById = findById;
const findByRegistration = async (registration) => {
    const sql = `SELECT * FROM vehicles WHERE registration_number = ?`;
    return (0, base_repository_1.queryOne)(sql, [registration]);
};
exports.findByRegistration = findByRegistration;
const update = async (id, vehicle) => {
    const sql = `
    UPDATE vehicles 
    SET registration_number = ?, make = ?, model = ?, year = ?, capacity = ?, odometer = ?, acquisition_cost = ?
    WHERE id = ?
  `;
    return (0, base_repository_1.execute)(sql, [
        vehicle.registration_number,
        vehicle.make,
        vehicle.model,
        vehicle.year,
        vehicle.capacity,
        vehicle.odometer,
        vehicle.acquisition_cost,
        id
    ]);
};
exports.update = update;
const updateStatus = async (id, status, connection) => {
    const sql = `UPDATE vehicles SET status = ? WHERE id = ?`;
    return (0, base_repository_1.execute)(sql, [status, id], connection);
};
exports.updateStatus = updateStatus;
