"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.update = exports.findByPhone = exports.findByLicense = exports.findById = exports.findAll = exports.create = void 0;
const base_repository_1 = require("./base.repository");
const create = async (driver) => {
    const sql = `
    INSERT INTO drivers (license_number, license_expiry, first_name, last_name, phone, safety_score, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
    return (0, base_repository_1.execute)(sql, [
        driver.license_number,
        driver.license_expiry,
        driver.first_name,
        driver.last_name,
        driver.phone,
        driver.safety_score,
        driver.status || 'Available'
    ]);
};
exports.create = create;
const findAll = async (limit, offset) => {
    const sql = `SELECT * FROM drivers ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    return (0, base_repository_1.query)(sql, [limit.toString(), offset.toString()]);
};
exports.findAll = findAll;
const findById = async (id) => {
    const sql = `SELECT * FROM drivers WHERE id = ?`;
    return (0, base_repository_1.queryOne)(sql, [id]);
};
exports.findById = findById;
const findByLicense = async (license) => {
    const sql = `SELECT * FROM drivers WHERE license_number = ?`;
    return (0, base_repository_1.queryOne)(sql, [license]);
};
exports.findByLicense = findByLicense;
const findByPhone = async (phone) => {
    const sql = `SELECT * FROM drivers WHERE phone = ?`;
    return (0, base_repository_1.queryOne)(sql, [phone]);
};
exports.findByPhone = findByPhone;
const update = async (id, driver) => {
    const sql = `
    UPDATE drivers 
    SET license_number = ?, license_expiry = ?, first_name = ?, last_name = ?, phone = ?, safety_score = ?
    WHERE id = ?
  `;
    return (0, base_repository_1.execute)(sql, [
        driver.license_number,
        driver.license_expiry,
        driver.first_name,
        driver.last_name,
        driver.phone,
        driver.safety_score,
        id
    ]);
};
exports.update = update;
const updateStatus = async (id, status, connection) => {
    const sql = `UPDATE drivers SET status = ? WHERE id = ?`;
    return (0, base_repository_1.execute)(sql, [status, id], connection);
};
exports.updateStatus = updateStatus;
