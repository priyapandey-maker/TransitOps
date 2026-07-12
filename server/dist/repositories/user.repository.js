"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findById = exports.findByEmail = void 0;
const base_repository_1 = require("./base.repository");
const findByEmail = async (email) => {
    const sql = `
    SELECT u.*, r.name as role_name 
    FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE u.email = ?
  `;
    return (0, base_repository_1.queryOne)(sql, [email]);
};
exports.findByEmail = findByEmail;
const findById = async (id) => {
    const sql = `
    SELECT u.*, r.name as role_name 
    FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE u.id = ?
  `;
    return (0, base_repository_1.queryOne)(sql, [id]);
};
exports.findById = findById;
