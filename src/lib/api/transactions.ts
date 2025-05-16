
import { toast } from "sonner";
import { apiClient } from './client';
import { Transaction, ApiResponse, PaginatedResponse } from './types';

export async function fetchTransactions(
  page: number = 1,
  filters: {
    search?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    applicationId?: string;
  } = {}
): Promise<PaginatedResponse<Transaction>> {
  // Build query params
  const params = new URLSearchParams();
  params.append('page', page.toString());
  
  if (filters.search) params.append('search', filters.search);
  if (filters.startDate) params.append('start_date', filters.startDate);
  if (filters.endDate) params.append('end_date', filters.endDate);
  if (filters.status) params.append('status', filters.status);
  if (filters.applicationId) params.append('application_id', filters.applicationId);

  const endpoint = `transactions?${params.toString()}`;
  const response = await apiClient.get<ApiResponse<PaginatedResponse<Transaction>>>(endpoint);
  return response.data;
}

export async function queryTransaction(tx: Transaction): Promise<any> {
  try {
    if (!tx.checkout_request_id || !tx.application_id) {
      toast.error("Missing required transaction information");
      return null;
    }
    
    // Get API domain from localStorage
    const apiDomain = localStorage.getItem("apiDomain");
    if (!apiDomain) {
      toast.error("API domain not configured");
      return null;
    }
    
    // Log the URL being used - helps with debugging
    console.log("Using API domain:", apiDomain);
    apiClient.setBaseUrl(apiDomain);
    
    // Since we're likely hitting CORS issues, let's add better error handling
    try {
      const result = await apiClient.queryTransaction(tx.application_id, tx.checkout_request_id);
      console.log("Transaction query successful:", result);
      return result;
    } catch (error) {
      console.error("Error querying transaction:", error);
      
      // More user-friendly error message
      if (error instanceof Error && error.message.includes("CORS")) {
        toast.error("Unable to connect to the payment server due to CORS restrictions. Please contact your administrator.");
      } else {
        toast.error("Failed to query transaction. Please try again later.");
      }
      return null;
    }
  } catch (error) {
    console.error("Error in queryTransaction outer block:", error);
    return null;
  }
}
