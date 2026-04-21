import {
  ApiResponse,
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  Transaction,
  TransactionRequest,
  FinancialSummary,
} from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Type guard for ApiResponse
function isApiResponse<T>(response: unknown): response is ApiResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    typeof (response as Record<string, unknown>).success === 'boolean'
  );
}

export class ApiClient {
  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  static setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  static clearToken(): void {
    localStorage.removeItem('token');
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  static async request<T>(
    method: string,
    endpoint: string,
    body?: unknown
  ): Promise<ApiResponse<T>> {
    const url = `${API_URL}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: this.getAuthHeaders(),
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      const data: unknown = await response.json();

      if (!isApiResponse<T>(data)) {
        return {
          success: false,
          error: 'Invalid response format from server',
        };
      }

      if (!response.ok && data.success === false) {
        return data;
      }

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network error';
      return {
        success: false,
        error: `Failed to ${method} ${endpoint}: ${message}`,
      };
    }
  }

  // Auth endpoints
  static async register(request: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('POST', '/auth/register', request);
  }

  static async login(request: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('POST', '/auth/login', request);
  }

  // Transaction endpoints
  static async createTransaction(
    request: TransactionRequest
  ): Promise<ApiResponse<Transaction>> {
    return this.request<Transaction>('POST', '/transactions', request);
  }

  static async getTransactions(): Promise<ApiResponse<Transaction[]>> {
    return this.request<Transaction[]>('GET', '/transactions');
  }

  static async deleteTransaction(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('DELETE', `/transactions/${id}`);
  }

  // Summary endpoint
  static async getFinancialSummary(): Promise<ApiResponse<FinancialSummary>> {
    return this.request<FinancialSummary>('GET', '/summary');
  }
}
