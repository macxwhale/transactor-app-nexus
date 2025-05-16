
import { useApplicationsList } from "./useApplicationsList";
import { useTransactionFilters } from "./useTransactionFilters";
import { usePagination } from "./usePagination";
import { useTransactionData } from "./useTransactionData";

export function useTransactions() {
  const { applications } = useApplicationsList();
  const { searchTerm, filters, setSearchTerm, setFilters } = useTransactionFilters();
  const { currentPage, totalPages, setCurrentPage } = usePagination();
  const { transactions, isLoading, selectedTx, setSelectedTx, fetchData } = useTransactionData();

  return {
    transactions,
    applications,
    isLoading,
    currentPage,
    totalPages,
    selectedTx,
    filters,
    setCurrentPage,
    setSearchTerm,
    setFilters,
    setSelectedTx,
    fetchData
  };
}
