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
exports.cancelTrip = exports.completeTrip = exports.dispatchTrip = exports.getTrip = exports.listTrips = exports.createTrip = void 0;
const tripRepo = __importStar(require("../repositories/trip.repository"));
const vehicleRepo = __importStar(require("../repositories/vehicle.repository"));
const driverRepo = __importStar(require("../repositories/driver.repository"));
const base_repository_1 = require("../repositories/base.repository");
const errors_1 = require("../utils/errors");
const createTrip = async (data) => {
    const vehicle = await vehicleRepo.findById(data.vehicle_id);
    if (!vehicle)
        throw new errors_1.NotFoundError('Vehicle not found');
    if (vehicle.status !== 'Available')
        throw new errors_1.BadRequestError('Vehicle is not available');
    const driver = await driverRepo.findById(data.driver_id);
    if (!driver)
        throw new errors_1.NotFoundError('Driver not found');
    if (driver.status !== 'Available')
        throw new errors_1.BadRequestError('Driver is not available');
    data.status = 'Draft';
    const result = await tripRepo.create(data);
    return { id: result.insertId, ...data };
};
exports.createTrip = createTrip;
const listTrips = async (limit, offset) => {
    return tripRepo.findAll(limit, offset);
};
exports.listTrips = listTrips;
const getTrip = async (id) => {
    const trip = await tripRepo.findById(id);
    if (!trip)
        throw new errors_1.NotFoundError('Trip not found');
    return trip;
};
exports.getTrip = getTrip;
const dispatchTrip = async (id, userId) => {
    return (0, base_repository_1.executeTransaction)(async (conn) => {
        const trip = await tripRepo.findById(id);
        if (!trip)
            throw new errors_1.NotFoundError('Trip not found');
        if (trip.status !== 'Draft')
            throw new errors_1.BadRequestError('Only Draft trips can be dispatched');
        const vehicle = await vehicleRepo.findById(trip.vehicle_id);
        if (!vehicle || vehicle.status !== 'Available')
            throw new errors_1.BadRequestError('Vehicle is not available for dispatch');
        const driver = await driverRepo.findById(trip.driver_id);
        if (!driver || driver.status !== 'Available')
            throw new errors_1.BadRequestError('Driver is not available for dispatch');
        await tripRepo.updateStatus(id, 'Dispatched', conn);
        await vehicleRepo.updateStatus(trip.vehicle_id, 'On Trip', conn);
        await driverRepo.updateStatus(trip.driver_id, 'On Trip', conn);
        await tripRepo.insertHistory(id, 'Draft', 'Dispatched', userId, conn);
        return { id, status: 'Dispatched' };
    });
};
exports.dispatchTrip = dispatchTrip;
const completeTrip = async (id, userId) => {
    return (0, base_repository_1.executeTransaction)(async (conn) => {
        const trip = await tripRepo.findById(id);
        if (!trip)
            throw new errors_1.NotFoundError('Trip not found');
        if (trip.status !== 'Dispatched')
            throw new errors_1.BadRequestError('Only Dispatched trips can be completed');
        await tripRepo.updateStatus(id, 'Completed', conn);
        await vehicleRepo.updateStatus(trip.vehicle_id, 'Available', conn);
        await driverRepo.updateStatus(trip.driver_id, 'Available', conn);
        await tripRepo.insertHistory(id, 'Dispatched', 'Completed', userId, conn);
        return { id, status: 'Completed' };
    });
};
exports.completeTrip = completeTrip;
const cancelTrip = async (id, userId) => {
    return (0, base_repository_1.executeTransaction)(async (conn) => {
        const trip = await tripRepo.findById(id);
        if (!trip)
            throw new errors_1.NotFoundError('Trip not found');
        if (trip.status !== 'Draft' && trip.status !== 'Dispatched') {
            throw new errors_1.BadRequestError('Only Draft or Dispatched trips can be cancelled');
        }
        await tripRepo.updateStatus(id, 'Cancelled', conn);
        await vehicleRepo.updateStatus(trip.vehicle_id, 'Available', conn);
        await driverRepo.updateStatus(trip.driver_id, 'Available', conn);
        await tripRepo.insertHistory(id, trip.status, 'Cancelled', userId, conn);
        return { id, status: 'Cancelled' };
    });
};
exports.cancelTrip = cancelTrip;
