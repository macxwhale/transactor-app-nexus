
import { useApplicationsList } from "./useApplicationsList";
import { useTransactionFilters } from "./useTransactionFilters";
import { usePagination } from "./usePagination";
import { useTransactionData } from "./useTransactionData";

export function useTransactions() {
  const { applications } = useApplicationsList();
  const { searchTerm, filters, setSearchTerm, setFilters } = useTransactionFilters();
  const { currentPage, totalPages, setCurrentPage } = usePagination();
  const { 
    transactions, 
    isLoading, 
    selectedTx, 
    setSelectedTx, 
    fetchData,
    error
  } = useTransactionData();

  return {
    transactions,
    applications,
    isLoading,
    currentPage,
    totalPages,
    selectedTx,
    filters,
    error,
    setCurrentPage,
    setSearchTerm,
    setFilters,
    setSelectedTx,
    fetchData
  };
}
