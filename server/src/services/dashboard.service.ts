import * as dashboardRepo from '../repositories/dashboard.repository';

export const getDashboardData = async () => {
  const [
    fleetSummary,
    driverSummary,
    tripSummary,
    maintenanceSummary,
    fuelSummary,
    expenseSummary,
    recentTrips
  ] = await Promise.all([
    dashboardRepo.getFleetSummary(),
    dashboardRepo.getDriverSummary(),
    dashboardRepo.getTripSummary(),
    dashboardRepo.getMaintenanceSummary(),
    dashboardRepo.getFuelSummary(),
    dashboardRepo.getExpenseSummary(),
    dashboardRepo.getRecentTrips()
  ]);

  const mapToNumbers = (row: any) => {
    if (!row) return {};
    const result: any = {};
    for (const key in row) {
      result[key] = Number(row[key]);
    }
    return result;
  };

  return {
    fleetSummary: mapToNumbers(fleetSummary),
    driverSummary: mapToNumbers(driverSummary),
    tripSummary: mapToNumbers(tripSummary),
    maintenanceSummary: mapToNumbers(maintenanceSummary),
    fuelSummary: mapToNumbers(fuelSummary),
    expenseSummary: mapToNumbers(expenseSummary),
    recentTrips
  };
};
