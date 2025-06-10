
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
      const errorMsg = "Missing required transaction information (checkout_request_id or application_id)";
      console.error(errorMsg);
      toast.error(errorMsg);
      return null;
    }
    
    console.log("Starting transaction query for:", {
      appId: tx.application_id,
      checkoutRequestId: tx.checkout_request_id
    });
    
    // Use the improved API client with automatic initialization
    const result = await apiClient.queryTransaction(tx.application_id, tx.checkout_request_id);
    console.log("Transaction query successful:", result);
    return result;
    
  } catch (error) {
    console.error("Error in queryTransaction:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("API domain not configured")) {
        toast.error("API domain not configured. Please configure it in the Configuration page.");
      } else if (error.message.includes("Failed to authenticate")) {
        toast.error("Failed to authenticate with the payment server. Please check your application credentials.");
      } else if (error.message.includes("CORS")) {
        toast.error("Unable to connect to the payment server due to CORS restrictions. Please contact your administrator.");
      } else {
        toast.error(`Transaction query failed: ${error.message}`);
      }
    } else {
      toast.error("Failed to query transaction. Please try again later.");
    }
    return null;
  }
}
