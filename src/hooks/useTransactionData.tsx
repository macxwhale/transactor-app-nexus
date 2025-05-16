
import { useState, useEffect } from "react";
import { Transaction } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useApplicationsList } from "./useApplicationsList";
import { useTransactionFilters } from "./useTransactionFilters";
import { usePagination } from "./usePagination";

export function useTransactionData() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  
  const { applications } = useApplicationsList();
  const { searchTerm, filters } = useTransactionFilters();
  const { currentPage, setTotalPages } = usePagination();
  
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Build query for transactions
      let query = supabase
        .from('transactions')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.applicationId) {
        query = query.eq('app_id', filters.applicationId);
      }
      
      if (filters.startDate) {
        const startDate = new Date(filters.startDate).getTime();
        query = query.gte('transaction_date', startDate);
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        query = query.lte('transaction_date', endDate.getTime());
      }
      
      if (searchTerm) {
        query = query.or(`mpesa_receipt_number.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%`);
      }
      
      // Pagination (10 items per page)
      const perPage = 10;
      const from = (currentPage - 1) * perPage;
      const to = from + perPage - 1;
      
      const { data: txData, error: txError, count } = await query
        .range(from, to)
        .order('created_at', { ascending: false });
      
      if (txError) {
        throw txError;
      }
      
      // Convert Supabase transactions data to our Transaction type
      const formattedTransactions: Transaction[] = txData.map(tx => {
        return {
          id: tx.id,
          mpesa_receipt_number: tx.mpesa_receipt_number || '',
          phone_number: tx.phone_number,
          amount: Number(tx.amount),
          status: tx.status?.toLowerCase() as 'pending' | 'completed' | 'failed',
          transaction_date: tx.transaction_date ? tx.transaction_date.toString() : '',
          application_id: tx.app_id,
          application_name: applications.find(app => app.id === tx.app_id)?.name || `App ID: ${tx.app_id}`,
          created_at: new Date(tx.created_at).toISOString(),
          updated_at: new Date(tx.updated_at).toISOString(),
          
          // Include additional fields
          account_reference: tx.account_reference,
          transaction_desc: tx.transaction_desc,
          result_code: tx.result_code,
          result_desc: tx.result_desc,
          checkout_request_id: tx.checkout_request_id,
          merchant_request_id: tx.merchant_request_id,
          completed_at: tx.completed_at ? new Date(tx.completed_at).toISOString() : undefined,
          narration: tx.narration
        };
      });
      
      setTransactions(formattedTransactions);
      
      // Set total pages based on count
      const totalItems = count || 0;
      setTotalPages(Math.ceil(totalItems / perPage));
      
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, filters, applications]);

  return {
    transactions,
    isLoading,
    selectedTx,
    setSelectedTx,
    fetchData
  };
}
