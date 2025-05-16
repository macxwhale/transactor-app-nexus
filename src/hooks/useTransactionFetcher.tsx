
import { useState } from "react";
import { Transaction, Application } from "@/lib/api";
import { toast } from "sonner";
import { normalizeStatus } from "@/utils/transactionUtils";
import { useTransactionQueries } from "./useTransactionQueries";
import { PostgrestResponse } from "@supabase/supabase-js";

export function useTransactionFetcher(applications: Application[]) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { buildFilteredQuery, filtersChanged, updateRefs, PER_PAGE } = useTransactionQueries();
  
  const fetchTransactions = async (
    currentPage: number,
    searchTerm: string,
    filters: {
      status: string;
      applicationId: string;
      startDate: string;
      endDate: string;
    },
    setTotalItems: (count: number) => void,
    setTotalPages: (pages: number) => void
  ) => {
    // Don't reload if nothing changed
    if (!filtersChanged(filters, searchTerm, currentPage) && transactions.length > 0) {
      console.log("No filter changes detected, skipping fetch");
      return;
    }
    
    console.log("Fetching transactions with filters:", { 
      page: currentPage,
      search: searchTerm, 
      filters
    });
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Update refs to current values
      updateRefs(filters, searchTerm, currentPage);
      
      // Get total count properly using the select method with count option
      const countQuery = buildFilteredQuery(filters, searchTerm);
      const { data, count, error: countError } = await countQuery.select('*', { count: 'exact' });
      
      if (countError) {
        throw countError;
      }
      
      // Use the count value directly from the response metadata
      const totalItems = count || 0;
      
      console.log(`Total matching records before pagination: ${totalItems}`);
      
      // Set total pages and items based on the count
      const totalPages = Math.ceil(totalItems / PER_PAGE);
      console.log(`Setting pagination: ${totalItems} total items, ${totalPages} total pages`);
      
      setTotalItems(totalItems);
      setTotalPages(totalPages);
      
      if (totalItems === 0) {
        // No need to fetch data if there are no matches
        setTransactions([]);
        setIsLoading(false);
        return;
      }
      
      // Then get the actual paginated data
      const from = (currentPage - 1) * PER_PAGE;
      const to = from + PER_PAGE - 1;
      console.log(`Pagination: from ${from} to ${to} (page ${currentPage}, ${PER_PAGE} per page)`);
      
      const dataQuery = buildFilteredQuery(filters, searchTerm);
      const { data: txData, error: txError } = await dataQuery
        .range(from, to)
        .order('created_at', { ascending: false });
      
      if (txError) {
        throw txError;
      }

      console.log(`Fetched transactions: ${txData?.length || 0} out of ${totalItems} total`);
      
      if (!txData || txData.length === 0) {
        console.log("No transactions found in this range");
        setTransactions([]);
        setIsLoading(false);
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
          application_name: applications.find(app => app.id === tx.app_id)?.name || `App ID: ${tx.app_id}`,
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
      setError("Failed to fetch transaction data. Please try again.");
      toast.error("Failed to fetch data. Please try again.");
      // Reset to empty array to avoid showing stale data
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions
  };
}
