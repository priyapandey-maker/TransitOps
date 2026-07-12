"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.updateDriver = exports.getDriver = exports.listDrivers = exports.createDriver = void 0;
const driverRepo = __importStar(require("../repositories/driver.repository"));
const errors_1 = require("../utils/errors");
const createDriver = async (data) => {
    const existingLicense = await driverRepo.findByLicense(data.license_number);
    if (existingLicense) {
        throw new errors_1.ConflictError(`Driver with license ${data.license_number} already exists`);
    }
    const existingPhone = await driverRepo.findByPhone(data.phone);
    if (existingPhone) {
        throw new errors_1.ConflictError(`Driver with phone ${data.phone} already exists`);
    }
    const result = await driverRepo.create(data);
    return { id: result.insertId, ...data };
};
exports.createDriver = createDriver;
const listDrivers = async (limit, offset) => {
    const drivers = await driverRepo.findAll(limit, offset);
    return drivers;
};
exports.listDrivers = listDrivers;
const getDriver = async (id) => {
    const driver = await driverRepo.findById(id);
    if (!driver) {
        throw new errors_1.NotFoundError(`Driver with ID ${id} not found`);
    }
    return driver;
};
exports.getDriver = getDriver;
const updateDriver = async (id, data) => {
    const driver = await driverRepo.findById(id);
    if (!driver) {
        throw new errors_1.NotFoundError(`Driver with ID ${id} not found`);
    }
    if (data.license_number !== driver.license_number) {
        const existing = await driverRepo.findByLicense(data.license_number);
        if (existing) {
            throw new errors_1.ConflictError(`Driver with license ${data.license_number} already exists`);
        }
    }
    if (data.phone !== driver.phone) {
        const existing = await driverRepo.findByPhone(data.phone);
        if (existing) {
            throw new errors_1.ConflictError(`Driver with phone ${data.phone} already exists`);
        }
    }
    await driverRepo.update(id, data);
    return { id, ...data };
};
exports.updateDriver = updateDriver;
const updateStatus = async (id, status) => {
    const driver = await driverRepo.findById(id);
    if (!driver) {
        throw new errors_1.NotFoundError(`Driver with ID ${id} not found`);
    }
    await driverRepo.updateStatus(id, status);
    return { id, status };
};
exports.updateStatus = updateStatus;
