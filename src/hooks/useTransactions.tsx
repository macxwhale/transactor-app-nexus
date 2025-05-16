
import { useApplicationsList } from "./useApplicationsList";
import { useTransactionFilters } from "./useTransactionFilters";
import { usePagination } from "./usePagination";
import { useTransactionData } from "./useTransactionData";
import { useCallback } from "react";

export function useTransactions() {
  const { applications } = useApplicationsList();
  const { searchTerm, filters, setSearchTerm, setFilters } = useTransactionFilters();
  const { currentPage, totalPages, totalItems, setCurrentPage } = usePagination();
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
    setCurrentPage(1); // Reset to first page when filters change
  }, [setFilters, setCurrentPage]);

  return {
    transactions,
    applications,
    isLoading,
    currentPage,
    totalPages,
    totalItems,
    selectedTx,
    filters,
    error,
    setCurrentPage,
    setSearchTerm,
    setFilters: handleFilterChange,
    setSelectedTx,
    fetchData
  };
}
