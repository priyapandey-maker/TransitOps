import apiClient, { handleApiError } from './api';
import type { ApiResponse } from '../types/api.types';

export interface DashboardData {
  fleetSummary: {
    total_vehicles: number;
    available_vehicles: number;
    on_trip_vehicles: number;
    in_shop_vehicles: number;
    retired_vehicles: number;
  };
  driverSummary: {
    total_drivers: number;
    available_drivers: number;
    on_trip_drivers: number;
    inactive_drivers: number;
  };
  tripSummary: {
    total_trips: number;
    draft_trips: number;
    dispatched_trips: number;
    completed_trips: number;
    cancelled_trips: number;
  };
  maintenanceSummary: {
    open_maintenance: number;
    closed_maintenance: number;
  };
  fuelSummary: {
    total_fuel_records: number;
    total_fuel_liters: number;
    total_fuel_cost: number;
  };
  expenseSummary: {
    total_expenses: number;
    total_expense_amount: number;
  };
  recentTrips: Array<{
    trip_id: number;
    origin: string;
    destination: string;
    driver_full_name: string;
    registration_number: string;
    status: string;
    created_at: string;
  }>;
}

export async function getDashboardData(): Promise<ApiResponse<DashboardData>> {
  try {
    const response = await apiClient.get<ApiResponse<DashboardData>>('/dashboard');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
