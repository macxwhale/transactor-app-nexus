
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VALID_STATUSES } from "@/utils/transactionUtils";

// Number of transactions to display per page
export const PER_PAGE = 10;

interface TransactionFilters {
  status: string;
  applicationId: string;
  startDate: string;
  endDate: string;
}

export function useTransactionQueries() {
  const prevFiltersRef = useRef<TransactionFilters | null>(null);
  const prevSearchRef = useRef<string>('');
  const prevPageRef = useRef<number>(1);
  
  // Check if filters or search have actually changed
  const filtersChanged = (
    currentFilters: TransactionFilters,
    currentSearch: string,
    currentPage: number
  ) => {
    if (!prevFiltersRef.current) return true;
    
    return (
      prevFiltersRef.current.status !== currentFilters.status ||
      prevFiltersRef.current.applicationId !== currentFilters.applicationId ||
      prevFiltersRef.current.startDate !== currentFilters.startDate ||
      prevFiltersRef.current.endDate !== currentFilters.endDate ||
      prevSearchRef.current !== currentSearch ||
      prevPageRef.current !== currentPage
    );
  };
  
  // Update the refs to current values
  const updateRefs = (
    currentFilters: TransactionFilters,
    currentSearch: string,
    currentPage: number
  ) => {
    prevFiltersRef.current = {...currentFilters};
    prevSearchRef.current = currentSearch;
    prevPageRef.current = currentPage;
  };
  
  // Helper function to build a query with all the necessary filters
  const buildFilteredQuery = (filters: TransactionFilters, searchTerm: string) => {
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
  
  return {
    filtersChanged,
    updateRefs,
    buildFilteredQuery,
    PER_PAGE
  };
}
