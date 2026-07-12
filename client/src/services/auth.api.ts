import apiClient, { handleApiError } from './api';
import type { ApiResponse } from '../types/api.types';
import type { LoginCredentials, LoginResponse, ProfileResponse } from '../types/auth.types';

// Flag to easily toggle between Mock and Real API once the backend is ready
const USE_MOCK = false;

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
    // The backend returns { id, firstName, lastName, email, role }
    // We map it to AuthUser { userId, fullName, email, role } to preserve UI components
    const response = await apiClient.post<ApiResponse<any>>('/auth/login', credentials);
    
    if (response.data.data && response.data.data.user) {
      const backendUser = response.data.data.user;
      response.data.data.user = {
        userId: backendUser.id || backendUser.userId,
        fullName: backendUser.fullName || `${backendUser.firstName || ''} ${backendUser.lastName || ''}`.trim(),
        email: backendUser.email,
        role: backendUser.role,
      };
    }
    
    return response.data as ApiResponse<LoginResponse>;
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
    const response = await apiClient.get<ApiResponse<any>>('/auth/profile');
    
    if (response.data.data) {
      const backendUser = response.data.data;
      response.data.data = {
        user: {
          userId: backendUser.id || backendUser.userId,
          fullName: backendUser.fullName || `${backendUser.firstName || ''} ${backendUser.lastName || ''}`.trim(),
          email: backendUser.email,
          role: backendUser.role,
        }
      };
    }
    
    return response.data as ApiResponse<ProfileResponse>;
  } catch (error) {
    throw handleApiError(error);
  }
}
