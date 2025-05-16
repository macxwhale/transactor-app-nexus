
import { useApplicationsList } from "./useApplicationsList";
import { useTransactionFilters } from "./useTransactionFilters";
import { useTransactionData } from "./useTransactionData";
import { useCallback } from "react";

export function useTransactions() {
  const { applications } = useApplicationsList();
  const { searchTerm, filters, setSearchTerm, setFilters } = useTransactionFilters();
  const { 
    transactions, 
    isLoading, 
    selectedTx, 
    setSelectedTx, 
    fetchData,
    error
  } = useTransactionData();

  // Memoize the filter change handler to prevent unnecessary rerenders
  const handleFilterChange = useCallback((newFilters: any) => {
    console.log("Filter change detected:", newFilters);
    setFilters(newFilters);
  }, [setFilters]);

  return {
    transactions,
    applications,
    isLoading,
    selectedTx,
    filters,
    error,
    setSearchTerm,
    setFilters: handleFilterChange,
    setSelectedTx,
    fetchData
  };
}
