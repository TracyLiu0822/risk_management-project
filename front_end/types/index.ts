// User Types
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface StudentProfile extends User {
  student_id: string;
  major: string;
  enrolled_at: string;
}

export interface TeacherProfile extends User {
  teacher_id: string;
  department: string;
  hired_at: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'teacher';
}

// Course Types
export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  duration_weeks: number;
  created_at: string;
}

export interface Chapter {
  id: number;
  course_id: number;
  title: string;
  description: string;
  order: number;
  sections: Section[];
}

export interface Section {
  id: number;
  chapter_id: number;
  title: string;
  content: string;
  order: number;
  video_url?: string;
}

// Quiz Types
export interface Quiz {
  id: number;
  chapter_id: number;
  title: string;
  description: string;
  questions: Question[];
  time_limit_minutes?: number;
}

export interface Question {
  id: number;
  quiz_id: number;
  text: string;
  type: 'multiple_choice' | 'short_answer' | 'essay';
  options?: string[];
  correct_answer?: string;
  order: number;
}

export interface QuizSubmission {
  id: number;
  quiz_id: number;
  user_id: number;
  answers: Answer[];
  score?: number;
  feedback?: string;
  submitted_at: string;
}

export interface Answer {
  question_id: number;
  student_answer: string;
  is_correct?: boolean;
}

// Learning Progress
export interface LearningProgress {
  user_id: number;
  course_id: number;
  completion_percentage: number;
  last_accessed: string;
  chapters_completed: number;
  quizzes_completed: number;
  average_quiz_score: number;
}

// Student Feedback
export interface LearningFeedback {
  weak_areas: string[];
  strong_areas: string[];
  recommendations: string[];
  next_learning_steps: string[];
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Agent Response Types
export interface TutorResponse {
  response: string;
  resources: string[];
  follow_up_questions?: string[];
}

export interface GradingResponse {
  score: number;
  feedback: string;
  suggestions: string[];
}

export interface QuizGenerationResponse {
  questions: Question[];
  difficulty_level: string;
}

export interface TeachingInsights {
  class_strengths: string[];
  class_weaknesses: string[];
  student_groupings: StudentGroup[];
  recommendations: string[];
}

export interface StudentGroup {
  group_name: string;
  student_ids: number[];
  characteristics: string[];
}

// RAG Types
export interface Document {
  id: number;
  filename: string;
  file_type: string;
  upload_date: string;
  indexed: boolean;
}

export interface SearchResult {
  document_id: number;
  filename: string;
  excerpt: string;
  similarity_score: number;
}

export interface IndexStatus {
  indexed_documents: number;
  total_documents: number;
  index_ready: boolean;
  last_updated: string;
}
