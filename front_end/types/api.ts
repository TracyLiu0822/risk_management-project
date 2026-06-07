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
  size: number;
  pages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  role: 'student' | 'teacher';
  teacher_code?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
  expires_in: number;
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'student' | 'teacher';
  created_at: string;
}

export interface TutorSource {
  source_id: string;
  title: string;
  relevance_score: number;
}

export interface TutorAnswer {
  answer: string;
  sources: TutorSource[];
  chat_id: string;
}

export interface ChatHistoryItem {
  id: string;
  user_id: string;
  student_email?: string;
  question: string;
  answer: string;
  sources: TutorSource[];
  created_at: string;
}
