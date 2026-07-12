import apiClient, { handleApiError } from './api';
import type { ApiResponse } from '../types/api.types';
import type { Driver, DriverFormData } from '../types/driver.types';

const USE_MOCK = true;

// Reusable mock database in localStorage or memory
let mockDrivers: Driver[] = [
  {
    id: 1,
    name: 'John Doe',
    license_number: 'DL-1234567890123',
    license_category: 'C',
    license_expiry: '2028-12-31',
    contact_number: '+91 98765 43210',
    safety_score: 95,
    status: 'Available',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Robert Smith',
    license_number: 'KA-9876543210987',
    license_category: 'D',
    license_expiry: '2027-06-30',
    contact_number: '+91 91234 56789',
    safety_score: 88,
    status: 'On Trip',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'David Miller',
    license_number: 'MH-5555555555555',
    license_category: 'E',
    license_expiry: '2029-01-15',
    contact_number: '+91 95555 55555',
    safety_score: 76,
    status: 'Off Duty',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'James Wilson',
    license_number: 'DL-9999999999999',
    license_category: 'B',
    license_expiry: '2028-09-09',
    contact_number: '+91 99999 99999',
    safety_score: 42,
    status: 'Suspended',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getDrivers(params?: {
  search?: string;
  status?: string;
}): Promise<ApiResponse<Driver[]>> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockDrivers];
        if (params?.search) {
          const query = params.search.toLowerCase();
          filtered = filtered.filter(
            (d) =>
              d.name.toLowerCase().includes(query) ||
              d.license_number.toLowerCase().includes(query)
          );
        }
        if (params?.status) {
          filtered = filtered.filter((d) => d.status === params.status);
        }
        resolve({
          success: true,
          message: 'Drivers retrieved successfully.',
          data: filtered,
        });
      }, 500);
    });
  }

  try {
    const response = await apiClient.get<ApiResponse<Driver[]>>('/drivers', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createDriver(data: DriverFormData): Promise<ApiResponse<Driver>> {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const exists = mockDrivers.some(
          (d) => d.license_number.toLowerCase() === data.license_number.toLowerCase()
        );
        if (exists) {
          reject({
            message: 'Driver license number already exists.',
          });
          return;
        }

        const newDriver: Driver = {
          ...data,
          id: mockDrivers.length > 0 ? Math.max(...mockDrivers.map((d) => d.id)) + 1 : 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockDrivers.unshift(newDriver);
        resolve({
          success: true,
          message: 'Driver created successfully.',
          data: newDriver,
        });
      }, 600);
    });
  }

  try {
    const response = await apiClient.post<ApiResponse<Driver>>('/drivers', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateDriver(id: number, data: DriverFormData): Promise<ApiResponse<Driver>> {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockDrivers.findIndex((d) => d.id === id);
        if (index === -1) {
          reject({ message: 'Driver not found.' });
          return;
        }

        const duplicate = mockDrivers.some(
          (d) => d.id !== id && d.license_number.toLowerCase() === data.license_number.toLowerCase()
        );
        if (duplicate) {
          reject({ message: 'Driver license number already exists.' });
          return;
        }

        const updated: Driver = {
          ...mockDrivers[index]!,
          ...data,
          updated_at: new Date().toISOString(),
        };
        mockDrivers[index] = updated;
        resolve({
          success: true,
          message: 'Driver updated successfully.',
          data: updated,
        });
      }, 600);
    });
  }

  try {
    const response = await apiClient.put<ApiResponse<Driver>>(`/drivers/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function deleteDriver(id: number): Promise<ApiResponse<null>> {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockDrivers.findIndex((d) => d.id === id);
        if (index === -1) {
          reject({ message: 'Driver not found.' });
          return;
        }

        // Soft delete: update status to Suspended or retired (Suspended matches driver enum)
        mockDrivers[index]!.status = 'Suspended';
        mockDrivers[index]!.updated_at = new Date().toISOString();

        resolve({
          success: true,
          message: 'Driver suspended/deactivated successfully.',
          data: null,
        });
      }, 500);
    });
  }

  try {
    const response = await apiClient.delete<ApiResponse<null>>(`/drivers/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
