
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ApiConfig {
  baseUrl?: string;
}

class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;
  private isInitialized: boolean = false;

  constructor(config: ApiConfig = {}) {
    this.baseUrl = config.baseUrl || '';
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized && this.baseUrl) {
      return true;
    }

    try {
      console.log("Initializing API client...");
      const { data, error } = await supabase
        .from('api_configurations')
        .select('value')
        .eq('key', 'apiDomain')
        .single();

      if (error) {
        console.error("Failed to load API domain from database:", error);
        return false;
      }

      if (data?.value) {
        this.setBaseUrl(data.value);
        this.isInitialized = true;
        console.log("API client initialized with domain:", data.value);
        return true;
      } else {
        console.warn("No API domain configured in database");
        return false;
      }
    } catch (error) {
      console.error("Error initializing API client:", error);
      return false;
    }
  }

  setBaseUrl(url: string) {
    // Ensure URL ends with trailing slash
    this.baseUrl = url.endsWith('/') ? url : `${url}/`;
    this.isInitialized = true;
    console.log("API base URL set to:", this.baseUrl);
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  isConfigured(): boolean {
    return this.isInitialized && !!this.baseUrl;
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
    // Ensure API client is initialized
    if (!this.isConfigured()) {
      const initialized = await this.initialize();
      if (!initialized) {
        throw new Error("API domain not configured. Please configure it in the Configuration page.");
      }
    }

    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log(`Making ${method} request to:`, url);
      
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
        mode: 'cors',
      };

      if (data) {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `API Error: ${response.status} ${response.statusText}`;
        console.error("API request failed:", errorMessage);
        throw new Error(errorMessage);
      }
      
      // For 204 No Content responses
      if (response.status === 204) {
        return {} as T;
      }

      const result = await response.json();
      console.log("API request successful:", result);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error("API request error:", message);
      
      // Don't show toast for every error, let the calling code handle it
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
    try {
      console.log("Attempting login for app ID:", appId);
      const response = await this.post<{ token: string }>('login', { app_id: appId });
      this.setAuthToken(response.token);
      console.log("Login successful, token set");
      return response.token;
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Failed to authenticate with API");
    }
  }

  async queryTransaction(appId: string, checkoutRequestId: string): Promise<any> {
    try {
      console.log("Querying transaction with app ID:", appId, "and checkout request ID:", checkoutRequestId);
      
      // Ensure we're configured
      if (!this.isConfigured()) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error("API domain not configured");
        }
      }

      // Login first to get the token
      await this.login(appId);
      
      // Make the query request with the token now set
      const result = await this.post('express/query', 
        { CheckoutRequestID: checkoutRequestId },
        { 'App-ID': appId }
      );
      
      console.log("Transaction query successful:", result);
      return result;
    } catch (error) {
      console.error("Error in queryTransaction:", error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
