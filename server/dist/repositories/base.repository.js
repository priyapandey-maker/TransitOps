"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeTransaction = exports.execute = exports.queryOne = exports.query = void 0;
const db_1 = __importDefault(require("../config/db"));
const query = async (sql, params = [], connection) => {
    const db = connection || db_1.default;
    const [rows] = await db.execute(sql, params);
    return rows;
};
exports.query = query;
const queryOne = async (sql, params = [], connection) => {
    const rows = await (0, exports.query)(sql, params, connection);
    if (Array.isArray(rows) && rows.length > 0) {
        return rows[0];
    }
    return null;
};
exports.queryOne = queryOne;
const execute = async (sql, params = [], connection) => {
    const db = connection || db_1.default;
    const [result] = await db.execute(sql, params);
    return result;
};
exports.execute = execute;
const executeTransaction = async (callback) => {
    const connection = await db_1.default.getConnection();
    try {
        await connection.beginTransaction();
        const result = await callback(connection);
        await connection.commit();
        return result;
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
};
exports.executeTransaction = executeTransaction;
