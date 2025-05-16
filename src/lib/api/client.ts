
import { toast } from "sonner";

interface ApiConfig {
  baseUrl?: string;
}

class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

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

  setAuthToken(token: string) {
    this.authToken = token;
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

      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }

      const config: RequestInit = {
        method,
        headers,
        // Add mode: 'no-cors' for external APIs that don't support CORS
        // Note: This will result in an opaque response that can't be read directly
        // mode: 'no-cors', 
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

  async login(appId: string): Promise<string> {
    const response = await this.post<{ token: string }>('login', { app_id: appId });
    this.setAuthToken(response.token);
    return response.token;
  }

  async queryTransaction(appId: string, checkoutRequestId: string): Promise<any> {
    try {
      // Use a CORS proxy or handle it server-side
      // This is a workaround - ideally you would use a serverless function to proxy this request
      console.log("Querying transaction with app ID:", appId, "and checkout request ID:", checkoutRequestId);
      
      // Login first to get the token
      await this.login(appId);
      
      // Make the query request with the token now set
      return await this.post('express/query', 
        { CheckoutRequestID: checkoutRequestId },
        { 'App-ID': appId }
      );
    } catch (error) {
      console.error("Error in queryTransaction:", error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
