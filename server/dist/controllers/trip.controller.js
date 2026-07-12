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
exports.cancelTrip = exports.completeTrip = exports.dispatchTrip = exports.findById = exports.findAll = exports.create = void 0;
const tripService = __importStar(require("../services/trip.service"));
const response_1 = require("../utils/response");
const sql_1 = require("../utils/sql");
const create = async (req, res, next) => {
    try {
        const tripData = {
            ...req.body,
            created_by: req.user?.userId // from authenticate middleware
        };
        const result = await tripService.createTrip(tripData);
        return (0, response_1.sendSuccess)(res, 201, 'Trip created successfully', result);
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const findAll = async (req, res, next) => {
    try {
        const { limit, offset } = (0, sql_1.getPagination)(req.query);
        const result = await tripService.listTrips(limit, offset);
        return (0, response_1.sendSuccess)(res, 200, 'Trips retrieved successfully', result);
    }
    catch (error) {
        next(error);
    }
};
exports.findAll = findAll;
const findById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await tripService.getTrip(id);
        return (0, response_1.sendSuccess)(res, 200, 'Trip retrieved successfully', result);
    }
    catch (error) {
        next(error);
    }
};
exports.findById = findById;
const dispatchTrip = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const userId = req.user?.userId;
        const result = await tripService.dispatchTrip(id, userId);
        return (0, response_1.sendSuccess)(res, 200, 'Trip dispatched successfully', result);
    }
    catch (error) {
        next(error);
    }
};
exports.dispatchTrip = dispatchTrip;
const completeTrip = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const userId = req.user?.userId;
        const result = await tripService.completeTrip(id, userId);
        return (0, response_1.sendSuccess)(res, 200, 'Trip completed successfully', result);
    }
    catch (error) {
        next(error);
    }
};
exports.completeTrip = completeTrip;
const cancelTrip = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const userId = req.user?.userId;
        const result = await tripService.cancelTrip(id, userId);
        return (0, response_1.sendSuccess)(res, 200, 'Trip cancelled successfully', result);
    }
    catch (error) {
        next(error);
    }
};
exports.cancelTrip = cancelTrip;
