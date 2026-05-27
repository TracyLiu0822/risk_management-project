/*
 * Auth service layer
 * - 负责登录、登出、刷新会话、获取当前用户信息
 * - 依赖 apiClient 的 cookie-based JWT 自动携带逻辑
 * - 通过 request dedupe 防止短时间内重复调用相同登录/获取用户接口
 */

import apiClient from './api.client';
import API_CONFIG from './api.config';
import type { ApiResponse, LoginRequest, UserProfile } from '../types/api';

class AuthService {
  private currentUser: UserProfile | null = null;
  private pendingRequests: Map<string, Promise<unknown>> = new Map();

  private dedupe<T>(key: string, factory: () => Promise<T>): Promise<T> {
    const existing = this.pendingRequests.get(key) as Promise<T> | undefined;
    if (existing) {
      return existing;
    }

    const promise = factory();
    this.pendingRequests.set(key, promise);

    window.setTimeout(() => {
      this.pendingRequests.delete(key);
    }, 500);

    return promise;
  }

  async login(payload: LoginRequest): Promise<UserProfile> {
    const response = await this.dedupe(`login:${payload.email}`, async () =>
      apiClient.post<UserProfile>(API_CONFIG.AUTH.LOGIN, payload)
    );

    const user = response as UserProfile;
    this.currentUser = user;
    return user;
  }

  async logout(): Promise<void> {
    await apiClient.post<void>(API_CONFIG.AUTH.LOGOUT);
    this.currentUser = null;
  }

  async refreshSession(): Promise<UserProfile> {
    const user = await this.dedupe('refresh_session', async () =>
      apiClient.post<UserProfile>(API_CONFIG.AUTH.REFRESH, {})
    );

    this.currentUser = user as UserProfile;
    return this.currentUser;
  }

  async getProfile(): Promise<UserProfile> {
    const user = await this.dedupe('get_profile', async () =>
      apiClient.get<UserProfile>(API_CONFIG.AUTH.ME)
    );

    this.currentUser = user as UserProfile;
    return this.currentUser;
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }
}

export const authService = new AuthService();
export default authService;
