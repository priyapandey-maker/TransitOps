import apiClient, { handleApiError } from './api';
import type { ApiResponse } from '../types/api.types';
import type { FuelLog, FuelFormData } from '../types/fuel.types';
import type { Expense, ExpenseFormData } from '../types/expense.types';

const USE_MOCK = false;

// Reusable mock database in memory
let mockFuelLogs: FuelLog[] = [
  {
    id: 1,
    vehicle_id: 1,
    registration_number: 'MH-12-AB-1234',
    vehicle_name: 'Tata Signa 4018.S',
    trip_id: 1,
    liters: 120,
    cost: 11000,
    date: '2026-07-10',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    vehicle_id: 2,
    registration_number: 'KA-03-XY-5678',
    vehicle_name: 'Mahindra Bolero Maxi Truck',
    trip_id: 2,
    liters: 45,
    cost: 4100,
    date: '2026-07-09',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    vehicle_id: 3,
    registration_number: 'DL-01-CP-9012',
    vehicle_name: 'Eicher Pro 2049',
    trip_id: null,
    liters: 85,
    cost: 7800,
    date: '2026-07-08',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let mockExpenses: Expense[] = [
  {
    id: 1,
    vehicle_id: 1,
    registration_number: 'MH-12-AB-1234',
    vehicle_name: 'Tata Signa 4018.S',
    trip_id: 1,
    amount: 11000,
    category: 'Fuel',
    description: 'Fuel log automatic sync',
    date: '2026-07-10',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    vehicle_id: 3,
    registration_number: 'DL-01-CP-9012',
    vehicle_name: 'Eicher Pro 2049',
    trip_id: null,
    amount: 8500,
    category: 'Maintenance',
    description: 'Brake pad replacement service cost',
    date: '2026-07-08',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    vehicle_id: 2,
    registration_number: 'KA-03-XY-5678',
    vehicle_name: 'Mahindra Bolero Maxi Truck',
    trip_id: 2,
    amount: 1200,
    category: 'Toll',
    description: 'Mumbai-Pune Expressway toll charges',
    date: '2026-07-09',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    vehicle_id: null,
    registration_number: undefined,
    vehicle_name: undefined,
    trip_id: null,
    amount: 3500,
    category: 'Misc',
    description: 'Office admin depot refreshments & office supplies',
    date: '2026-07-05',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/* ── Fuel Logs API ───────────────────────────────────── */

export async function getFuelLogs(params?: {
  search?: string;
  vehicle_id?: number;
}): Promise<ApiResponse<FuelLog[]>> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockFuelLogs];
        if (params?.search) {
          const query = params.search.toLowerCase();
          filtered = filtered.filter(
            (l) =>
              (l.registration_number && l.registration_number.toLowerCase().includes(query)) ||
              (l.vehicle_name && l.vehicle_name.toLowerCase().includes(query))
          );
        }
        if (params?.vehicle_id) {
          filtered = filtered.filter((l) => l.vehicle_id === params.vehicle_id);
        }
        resolve({
          success: true,
          message: 'Fuel logs retrieved successfully.',
          data: filtered,
        });
      }, 500);
    });
  }

  try {
    const response = await apiClient.get<ApiResponse<FuelLog[]>>('/fuel', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createFuelLog(data: FuelFormData): Promise<ApiResponse<FuelLog>> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newLog: FuelLog = {
          ...data,
          id: mockFuelLogs.length > 0 ? Math.max(...mockFuelLogs.map((l) => l.id)) + 1 : 1,
          registration_number: data.vehicle_id === 1 ? 'MH-12-AB-1234' : data.vehicle_id === 2 ? 'KA-03-XY-5678' : 'DL-01-CP-9012',
          vehicle_name: data.vehicle_id === 1 ? 'Tata Signa 4018.S' : data.vehicle_id === 2 ? 'Mahindra Bolero' : 'Eicher Pro',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockFuelLogs.unshift(newLog);
        
        // Automatically sync to expenses log
        const syncExpense: Expense = {
          id: mockExpenses.length > 0 ? Math.max(...mockExpenses.map((e) => e.id)) + 1 : 1,
          vehicle_id: data.vehicle_id,
          trip_id: data.trip_id,
          amount: data.cost,
          category: 'Fuel',
          description: `Fuel log automatic sync (${data.liters}L)`,
          date: data.date,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockExpenses.unshift(syncExpense);

        resolve({
          success: true,
          message: 'Fuel log created successfully.',
          data: newLog,
        });
      }, 600);
    });
  }

  try {
    const response = await apiClient.post<ApiResponse<FuelLog>>('/fuel', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateFuelLog(id: number, data: FuelFormData): Promise<ApiResponse<FuelLog>> {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockFuelLogs.findIndex((l) => l.id === id);
        if (index === -1) {
          reject({ message: 'Fuel log not found.' });
          return;
        }
        const updated: FuelLog = {
          ...mockFuelLogs[index]!,
          ...data,
          updated_at: new Date().toISOString(),
        };
        mockFuelLogs[index] = updated;
        resolve({
          success: true,
          message: 'Fuel log updated successfully.',
          data: updated,
        });
      }, 650);
    });
  }

  try {
    const response = await apiClient.put<ApiResponse<FuelLog>>(`/fuel/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/* ── Expenses API ────────────────────────────────────── */

export async function getExpenses(params?: {
  search?: string;
  category?: string;
}): Promise<ApiResponse<Expense[]>> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockExpenses];
        if (params?.search) {
          const query = params.search.toLowerCase();
          filtered = filtered.filter(
            (e) =>
              (e.description && e.description.toLowerCase().includes(query)) ||
              (e.registration_number && e.registration_number.toLowerCase().includes(query))
          );
        }
        if (params?.category) {
          filtered = filtered.filter((e) => e.category === params.category);
        }
        resolve({
          success: true,
          message: 'Expenses retrieved successfully.',
          data: filtered,
        });
      }, 500);
    });
  }

  try {
    const response = await apiClient.get<ApiResponse<Expense[]>>('/expenses', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createExpense(data: ExpenseFormData): Promise<ApiResponse<Expense>> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newExpense: Expense = {
          ...data,
          id: mockExpenses.length > 0 ? Math.max(...mockExpenses.map((e) => e.id)) + 1 : 1,
          registration_number: data.vehicle_id ? (data.vehicle_id === 1 ? 'MH-12-AB-1234' : data.vehicle_id === 2 ? 'KA-03-XY-5678' : 'DL-01-CP-9012') : undefined,
          vehicle_name: data.vehicle_id ? (data.vehicle_id === 1 ? 'Tata Signa 4018.S' : data.vehicle_id === 2 ? 'Mahindra Bolero' : 'Eicher Pro') : undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockExpenses.unshift(newExpense);
        resolve({
          success: true,
          message: 'Expense logged successfully.',
          data: newExpense,
        });
      }, 600);
    });
  }

  try {
    const response = await apiClient.post<ApiResponse<Expense>>('/expenses', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateExpense(id: number, data: ExpenseFormData): Promise<ApiResponse<Expense>> {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockExpenses.findIndex((e) => e.id === id);
        if (index === -1) {
          reject({ message: 'Expense not found.' });
          return;
        }
        const updated: Expense = {
          ...mockExpenses[index]!,
          ...data,
          updated_at: new Date().toISOString(),
        };
        mockExpenses[index] = updated;
        resolve({
          success: true,
          message: 'Expense updated successfully.',
          data: updated,
        });
      }, 650);
    });
  }

  try {
    const response = await apiClient.put<ApiResponse<Expense>>(`/expenses/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
