import apiClient from './api.client';
import API_CONFIG from './api.config';
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserProfile,
} from '../types/api';

class AuthService {
  private currentUser: UserProfile | null = null;

  async login(payload: LoginRequest): Promise<UserProfile> {
    const tokens = await apiClient.post<TokenResponse>(API_CONFIG.AUTH.LOGIN, payload);
    apiClient.setTokens(tokens.access_token, tokens.refresh_token);
    return this.getProfile();
  }

  async register(payload: RegisterRequest): Promise<UserProfile> {
    await apiClient.post<UserProfile>(API_CONFIG.AUTH.REGISTER, payload);
    return this.login({ email: payload.email, password: payload.password });
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post<void>(API_CONFIG.AUTH.LOGOUT);
    } finally {
      apiClient.clearTokens();
      this.currentUser = null;
    }
  }

  async getProfile(): Promise<UserProfile> {
    const user = await apiClient.get<UserProfile>(API_CONFIG.AUTH.ME);
    this.currentUser = user;
    return user;
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }
}

export const authService = new AuthService();
export default authService;
