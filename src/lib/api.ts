
import { toast } from "sonner";

interface ApiConfig {
  baseUrl?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(config: ApiConfig = {}) {
    this.baseUrl = config.baseUrl || '';
  }

  setBaseUrl(url: string) {
    // Ensure URL ends with trailing slash
    this.baseUrl = url.endsWith('/') ? url : `${url}/`;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  async request<T>(
    endpoint: string,
    method: string = 'GET',
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    try {
      const url = this.baseUrl ? `${this.baseUrl}${endpoint}` : endpoint;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...customHeaders,
      };

      const config: RequestInit = {
        method,
        headers,
      };

      if (data) {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }
      
      // For 204 No Content responses
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(message);
      throw error;
    }
  }

  async get<T>(endpoint: string, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, 'GET', undefined, customHeaders);
  }

  async post<T>(endpoint: string, data: any, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, 'POST', data, customHeaders);
  }

  async put<T>(endpoint: string, data: any, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, 'PUT', data, customHeaders);
  }

  async delete<T>(endpoint: string, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, 'DELETE', undefined, customHeaders);
  }
}

export const apiClient = new ApiClient();

// Types
export interface Application {
  id: number;
  name: string;
  callback_url: string;
  consumer_key: string;
  consumer_secret: string;
  business_short_code: string;
  passkey: string;
  bearer_token: string;
  party_a: string;
  party_b: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  mpesa_receipt_number: string;
  phone_number: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transaction_date: string;
  application_id: number;
  application_name?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  }
}

// API functions
export async function fetchApplications(): Promise<Application[]> {
  const response = await apiClient.get<ApiResponse<Application[]>>('applications');
  return response.data;
}

export async function fetchApplication(id: number): Promise<Application> {
  const response = await apiClient.get<ApiResponse<Application>>(`applications/${id}`);
  return response.data;
}

export async function createApplication(data: Partial<Application>): Promise<Application> {
  const response = await apiClient.post<ApiResponse<Application>>('register', data);
  return response.data;
}

export async function updateApplication(id: number, data: Partial<Application>): Promise<Application> {
  const response = await apiClient.put<ApiResponse<Application>>(`applications/${id}`, data);
  return response.data;
}

export async function toggleApplicationStatus(id: number, isActive: boolean): Promise<Application> {
  const response = await apiClient.put<ApiResponse<Application>>(`applications/${id}/toggle-status`, { is_active: isActive });
  return response.data;
}

export async function fetchTransactions(
  page: number = 1,
  filters: {
    search?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    applicationId?: number;
  } = {}
): Promise<PaginatedResponse<Transaction>> {
  // Build query params
  const params = new URLSearchParams();
  params.append('page', page.toString());
  
  if (filters.search) params.append('search', filters.search);
  if (filters.startDate) params.append('start_date', filters.startDate);
  if (filters.endDate) params.append('end_date', filters.endDate);
  if (filters.status) params.append('status', filters.status);
  if (filters.applicationId) params.append('application_id', filters.applicationId.toString());

  const endpoint = `transactions?${params.toString()}`;
  const response = await apiClient.get<ApiResponse<PaginatedResponse<Transaction>>>(endpoint);
  return response.data;
}

export async function fetchDashboardStats(): Promise<{
  totalTransactions: number;
  totalAmount: number;
  pendingTransactions: number;
  completedTransactions: number;
  failedTransactions: number;
  dailyStats: Array<{ date: string; count: number; amount: number }>;
  topApplications: Array<{ name: string; transactions: number; amount: number }>;
  recentTransactions: Transaction[];
}> {
  const response = await apiClient.get<ApiResponse<any>>('stats/dashboard');
  return response.data;
}
