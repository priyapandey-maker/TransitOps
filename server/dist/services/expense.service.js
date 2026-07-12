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
exports.getExpense = exports.listExpenses = exports.createExpense = void 0;
const expenseRepo = __importStar(require("../repositories/expense.repository"));
const vehicleRepo = __importStar(require("../repositories/vehicle.repository"));
const tripRepo = __importStar(require("../repositories/trip.repository"));
const errors_1 = require("../utils/errors");
const createExpense = async (data) => {
    if (data.vehicle_id) {
        const vehicle = await vehicleRepo.findById(data.vehicle_id);
        if (!vehicle)
            throw new errors_1.NotFoundError('Vehicle not found');
    }
    if (data.trip_id) {
        const trip = await tripRepo.findById(data.trip_id);
        if (!trip)
            throw new errors_1.NotFoundError('Trip not found');
    }
    const result = await expenseRepo.create(data);
    return { id: result.insertId, ...data };
};
exports.createExpense = createExpense;
const listExpenses = async (limit, offset) => {
    return expenseRepo.findAll(limit, offset);
};
exports.listExpenses = listExpenses;
const getExpense = async (id) => {
    const exp = await expenseRepo.findById(id);
    if (!exp)
        throw new errors_1.NotFoundError('Expense not found');
    return exp;
};
exports.getExpense = getExpense;
