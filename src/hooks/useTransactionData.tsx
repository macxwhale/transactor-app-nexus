
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
  } = useTransactionFetcher();

  // Memoize the fetchData function to prevent unnecessary rerenders
  const fetchData = useCallback(() => {
    console.log("Fetching transaction data...");
    fetchTransactions();
  }, [fetchTransactions]);

  // Fetch data immediately on component mount
  useEffect(() => {
    console.log("useTransactionData initialized, fetching data...");
    fetchData();
  }, [fetchData]);

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
