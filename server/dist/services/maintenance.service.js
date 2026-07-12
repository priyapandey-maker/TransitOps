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
exports.closeMaintenance = exports.getMaintenance = exports.listMaintenance = exports.createMaintenance = void 0;
const maintRepo = __importStar(require("../repositories/maintenance.repository"));
const vehicleRepo = __importStar(require("../repositories/vehicle.repository"));
const base_repository_1 = require("../repositories/base.repository");
const errors_1 = require("../utils/errors");
const createMaintenance = async (data) => {
    return (0, base_repository_1.executeTransaction)(async (conn) => {
        const vehicle = await vehicleRepo.findById(data.vehicle_id);
        if (!vehicle)
            throw new errors_1.NotFoundError('Vehicle not found');
        const openRecord = await maintRepo.findOpenByVehicleId(data.vehicle_id);
        if (openRecord)
            throw new errors_1.ConflictError('Vehicle already has an OPEN maintenance record');
        data.status = 'Open';
        const result = await maintRepo.create(data, conn);
        await vehicleRepo.updateStatus(data.vehicle_id, 'In Shop', conn);
        return { id: result.insertId, ...data };
    });
};
exports.createMaintenance = createMaintenance;
const listMaintenance = async (limit, offset) => {
    return maintRepo.findAll(limit, offset);
};
exports.listMaintenance = listMaintenance;
const getMaintenance = async (id) => {
    const maint = await maintRepo.findById(id);
    if (!maint)
        throw new errors_1.NotFoundError('Maintenance record not found');
    return maint;
};
exports.getMaintenance = getMaintenance;
const closeMaintenance = async (id) => {
    return (0, base_repository_1.executeTransaction)(async (conn) => {
        const maint = await maintRepo.findById(id);
        if (!maint)
            throw new errors_1.NotFoundError('Maintenance record not found');
        if (maint.status !== 'Open')
            throw new errors_1.BadRequestError('Maintenance record is not Open');
        const today = new Date().toISOString().split('T')[0];
        await maintRepo.updateStatusAndEndDate(id, 'Closed', today, conn);
        await vehicleRepo.updateStatus(maint.vehicle_id, 'Available', conn);
        return { id, status: 'Closed', end_date: today };
    });
};
exports.closeMaintenance = closeMaintenance;
