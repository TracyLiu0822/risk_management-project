import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import API_CONFIG from './api.config';
import type { ApiResponse, TokenResponse } from '../types/api';

const ACCESS_TOKEN_KEY = 'risk_access_token';
const REFRESH_TOKEN_KEY = 'risk_refresh_token';

interface AuthRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
  skipRefresh?: boolean;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly payload?: unknown
  ) {
    super(message);
  }
}

function getStoredToken(key: string): string | null {
  return typeof window === 'undefined' ? null : window.localStorage.getItem(key);
}

class APIClient {
  private readonly client: AxiosInstance;
  private refreshPromise: Promise<boolean> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: 30000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => this.addAuthorization(config));
    this.client.interceptors.response.use(
      (response) => this.validateBusinessResponse(response),
      (error: AxiosError) => this.handleResponseError(error)
    );
  }

  private addAuthorization(
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig {
    const accessToken = getStoredToken(ACCESS_TOKEN_KEY);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  }

  private validateBusinessResponse(
    response: AxiosResponse<ApiResponse<unknown>>
  ): AxiosResponse<ApiResponse<unknown>> {
    if (response.data?.success === false) {
      throw new ApiError(
        response.data.message ?? response.data.error ?? '业务请求失败',
        response.status,
        response.data
      );
    }
    return response;
  }

  private async handleResponseError(error: AxiosError): Promise<never> {
    if (!error.response) {
      throw new ApiError('网络连接失败，请检查后端服务是否已启动。', undefined, error);
    }

    const status = error.response.status;
    const config = error.config as AuthRequestConfig | undefined;
    if (status === 401 && config && !config.skipRefresh && !config._retry) {
      const refreshed = await this.refreshAuthentication();
      if (refreshed) {
        config._retry = true;
        return this.client.request(config);
      }
    }

    const responseBody = error.response.data as Partial<ApiResponse<unknown>> | undefined;
    throw new ApiError(
      responseBody?.message ?? error.response.statusText ?? 'HTTP 请求失败',
      status,
      error.response.data
    );
  }

  private async refreshAuthentication(): Promise<boolean> {
    const refreshToken = getStoredToken(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return false;
    }
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.client
      .post<ApiResponse<TokenResponse>>(
        API_CONFIG.AUTH.REFRESH,
        { refresh_token: refreshToken },
        { skipRefresh: true } as AuthRequestConfig
      )
      .then((response) => {
        const tokens = response.data.data;
        if (!response.data.success || !tokens) {
          return false;
        }
        this.setTokens(tokens.access_token, tokens.refresh_token);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request<ApiResponse<T>>(config);
    return response.data.data;
  }

  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, url, method: 'GET' });
  }

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, url, method: 'POST', data });
  }

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, url, method: 'PUT', data });
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, url, method: 'DELETE' });
  }

  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  clearTokens(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }
}

export const apiClient = new APIClient();
export default apiClient;
