/**
 * Shared API types — matches backend response helper (Phase 4 contract).
 * Every API returns one of these two shapes.
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: ValidationError[];
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;
