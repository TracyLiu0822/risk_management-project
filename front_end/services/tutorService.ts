/*
 * Tutor service layer
 * - 演示基于 apiClient 的 CRUD / 列表 / 搜索 API 封装
 * - 兼容 Next.js App Router 的客户端调用模式
 */

import apiClient from './api.client';
import API_CONFIG from './api.config';
import type { PaginatedResponse } from '../types/api';
import type { Tutor, TutorCreatePayload, TutorUpdatePayload, TutorSearchParams } from '../types/tutor';

class TutorService {
  async listTutors(page = 1, page_size = 20): Promise<PaginatedResponse<Tutor>> {
    return apiClient.get<PaginatedResponse<Tutor>>(API_CONFIG.TUTOR.LIST, {
      params: { page, page_size },
    });
  }

  async getTutor(tutorId: number): Promise<Tutor> {
    return apiClient.get<Tutor>(API_CONFIG.TUTOR.DETAIL(tutorId));
  }

  async searchTutors(params: TutorSearchParams): Promise<PaginatedResponse<Tutor>> {
    return apiClient.get<PaginatedResponse<Tutor>>(API_CONFIG.TUTOR.SEARCH, {
      params: {
        query: params.query,
        page: params.page ?? 1,
        page_size: params.page_size ?? 20,
      },
    });
  }

  async createTutor(payload: TutorCreatePayload): Promise<Tutor> {
    return apiClient.post<Tutor>(API_CONFIG.TUTOR.CREATE, payload);
  }

  async updateTutor(tutorId: number, payload: TutorUpdatePayload): Promise<Tutor> {
    return apiClient.put<Tutor>(API_CONFIG.TUTOR.UPDATE(tutorId), payload);
  }

  async deleteTutor(tutorId: number): Promise<void> {
    return apiClient.delete<void>(API_CONFIG.TUTOR.DELETE(tutorId));
  }
}

export const tutorService = new TutorService();
export default tutorService;
