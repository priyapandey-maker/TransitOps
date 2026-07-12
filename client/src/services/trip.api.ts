import apiClient, { handleApiError } from './api';
import type { ApiResponse } from '../types/api.types';
import type { Trip, TripFormData } from '../types/trip.types';

const USE_MOCK = false;

// Reusable mock database in memory
let mockTrips: Trip[] = [
  {
    id: 1,
    vehicle_id: 2,
    registration_number: 'KA-03-XY-5678',
    vehicle_name: 'Mahindra Bolero Maxi Truck',
    driver_id: 2,
    driver_name: 'Robert Smith',
    source: 'Warehouse A (Mumbai)',
    destination: 'Distribution Hub (Pune)',
    cargo_weight: 1.5,
    planned_distance: 150,
    status: 'Dispatched',
    dispatched_at: new Date(Date.now() - 3600000).toISOString(),
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2,
    vehicle_id: 1,
    registration_number: 'MH-12-AB-1234',
    vehicle_name: 'Tata Signa 4018.S',
    driver_id: 1,
    driver_name: 'John Doe',
    source: 'Port Terminal 1 (Chennai)',
    destination: 'City Logistics Depot (Bangalore)',
    cargo_weight: 18,
    planned_distance: 350,
    status: 'Draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getTrips(params?: {
  search?: string;
  status?: string;
}): Promise<ApiResponse<Trip[]>> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockTrips];
        if (params?.search) {
          const query = params.search.toLowerCase();
          filtered = filtered.filter(
            (t) =>
              t.source.toLowerCase().includes(query) ||
              t.destination.toLowerCase().includes(query) ||
              t.registration_number?.toLowerCase().includes(query) ||
              t.driver_name?.toLowerCase().includes(query)
          );
        }
        if (params?.status) {
          filtered = filtered.filter((t) => t.status === params.status);
        }
        resolve({
          success: true,
          message: 'Trips retrieved successfully.',
          data: filtered,
        });
      }, 500);
    });
  }

  try {
    const response = await apiClient.get<ApiResponse<Trip[]>>('/trips', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createTrip(data: TripFormData): Promise<ApiResponse<Trip>> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTrip: Trip = {
          ...data,
          id: mockTrips.length > 0 ? Math.max(...mockTrips.map((t) => t.id)) + 1 : 1,
          status: 'Draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockTrips.unshift(newTrip);
        resolve({
          success: true,
          message: 'Trip created as Draft successfully.',
          data: newTrip,
        });
      }, 600);
    });
  }

  try {
    const response = await apiClient.post<ApiResponse<Trip>>('/trips', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateTrip(id: number, data: TripFormData): Promise<ApiResponse<Trip>> {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockTrips.findIndex((t) => t.id === id);
        if (index === -1) {
          reject({ message: 'Trip not found.' });
          return;
        }

        if (mockTrips[index]!.status !== 'Draft') {
          reject({ message: 'Only Draft trips can be modified.' });
          return;
        }

        const updated: Trip = {
          ...mockTrips[index]!,
          ...data,
          updated_at: new Date().toISOString(),
        };
        mockTrips[index] = updated;
        resolve({
          success: true,
          message: 'Trip updated successfully.',
          data: updated,
        });
      }, 600);
    });
  }

  try {
    const response = await apiClient.put<ApiResponse<Trip>>(`/trips/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function dispatchTrip(id: number): Promise<ApiResponse<Trip>> {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockTrips.findIndex((t) => t.id === id);
        if (index === -1) {
          reject({ message: 'Trip not found.' });
          return;
        }

        const currentStatus = mockTrips[index]!.status;
        if (currentStatus !== 'Draft') {
          reject({ message: `Cannot dispatch trip in ${currentStatus} status.` });
          return;
        }

        mockTrips[index]!.status = 'Dispatched';
        mockTrips[index]!.dispatched_at = new Date().toISOString();
        mockTrips[index]!.updated_at = new Date().toISOString();

        resolve({
          success: true,
          message: 'Trip successfully dispatched.',
          data: mockTrips[index]!,
        });
      }, 500);
    });
  }

  try {
    const response = await apiClient.post<ApiResponse<Trip>>(`/trips/${id}/dispatch`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function completeTrip(
  id: number,
  closingData: { final_distance: number; fuel_consumed: number }
): Promise<ApiResponse<Trip>> {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockTrips.findIndex((t) => t.id === id);
        if (index === -1) {
          reject({ message: 'Trip not found.' });
          return;
        }

        const currentStatus = mockTrips[index]!.status;
        if (currentStatus !== 'Dispatched') {
          reject({ message: `Cannot complete trip in ${currentStatus} status.` });
          return;
        }

        mockTrips[index]!.status = 'Completed';
        mockTrips[index]!.final_distance = closingData.final_distance;
        mockTrips[index]!.fuel_consumed = closingData.fuel_consumed;
        mockTrips[index]!.completed_at = new Date().toISOString();
        mockTrips[index]!.updated_at = new Date().toISOString();

        resolve({
          success: true,
          message: 'Trip successfully completed.',
          data: mockTrips[index]!,
        });
      }, 500);
    });
  }

  try {
    const response = await apiClient.post<ApiResponse<Trip>>(`/trips/${id}/complete`, closingData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function cancelTrip(id: number): Promise<ApiResponse<Trip>> {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockTrips.findIndex((t) => t.id === id);
        if (index === -1) {
          reject({ message: 'Trip not found.' });
          return;
        }

        const currentStatus = mockTrips[index]!.status;
        if (currentStatus !== 'Draft' && currentStatus !== 'Dispatched') {
          reject({ message: `Cannot cancel trip in ${currentStatus} status.` });
          return;
        }

        mockTrips[index]!.status = 'Cancelled';
        mockTrips[index]!.updated_at = new Date().toISOString();

        resolve({
          success: true,
          message: 'Trip successfully cancelled.',
          data: mockTrips[index]!,
        });
      }, 500);
    });
  }

  try {
    const response = await apiClient.post<ApiResponse<Trip>>(`/trips/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
