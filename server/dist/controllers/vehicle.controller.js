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
exports.updateStatus = exports.update = exports.findById = exports.findAll = exports.create = void 0;
const vehicleService = __importStar(require("../services/vehicle.service"));
const response_1 = require("../utils/response");
const sql_1 = require("../utils/sql");
const create = async (req, res, next) => {
    try {
        const result = await vehicleService.createVehicle(req.body);
        return (0, response_1.sendSuccess)(res, 201, 'Vehicle created successfully', result);
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const findAll = async (req, res, next) => {
    try {
        const { limit, offset } = (0, sql_1.getPagination)(req.query);
        const result = await vehicleService.listVehicles(limit, offset);
        return (0, response_1.sendSuccess)(res, 200, 'Vehicles retrieved successfully', result);
    }
    catch (error) {
        next(error);
    }
};
exports.findAll = findAll;
const findById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await vehicleService.getVehicle(id);
        return (0, response_1.sendSuccess)(res, 200, 'Vehicle retrieved successfully', result);
    }
    catch (error) {
        next(error);
    }
};
exports.findById = findById;
const update = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await vehicleService.updateVehicle(id, req.body);
        return (0, response_1.sendSuccess)(res, 200, 'Vehicle updated successfully', result);
    }
    catch (error) {
        next(error);
    }
};
exports.update = update;
const updateStatus = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { status } = req.body;
        const result = await vehicleService.updateStatus(id, status);
        return (0, response_1.sendSuccess)(res, 200, 'Vehicle status updated successfully', result);
    }
    catch (error) {
        next(error);
    }
};
exports.updateStatus = updateStatus;
