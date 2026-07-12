import apiClient, { handleApiError } from './api';
import type { ApiResponse } from '../types/api.types';

// TODO: The backend does not yet provide a /dashboard/analytics endpoint. 
// Keep this mock active until the backend implements it to prevent the UI from breaking.
const USE_MOCK = true;

export interface VehiclePerformance {
  id: number;
  vehicle_name: string;
  registration_number: string;
  vehicle_type: string;
  trips_completed: number;
  total_revenue: number;
  total_expenses: number;
  net_roi: number; // ROI percentage
  fuel_efficiency: number; // km/L
}

export interface AnalyticsReport {
  fleet_utilization: number;
  operational_cost: number;
  fuel_efficiency: number;
  average_roi: number;
  top_vehicles: VehiclePerformance[];
  monthly_costs: { month: string; spend: number }[];
  trip_completion: { status: string; count: number; color: string }[];
  maintenance_costs: { category: string; spend: number; color: string }[];
}

const mockReport: AnalyticsReport = {
  fleet_utilization: 76,
  operational_cost: 1240000,
  fuel_efficiency: 14.2,
  average_roi: 142,
  top_vehicles: [
    { id: 1, vehicle_name: 'Tata Signa 4018.S', registration_number: 'MH-12-AB-1234', vehicle_type: 'Truck', trips_completed: 48, total_revenue: 1540000, total_expenses: 642000, net_roi: 240, fuel_efficiency: 12.8 },
    { id: 2, vehicle_name: 'Eicher Pro 2049', registration_number: 'DL-01-CP-9012', vehicle_type: 'Truck', trips_completed: 32, total_revenue: 980000, total_expenses: 410000, net_roi: 239, fuel_efficiency: 14.5 },
    { id: 3, vehicle_name: 'Mahindra Bolero Maxi Truck', registration_number: 'KA-03-XY-5678', vehicle_type: 'Van', trips_completed: 24, total_revenue: 650000, total_expenses: 280000, net_roi: 232, fuel_efficiency: 16.2 },
    { id: 4, vehicle_name: 'Maruti Suzuki Super Carry', registration_number: 'MH-14-CC-4321', vehicle_type: 'Van', trips_completed: 18, total_revenue: 410000, total_expenses: 195000, net_roi: 210, fuel_efficiency: 18.0 }
  ],
  monthly_costs: [
    { month: 'Jan 2026', spend: 980000 },
    { month: 'Feb 2026', spend: 1050000 },
    { month: 'Mar 2026', spend: 920000 },
    { month: 'Apr 2026', spend: 1100000 },
    { month: 'May 2026', spend: 1180000 },
    { month: 'Jun 2026', spend: 1150000 },
    { month: 'Jul 2026', spend: 1240000 }
  ],
  trip_completion: [
    { status: 'Completed', count: 124, color: 'bg-green-500' },
    { status: 'In Progress', count: 12, color: 'bg-blue-500' },
    { status: 'Delayed', count: 6, color: 'bg-amber-500' },
    { status: 'Cancelled', count: 3, color: 'bg-red-500' }
  ],
  maintenance_costs: [
    { category: 'Engine overhaul', spend: 85000, color: 'bg-indigo-500' },
    { category: 'Brake pads & rotors', spend: 42000, color: 'bg-orange-500' },
    { category: 'Tire replacement & balancing', spend: 38000, color: 'bg-blue-500' },
    { category: 'Transmission fluid service', spend: 20000, color: 'bg-teal-500' }
  ]
};

export async function getAnalyticsReport(): Promise<ApiResponse<AnalyticsReport>> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Analytics data retrieved successfully.',
          data: mockReport
        });
      }, 600);
    });
  }

  try {
    // Fallback to dashboard API if analytics route isn't mounted separately
    const response = await apiClient.get<ApiResponse<AnalyticsReport>>('/dashboard/analytics');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
