
import { useState, useEffect, useCallback } from "react";
import { Transaction } from "@/lib/api";
import { useApplicationsList } from "./useApplicationsList";
import { useTransactionFilters } from "./useTransactionFilters";
import { useTransactionFetcher } from "./useTransactionFetcher";

export function useTransactionData() {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  
  const { applications } = useApplicationsList();
  const { searchTerm, filters } = useTransactionFilters();
  
  const { 
    transactions, 
    isLoading, 
    error,
    fetchTransactions
  } = useTransactionFetcher(applications);

  // Memoize the fetchData function to prevent unnecessary rerenders
  const fetchData = useCallback(() => {
    if (applications.length > 0) { // Only fetch if applications are loaded
      fetchTransactions(searchTerm, filters);
    }
  }, [searchTerm, filters, applications, fetchTransactions]);

  // Fetch data when filters or search changes, but only if applications are loaded
  useEffect(() => {
    if (applications.length === 0) {
      return; // Don't try to fetch if no applications loaded yet
    }
    
    // Create a debounce mechanism for search
    const searchTimer = setTimeout(() => {
      fetchData();
    }, searchTerm ? 300 : 0);
    
    return () => clearTimeout(searchTimer);
  }, [searchTerm, filters, applications.length, fetchData]);

  return {
    transactions,
    isLoading,
    error,
    selectedTx,
    setSelectedTx,
    fetchData
  };
}
