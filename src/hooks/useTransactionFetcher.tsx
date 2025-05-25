
import { useState } from "react";
import { Transaction } from "@/lib/api";
import { toast } from "sonner";
import { normalizeStatus } from "@/utils/transactionUtils";
import { useTransactionQueries } from "./useTransactionQueries";

export function useTransactionFetcher() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { buildFilteredQuery } = useTransactionQueries();
  
  const fetchTransactions = async (showRefreshState = true) => {
    console.log("Fetching all transactions without filters");
    
    // Only show loading state if explicitly requested or during initial load
    if (showRefreshState) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    setError(null);
    
    try {
      // Build simple query for getting all transactions
      const dataQuery = buildFilteredQuery();
      const { data: txData, error: txError } = await dataQuery;
      
      if (txError) {
        console.error("Supabase transaction fetch error:", txError);
        throw txError;
      }

      console.log(`Fetched transactions: ${txData?.length || 0}`);
      
      if (!txData || txData.length === 0) {
        console.log("No transactions found");
        setTransactions([]);
        return;
      }
      
      // Convert Supabase transactions data to our Transaction type
      const formattedTransactions: Transaction[] = txData.map(tx => {
        // Ensure proper type conversion and handle nulls
        const status = normalizeStatus(tx.status);
        
        return {
          id: tx.id,
          mpesa_receipt_number: tx.mpesa_receipt_number || '',
          phone_number: tx.phone_number || '',
          amount: Number(tx.amount || 0),
          status: status,
          transaction_date: tx.transaction_date ? tx.transaction_date.toString() : '',
          application_id: tx.app_id || '',
          application_name: tx.app_id ? `App: ${tx.app_id}` : 'Unknown App',
          created_at: tx.created_at ? new Date(tx.created_at).toISOString() : new Date().toISOString(),
          updated_at: tx.updated_at ? new Date(tx.updated_at).toISOString() : new Date().toISOString(),
          
          // Include additional fields with null handling
          account_reference: tx.account_reference || '',
          transaction_desc: tx.transaction_desc || '',
          result_code: tx.result_code,
          result_desc: tx.result_desc || '',
          checkout_request_id: tx.checkout_request_id || '',
          merchant_request_id: tx.merchant_request_id || '',
          completed_at: tx.completed_at ? new Date(tx.completed_at).toISOString() : undefined,
          narration: tx.narration || ''
        };
      }) || [];
      
      setTransactions(formattedTransactions);
      
    } catch (error) {
      console.error("Failed to fetch transaction data:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch transaction data. Please try again.";
      setError(errorMessage);
      toast.error("Failed to fetch transaction data. Please check your connection and try again.");
      // Reset to empty array to avoid showing stale data
      setTransactions([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  return {
    transactions,
    isLoading,
    isRefreshing,
    error,
    fetchTransactions
  };
}
