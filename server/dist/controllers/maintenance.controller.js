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
exports.closeMaintenance = exports.findById = exports.findAll = exports.create = void 0;
const maintService = __importStar(require("../services/maintenance.service"));
const response_1 = require("../utils/response");
const sql_1 = require("../utils/sql");
const create = async (req, res, next) => {
    try {
        const data = {
            ...req.body,
            created_by: req.user?.userId
        };
        const result = await maintService.createMaintenance(data);
        return (0, response_1.sendSuccess)(res, 201, 'Maintenance record created successfully', result);
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const findAll = async (req, res, next) => {
    try {
        const { limit, offset } = (0, sql_1.getPagination)(req.query);
        const result = await maintService.listMaintenance(limit, offset);
        return (0, response_1.sendSuccess)(res, 200, 'Maintenance records retrieved successfully', result);
    }
    catch (error) {
        next(error);
    }
};
exports.findAll = findAll;
const findById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await maintService.getMaintenance(id);
        return (0, response_1.sendSuccess)(res, 200, 'Maintenance record retrieved successfully', result);
    }
    catch (error) {
        next(error);
    }
};
exports.findById = findById;
const closeMaintenance = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await maintService.closeMaintenance(id);
        return (0, response_1.sendSuccess)(res, 200, 'Maintenance record closed successfully', result);
    }
    catch (error) {
        next(error);
    }
};
exports.closeMaintenance = closeMaintenance;
