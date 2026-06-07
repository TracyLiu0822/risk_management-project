import apiClient from './api.client';
import API_CONFIG from './api.config';
import type {
  ChatHistoryItem,
  PaginatedResponse,
  TutorAnswer,
} from '../types/api';

class TutorService {
  async ask(question: string): Promise<TutorAnswer> {
    return apiClient.post<TutorAnswer>(API_CONFIG.STUDENTS.ASK_TUTOR, { question });
  }

  async getStudentHistory(page = 1, size = 20): Promise<PaginatedResponse<ChatHistoryItem>> {
    return apiClient.get<PaginatedResponse<ChatHistoryItem>>(
      API_CONFIG.STUDENTS.CHAT_HISTORY,
      { params: { page, size } }
    );
  }

  async getTeacherHistory(page = 1, size = 50): Promise<PaginatedResponse<ChatHistoryItem>> {
    return apiClient.get<PaginatedResponse<ChatHistoryItem>>(
      API_CONFIG.TEACHERS.CHAT_HISTORY,
      { params: { page, size } }
    );
  }
}

export const tutorService = new TutorService();
export default tutorService;
