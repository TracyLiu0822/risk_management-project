import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import API_CONFIG from './api.config';
import type { ApiResponse } from '../types/api';

export enum ApiErrorType {
  Network = 'NETWORK_ERROR',
  Http = 'HTTP_ERROR',
  Business = 'BUSINESS_ERROR',
}

export class ApiError extends Error {
  public readonly type: ApiErrorType;
  public readonly status?: number;
  public readonly payload?: unknown;

  constructor(message: string, type: ApiErrorType, status?: number, payload?: unknown) {
    super(message);
    this.type = type;
    this.status = status;
    this.payload = payload;
  }
}

export class NetworkError extends ApiError {
  constructor(message: string, payload?: unknown) {
    super(message, ApiErrorType.Network, undefined, payload);
  }
}

export class HttpError extends ApiError {
  constructor(message: string, status: number, payload?: unknown) {
    super(message, ApiErrorType.Http, status, payload);
  }
}

export class BusinessError extends ApiError {
  constructor(message: string, payload?: unknown) {
    super(message, ApiErrorType.Business, undefined, payload);
  }
}

interface AuthRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
  skipRefresh?: boolean;
}

class APIClient {
  private readonly client: AxiosInstance;
  private refreshPromise: Promise<boolean> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: true,
    });

    this.client.interceptors.request.use(this.handleRequest.bind(this), this.handleRequestError.bind(this));
    this.client.interceptors.response.use(this.handleResponse.bind(this), this.handleResponseError.bind(this));
  }

  private handleRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    if (!config.headers) {
      config.headers = {};
    }

    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
  }

  private handleRequestError(error: AxiosError): Promise<never> {
    return Promise.reject(new NetworkError(error.message, error));
  }

  private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): AxiosResponse<ApiResponse<T>> {
    const apiBody = response.data;
    if (apiBody && apiBody.success === false) {
      throw new BusinessError(apiBody.error ?? apiBody.message ?? '业务逻辑错误', apiBody);
    }
    return response;
  }

  private async handleResponseError(error: AxiosError): Promise<never> {
    if (!error.response) {
      return Promise.reject(new NetworkError('网络连接失败，请检查您的网络', error));
    }

    const status = error.response.status;
    const config = error.config as AuthRequestConfig;

    if (status === 401 && !config.skipRefresh && !config._retry) {
      const refreshed = await this.refreshAuthentication();
      if (refreshed) {
        config._retry = true;
        return this.client.request(config);
      }
      return Promise.reject(new HttpError('认证已失效，请重新登录', status, error.response.data));
    }

    return Promise.reject(new HttpError(error.response.statusText || 'HTTP 请求失败', status, error.response.data));
  }

  private async refreshAuthentication(): Promise<boolean> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.client
      .post<ApiResponse<unknown>>(API_CONFIG.AUTH.REFRESH, {}, { skipRefresh: true })
      .then((response) => {
        this.refreshPromise = null;
        return response.data.success !== false;
      })
      .catch(() => {
        this.refreshPromise = null;
        return false;
      });

    return this.refreshPromise;
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request<ApiResponse<T>>(config);
    return response.data.data as T;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ url, method: 'GET', ...config });
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ url, method: 'POST', data, ...config });
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ url, method: 'PUT', data, ...config });
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ url, method: 'PATCH', data, ...config });
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ url, method: 'DELETE', ...config });
  }
}

export const apiClient = new APIClient();
export default apiClient;
