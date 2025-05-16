
import { useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VALID_STATUSES } from "@/utils/transactionUtils";

interface TransactionFilters {
  status: string;
  applicationId: string;
  startDate: string;
  endDate: string;
}

export function useTransactionQueries() {
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
      // Use OR filter for searching in different fields
      query = query.or(`mpesa_receipt_number.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%`);
      console.log(`Adding search filter: ${searchTerm}`);
    }
    
    return query;
  };
  
  return {
    buildFilteredQuery
  };
}
