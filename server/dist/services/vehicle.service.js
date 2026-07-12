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
exports.updateStatus = exports.updateVehicle = exports.getVehicle = exports.listVehicles = exports.createVehicle = void 0;
const vehicleRepo = __importStar(require("../repositories/vehicle.repository"));
const errors_1 = require("../utils/errors");
const createVehicle = async (data) => {
    const existing = await vehicleRepo.findByRegistration(data.registration_number);
    if (existing) {
        throw new errors_1.ConflictError(`Vehicle with registration ${data.registration_number} already exists`);
    }
    const result = await vehicleRepo.create(data);
    return { id: result.insertId, ...data };
};
exports.createVehicle = createVehicle;
const listVehicles = async (limit, offset) => {
    const vehicles = await vehicleRepo.findAll(limit, offset);
    return vehicles;
};
exports.listVehicles = listVehicles;
const getVehicle = async (id) => {
    const vehicle = await vehicleRepo.findById(id);
    if (!vehicle) {
        throw new errors_1.NotFoundError(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
};
exports.getVehicle = getVehicle;
const updateVehicle = async (id, data) => {
    const vehicle = await vehicleRepo.findById(id);
    if (!vehicle) {
        throw new errors_1.NotFoundError(`Vehicle with ID ${id} not found`);
    }
    if (data.registration_number !== vehicle.registration_number) {
        const existing = await vehicleRepo.findByRegistration(data.registration_number);
        if (existing) {
            throw new errors_1.ConflictError(`Vehicle with registration ${data.registration_number} already exists`);
        }
    }
    await vehicleRepo.update(id, data);
    return { id, ...data };
};
exports.updateVehicle = updateVehicle;
const updateStatus = async (id, status) => {
    const vehicle = await vehicleRepo.findById(id);
    if (!vehicle) {
        throw new errors_1.NotFoundError(`Vehicle with ID ${id} not found`);
    }
    await vehicleRepo.updateStatus(id, status);
    return { id, status };
};
exports.updateStatus = updateStatus;
