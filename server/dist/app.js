"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const error_middleware_1 = require("./middleware/error.middleware");
const notFound_middleware_1 = require("./middleware/notFound.middleware");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const vehicle_routes_1 = __importDefault(require("./routes/vehicle.routes"));
const driver_routes_1 = __importDefault(require("./routes/driver.routes"));
const trip_routes_1 = __importDefault(require("./routes/trip.routes"));
const maintenance_routes_1 = __importDefault(require("./routes/maintenance.routes"));
const fuel_routes_1 = __importDefault(require("./routes/fuel.routes"));
const expense_routes_1 = __importDefault(require("./routes/expense.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Health Endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'TransitOps Backend Running',
    });
});
// Mount Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/vehicles', vehicle_routes_1.default);
app.use('/api/drivers', driver_routes_1.default);
app.use('/api/trips', trip_routes_1.default);
app.use('/api/maintenance', maintenance_routes_1.default);
app.use('/api/fuel', fuel_routes_1.default);
app.use('/api/expenses', expense_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
// Fallback Middlewares
app.use(notFound_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
exports.default = app;
