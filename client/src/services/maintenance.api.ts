import apiClient, { handleApiError } from './api';
import type { ApiResponse } from '../types/api.types';
import type { Maintenance, MaintenanceFormData } from '../types/maintenance.types';

const USE_MOCK = false;

// Reusable mock database in memory
let mockMaintenances: Maintenance[] = [
  {
    id: 1,
    vehicle_id: 1,
    registration_number: 'MH-12-AB-1234',
    vehicle_name: 'Tata Signa 4018.S',
    maintenance_type: 'Routine Service',
    description: 'Engine oil replacement, oil filter swap, and brake line fluid inspection.',
    service_date: '2026-07-10',
    next_due_date: '2026-10-10',
    assigned_technician: 'Mike Anderson',
    cost: 4500,
    status: 'Completed',
    notes: 'Completed successfully. Brake pads were found in good condition.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 2,
    vehicle_id: 2,
    registration_number: 'KA-03-XY-5678',
    vehicle_name: 'Mahindra Bolero Maxi Truck',
    maintenance_type: 'Repair',
    description: 'Fixing radiator coolant leak and replacing air conditioning compressor belt.',
    service_date: new Date().toISOString().split('T')[0]!,
    assigned_technician: 'Sarah Connor',
    cost: 3200,
    status: 'In Progress',
    notes: 'Belt has been swapped, waiting for radiator pressure testing results.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getMaintenances(params?: {
  search?: string;
  status?: string;
  vehicle_id?: number;
}): Promise<ApiResponse<Maintenance[]>> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockMaintenances];
        if (params?.search) {
          const query = params.search.toLowerCase();
          filtered = filtered.filter(
            (m) =>
              m.description.toLowerCase().includes(query) ||
              m.assigned_technician.toLowerCase().includes(query) ||
              m.registration_number?.toLowerCase().includes(query)
          );
        }
        if (params?.status) {
          filtered = filtered.filter((m) => m.status === params.status);
        }
        if (params?.vehicle_id) {
          filtered = filtered.filter((m) => m.vehicle_id === Number(params.vehicle_id));
        }
        resolve({
          success: true,
          message: 'Maintenance logs retrieved successfully.',
          data: filtered,
        });
      }, 500);
    });
  }

  try {
    const response = await apiClient.get<ApiResponse<Maintenance[]>>('/maintenance', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createMaintenance(data: MaintenanceFormData): Promise<ApiResponse<Maintenance>> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRecord: Maintenance = {
          ...data,
          id: mockMaintenances.length > 0 ? Math.max(...mockMaintenances.map((m) => m.id)) + 1 : 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockMaintenances.unshift(newRecord);
        resolve({
          success: true,
          message: 'Maintenance log scheduled successfully.',
          data: newRecord,
        });
      }, 600);
    });
  }

  try {
    const response = await apiClient.post<ApiResponse<Maintenance>>('/maintenance', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateMaintenance(id: number, data: MaintenanceFormData): Promise<ApiResponse<Maintenance>> {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockMaintenances.findIndex((m) => m.id === id);
        if (index === -1) {
          reject({ message: 'Maintenance record not found.' });
          return;
        }

        if (mockMaintenances[index]!.status === 'Completed' || mockMaintenances[index]!.status === 'Cancelled') {
          reject({ message: 'Completed or Cancelled maintenance logs cannot be modified.' });
          return;
        }

        const updated: Maintenance = {
          ...mockMaintenances[index]!,
          ...data,
          updated_at: new Date().toISOString(),
        };
        mockMaintenances[index] = updated;
        resolve({
          success: true,
          message: 'Maintenance record updated successfully.',
          data: updated,
        });
      }, 600);
    });
  }

  try {
    const response = await apiClient.put<ApiResponse<Maintenance>>(`/maintenance/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function closeMaintenance(id: number, closingCost?: number): Promise<ApiResponse<Maintenance>> {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockMaintenances.findIndex((m) => m.id === id);
        if (index === -1) {
          reject({ message: 'Maintenance record not found.' });
          return;
        }

        const currentStatus = mockMaintenances[index]!.status;
        if (currentStatus !== 'In Progress' && currentStatus !== 'Scheduled') {
          reject({ message: `Cannot close maintenance in ${currentStatus} status.` });
          return;
        }

        mockMaintenances[index]!.status = 'Completed';
        if (closingCost !== undefined) {
          mockMaintenances[index]!.cost = closingCost;
        }
        mockMaintenances[index]!.updated_at = new Date().toISOString();

        resolve({
          success: true,
          message: 'Maintenance successfully closed/completed.',
          data: mockMaintenances[index]!,
        });
      }, 500);
    });
  }

  try {
    const response = await apiClient.post<ApiResponse<Maintenance>>(`/maintenance/${id}/close`, { cost: closingCost });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
