"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentTrips = exports.getExpenseSummary = exports.getFuelSummary = exports.getMaintenanceSummary = exports.getTripSummary = exports.getDriverSummary = exports.getFleetSummary = void 0;
const base_repository_1 = require("./base.repository");
const getFleetSummary = async () => {
    const sql = `
    SELECT
      COUNT(*) as total_vehicles,
      COALESCE(SUM(CASE WHEN status = 'Available' THEN 1 ELSE 0 END), 0) as available_vehicles,
      COALESCE(SUM(CASE WHEN status = 'On Trip' THEN 1 ELSE 0 END), 0) as on_trip_vehicles,
      COALESCE(SUM(CASE WHEN status = 'In Shop' THEN 1 ELSE 0 END), 0) as in_shop_vehicles,
      COALESCE(SUM(CASE WHEN status = 'Retired' THEN 1 ELSE 0 END), 0) as retired_vehicles
    FROM vehicles
  `;
    return (0, base_repository_1.queryOne)(sql);
};
exports.getFleetSummary = getFleetSummary;
const getDriverSummary = async () => {
    const sql = `
    SELECT
      COUNT(*) as total_drivers,
      COALESCE(SUM(CASE WHEN status = 'Available' THEN 1 ELSE 0 END), 0) as available_drivers,
      COALESCE(SUM(CASE WHEN status = 'On Trip' THEN 1 ELSE 0 END), 0) as on_trip_drivers,
      COALESCE(SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END), 0) as inactive_drivers
    FROM drivers
  `;
    return (0, base_repository_1.queryOne)(sql);
};
exports.getDriverSummary = getDriverSummary;
const getTripSummary = async () => {
    const sql = `
    SELECT
      COUNT(*) as total_trips,
      COALESCE(SUM(CASE WHEN status = 'Draft' THEN 1 ELSE 0 END), 0) as draft_trips,
      COALESCE(SUM(CASE WHEN status = 'Dispatched' THEN 1 ELSE 0 END), 0) as dispatched_trips,
      COALESCE(SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END), 0) as completed_trips,
      COALESCE(SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END), 0) as cancelled_trips
    FROM trips
  `;
    return (0, base_repository_1.queryOne)(sql);
};
exports.getTripSummary = getTripSummary;
const getMaintenanceSummary = async () => {
    const sql = `
    SELECT
      COALESCE(SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END), 0) as open_maintenance,
      COALESCE(SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END), 0) as closed_maintenance
    FROM maintenance_logs
  `;
    return (0, base_repository_1.queryOne)(sql);
};
exports.getMaintenanceSummary = getMaintenanceSummary;
const getFuelSummary = async () => {
    const sql = `
    SELECT
      COUNT(*) as total_fuel_records,
      COALESCE(SUM(liters), 0) as total_fuel_liters,
      COALESCE(SUM(cost), 0) as total_fuel_cost
    FROM fuel_logs
  `;
    return (0, base_repository_1.queryOne)(sql);
};
exports.getFuelSummary = getFuelSummary;
const getExpenseSummary = async () => {
    const sql = `
    SELECT
      COUNT(*) as total_expenses,
      COALESCE(SUM(amount), 0) as total_expense_amount
    FROM expenses
  `;
    return (0, base_repository_1.queryOne)(sql);
};
exports.getExpenseSummary = getExpenseSummary;
const getRecentTrips = async () => {
    const sql = `
    SELECT
      t.id as trip_id,
      t.origin,
      t.destination,
      CONCAT(d.first_name, ' ', d.last_name) as driver_full_name,
      v.registration_number,
      t.status,
      t.created_at
    FROM trips t
    JOIN drivers d ON t.driver_id = d.id
    JOIN vehicles v ON t.vehicle_id = v.id
    ORDER BY t.created_at DESC
    LIMIT 5
  `;
    return (0, base_repository_1.query)(sql);
};
exports.getRecentTrips = getRecentTrips;
