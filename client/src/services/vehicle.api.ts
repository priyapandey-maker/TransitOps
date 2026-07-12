import apiClient, { handleApiError } from './api';
import type { ApiResponse } from '../types/api.types';
import type { Vehicle, VehicleFormData } from '../types/vehicle.types';

const USE_MOCK = true;

// Reusable mock database in localStorage or memory
let mockVehicles: Vehicle[] = [
  {
    id: 1,
    registration_number: 'MH-12-AB-1234',
    vehicle_name: 'Tata Signa 4018.S',
    vehicle_type: 'Truck',
    max_load_capacity: 40,
    odometer: 12500,
    acquisition_cost: 3200000,
    status: 'Available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    registration_number: 'KA-03-XY-5678',
    vehicle_name: 'Mahindra Bolero Maxi Truck',
    vehicle_type: 'Van',
    max_load_capacity: 2,
    odometer: 8300,
    acquisition_cost: 850000,
    status: 'On Trip',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    registration_number: 'DL-01-CP-9012',
    vehicle_name: 'Eicher Pro 2049',
    vehicle_type: 'Truck',
    max_load_capacity: 3.5,
    odometer: 24000,
    acquisition_cost: 1500000,
    status: 'In Shop',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    registration_number: 'MH-14-CC-4321',
    vehicle_name: 'Maruti Suzuki Super Carry',
    vehicle_type: 'Van',
    max_load_capacity: 0.74,
    odometer: 45000,
    acquisition_cost: 550000,
    status: 'Retired',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getVehicles(params?: {
  search?: string;
  status?: string;
}): Promise<ApiResponse<Vehicle[]>> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockVehicles];
        if (params?.search) {
          const query = params.search.toLowerCase();
          filtered = filtered.filter(
            (v) =>
              v.registration_number.toLowerCase().includes(query) ||
              v.vehicle_name.toLowerCase().includes(query)
          );
        }
        if (params?.status) {
          filtered = filtered.filter((v) => v.status === params.status);
        }
        resolve({
          success: true,
          message: 'Vehicles retrieved successfully.',
          data: filtered,
        });
      }, 500);
    });
  }

  try {
    const response = await apiClient.get<ApiResponse<Vehicle[]>>('/vehicles', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createVehicle(data: VehicleFormData): Promise<ApiResponse<Vehicle>> {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const exists = mockVehicles.some(
          (v) => v.registration_number.toLowerCase() === data.registration_number.toLowerCase()
        );
        if (exists) {
          reject({
            message: 'Vehicle registration number already exists.',
          });
          return;
        }

        const newVehicle: Vehicle = {
          ...data,
          id: mockVehicles.length > 0 ? Math.max(...mockVehicles.map((v) => v.id)) + 1 : 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockVehicles.unshift(newVehicle);
        resolve({
          success: true,
          message: 'Vehicle created successfully.',
          data: newVehicle,
        });
      }, 600);
    });
  }

  try {
    const response = await apiClient.post<ApiResponse<Vehicle>>('/vehicles', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateVehicle(id: number, data: VehicleFormData): Promise<ApiResponse<Vehicle>> {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockVehicles.findIndex((v) => v.id === id);
        if (index === -1) {
          reject({ message: 'Vehicle not found.' });
          return;
        }

        const duplicate = mockVehicles.some(
          (v) => v.id !== id && v.registration_number.toLowerCase() === data.registration_number.toLowerCase()
        );
        if (duplicate) {
          reject({ message: 'Vehicle registration number already exists.' });
          return;
        }

        const updated: Vehicle = {
          ...mockVehicles[index]!,
          ...data,
          updated_at: new Date().toISOString(),
        };
        mockVehicles[index] = updated;
        resolve({
          success: true,
          message: 'Vehicle updated successfully.',
          data: updated,
        });
      }, 600);
    });
  }

  try {
    const response = await apiClient.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function deleteVehicle(id: number): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockVehicles.findIndex((v) => v.id === id);
        if (index === -1) {
          reject({ message: 'Vehicle not found.' });
          return;
        }

        // Soft delete: update status to Retired
        mockVehicles[index]!.status = 'Retired';
        mockVehicles[index]!.updated_at = new Date().toISOString();
        
        resolve({
          success: true,
          message: 'Vehicle retired successfully.',
          data: null,
        });
      }, 500);
    });
  }

  try {
    const response = await apiClient.delete<ApiResponse<null>>(`/vehicles/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
