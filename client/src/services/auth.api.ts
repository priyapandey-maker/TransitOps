import apiClient, { handleApiError } from './api';
import type { ApiResponse } from '../types/api.types';
import type { LoginCredentials, LoginResponse, ProfileResponse } from '../types/auth.types';

// Flag to easily toggle between Mock and Real API once the backend is ready
const USE_MOCK = true;

// Reusable mock database to replicate backend behavior exactly
const MOCK_USER = {
  userId: 1,
  fullName: 'Admin User',
  email: 'admin@transitops.com',
  role: 'Admin' as const,
};

export async function login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === 'admin@transitops.com' && credentials.password === 'admin123') {
          resolve({
            success: true,
            message: 'Login successful.',
            data: {
              token: 'mock-jwt-token-transitops-erp',
              user: MOCK_USER,
            },
          });
        } else {
          reject({
            response: {
              data: {
                success: false,
                message: 'Invalid email or password.',
              },
            },
          } as unknown);
        }
      }, 800);
    });
  }

  try {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getProfile(): Promise<ApiResponse<ProfileResponse>> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Profile retrieved successfully.',
          data: {
            user: MOCK_USER,
          },
        });
      }, 500);
    });
  }

  try {
    const response = await apiClient.get<ApiResponse<ProfileResponse>>('/auth/profile');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
