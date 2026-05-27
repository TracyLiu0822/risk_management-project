/**
 * Common API response contracts shared between frontend and backend.
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse<User> {
  user: User;
}

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
}
