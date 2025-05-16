
import { useState, useEffect, useRef } from "react";
import { Transaction } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useApplicationsList } from "./useApplicationsList";
import { useTransactionFilters } from "./useTransactionFilters";
import { usePagination } from "./usePagination";

// Valid status types to ensure consistent handling
const VALID_STATUSES = ['pending', 'completed', 'failed', 'processing'];
const PER_PAGE = 10; // Define this as a constant so it's easy to change later

export function useTransactionData() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const prevFiltersRef = useRef<any>(null);
  const prevSearchRef = useRef<string>('');
  const prevPageRef = useRef<number>(1);
  
  const { applications } = useApplicationsList();
  const { searchTerm, filters } = useTransactionFilters();
  const { currentPage, setTotalPages, setTotalItems } = usePagination();
  
  // Helper function to normalize status values
  const normalizeStatus = (status: string | null): 'pending' | 'completed' | 'failed' | 'processing' => {
    if (!status) return 'pending';
    
    // Convert to lowercase for consistent comparison
    const lowercaseStatus = status.toLowerCase();
    
    if (lowercaseStatus.includes('pend')) return 'pending';
    if (lowercaseStatus.includes('complet')) return 'completed';
    if (lowercaseStatus.includes('fail')) return 'failed';
    if (lowercaseStatus.includes('process')) return 'processing';
    
    // Default to pending if unknown status
    console.warn(`Unknown status encountered: ${status}, defaulting to 'pending'`);
    return 'pending';
  };

  // Check if filters or search have actually changed
  const filtersChanged = () => {
    if (!prevFiltersRef.current) return true;
    
    return (
      prevFiltersRef.current.status !== filters.status ||
      prevFiltersRef.current.applicationId !== filters.applicationId ||
      prevFiltersRef.current.startDate !== filters.startDate ||
      prevFiltersRef.current.endDate !== filters.endDate ||
      prevSearchRef.current !== searchTerm ||
      prevPageRef.current !== currentPage
    );
  };
  
  // Helper function to build a query with all the necessary filters
  const buildFilteredQuery = () => {
    // Build query for transactions
    let query = supabase
      .from('transactions')
      .select('*');
    
    // Apply filters with case-insensitive status matching
    if (filters.status && filters.status !== 'all') {
      // Handle all possible status variations with case-insensitivity
      if (VALID_STATUSES.includes(filters.status.toLowerCase())) {
        query = query.ilike('status', `%${filters.status}%`);
        console.log(`Adding status filter: %${filters.status}%`);
      }
    }
    
    if (filters.applicationId && filters.applicationId !== 'all') {
      query = query.eq('app_id', filters.applicationId);
      console.log(`Adding app_id filter: ${filters.applicationId}`);
    }
    
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      // Set to beginning of day
      startDate.setHours(0, 0, 0, 0);
      const startTimestamp = startDate.getTime();
      query = query.gte('transaction_date', startTimestamp);
      console.log(`Adding startDate filter: ${startTimestamp}`);
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      // Set to end of day
      endDate.setHours(23, 59, 59, 999);
      const endTimestamp = endDate.getTime();
      query = query.lte('transaction_date', endTimestamp);
      console.log(`Adding endDate filter: ${endTimestamp}`);
    }
    
    if (searchTerm) {
      query = query.or(`mpesa_receipt_number.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%`);
      console.log(`Adding search filter: ${searchTerm}`);
    }
    
    return query;
  };
  
  const fetchData = async () => {
    // Don't reload if nothing changed
    if (!filtersChanged() && transactions.length > 0) {
      console.log("No filter changes detected, skipping fetch");
      return;
    }
    
    console.log("Fetching transactions with filters:", { 
      page: currentPage,
      search: searchTerm, 
      filters,
      prevPage: prevPageRef.current
    });
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Update refs to current values
      prevFiltersRef.current = {...filters};
      prevSearchRef.current = searchTerm;
      prevPageRef.current = currentPage;
      
      // First, get total count using a separate query
      // Fix: Use the count() method correctly by calling it with .select('count')
      const { count: totalCount, error: countError } = await buildFilteredQuery()
        .select('count', { count: 'exact', head: true });
      
      if (countError) {
        throw countError;
      }
      
      console.log(`Total matching records before pagination: ${totalCount}`);
      
      // Set total pages and items based on the count
      const totalItems = totalCount || 0;
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
      const perPage = PER_PAGE;
      const from = (currentPage - 1) * perPage;
      const to = from + perPage - 1;
      console.log(`Pagination: from ${from} to ${to} (page ${currentPage}, ${perPage} per page)`);
      
      const dataQuery = buildFilteredQuery();
      const { data: txData, error: txError } = await dataQuery
        .range(from, to)
        .order('created_at', { ascending: false });
      
      if (txError) {
        throw txError;
      }

      console.log(`Fetched transactions: ${txData?.length || 0} out of ${totalItems} total`);
      
      // Convert Supabase transactions data to our Transaction type
      const formattedTransactions: Transaction[] = txData?.map(tx => {
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

  useEffect(() => {
    // Create a debounce mechanism for search
    const searchTimer = setTimeout(() => {
      fetchData();
    }, searchTerm ? 300 : 0);
    
    return () => clearTimeout(searchTimer);
  }, [currentPage, searchTerm, filters.status, filters.applicationId, filters.startDate, filters.endDate, applications.length]);

  return {
    transactions,
    isLoading,
    error,
    selectedTx,
    setSelectedTx,
    fetchData
  };
}
