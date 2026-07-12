"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDbConnection = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const env_1 = require("./env");
const pool = promise_1.default.createPool({
    host: env_1.env.DB_HOST,
    user: env_1.env.DB_USER,
    password: env_1.env.DB_PASSWORD,
    database: env_1.env.DB_NAME,
    port: env_1.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
const checkDbConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('[Database] MySQL connection established successfully');
        connection.release();
    }
    catch (error) {
        console.error('[Database] MySQL connection failed:', error);
    }
};
exports.checkDbConnection = checkDbConnection;
exports.default = pool;
