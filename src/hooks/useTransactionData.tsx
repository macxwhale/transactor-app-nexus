
import { useState, useEffect, useCallback } from "react";
import { Transaction } from "@/lib/api";
import { useApplicationsList } from "./useApplicationsList";
import { useTransactionFetcher } from "./useTransactionFetcher";

export function useTransactionData() {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  
  const { applications } = useApplicationsList();
  
  const { 
    transactions, 
    isLoading, 
    error,
    fetchTransactions
  } = useTransactionFetcher(applications);

  // Memoize the fetchData function to prevent unnecessary rerenders
  const fetchData = useCallback(() => {
    if (applications.length > 0) { // Only fetch if applications are loaded
      fetchTransactions();
    }
  }, [applications, fetchTransactions]);

  // Fetch data when applications load
  useEffect(() => {
    if (applications.length === 0) {
      return; // Don't try to fetch if no applications loaded yet
    }
    
    fetchData();
  }, [applications.length, fetchData]);

  return {
    transactions,
    isLoading,
    error,
    selectedTx,
    setSelectedTx,
    fetchData,
    // Provide empty filter properties to satisfy interfaces
    filters: {
      status: "",
      applicationId: "",
      startDate: "",
      endDate: ""
    },
    setSearchTerm: () => {},
    setFilters: () => {}
  };
}
