
import { useEffect } from "react";
import { useTransactionState } from "./useTransactionState";
import { useApplicationsList } from "./useApplicationsList";
import { useTransactionFetcher } from "./useTransactionFetcher";
import { useTransactionPagination } from "./useTransactionPagination";
import { useTransactionFilters } from "./useTransactionFilters";
import { Transaction } from "@/lib/api";

export function useTransactions() {
  const {
    transactions,
    setTransactions,
    isLoading,
    setIsLoading,
    selectedTx,
    setSelectedTx,
    isInitialized,
    setIsInitialized
  } = useTransactionState();

  const { applications } = useApplicationsList();
  const { searchTerm, filters, setSearchTerm, setFilters, resetFilters } = useTransactionFilters();
  
  const { 
    transactions: fetchedTransactions, 
    isLoading: isFetching,
    isRefreshing,
    error,
    fetchTransactions
  } = useTransactionFetcher(applications);
  
  // Effect to update transactions when fetched
  useEffect(() => {
    setTransactions(fetchedTransactions);
  }, [fetchedTransactions, setTransactions]);
  
  // Effect to control loading state
  useEffect(() => {
    setIsLoading(isFetching);
  }, [isFetching, setIsLoading]);
  
  // Fetch data when applications load, but only on first load
  useEffect(() => {
    if (applications.length > 0 && !isInitialized) {
      fetchTransactions(false);
      setIsInitialized(true);
    }
  }, [applications.length, isInitialized, fetchTransactions, setIsInitialized]);

  // Apply filters and search to transactions
  const filteredTransactions = applyFilters(transactions, searchTerm, filters);

  // Use pagination with filtered transactions
  const {
    currentPage,
    totalPages,
    setCurrentPage,
    paginatedTransactions,
    totalItems
  } = useTransactionPagination(filteredTransactions);

  const refreshData = () => {
    fetchTransactions(true);
  };

  return {
    // Return paginated transactions for display
    transactions: paginatedTransactions,
    applications,
    isLoading,
    isRefreshing,
    error,
    selectedTx,
    setSelectedTx,
    // Search and filters
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    resetFilters,
    // Actions
    fetchData: refreshData,
    // Pagination
    currentPage,
    totalPages,
    setCurrentPage,
    totalItems
  };
}

function applyFilters(
  transactions: Transaction[],
  searchTerm: string,
  filters: { status: string; applicationId: string; startDate: string; endDate: string }
): Transaction[] {
  return transactions.filter(tx => {
    // First apply search term
    const matchesSearch = !searchTerm.trim() || [
      tx.mpesa_receipt_number,
      tx.phone_number,
      tx.account_reference,
      tx.application_name
    ].some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()));

    // Then apply filters
    const matchesStatus = filters.status === "all" || tx.status === filters.status;
    const matchesApp = filters.applicationId === "all" || tx.application_id === filters.applicationId;
    
    // Date filtering
    const txDate = tx.transaction_date ? new Date(tx.transaction_date) : null;
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;
    
    const matchesDateRange = (
      !startDate || !txDate || txDate >= startDate
    ) && (
      !endDate || !txDate || txDate <= new Date(endDate.setHours(23, 59, 59, 999))
    );

    return matchesSearch && matchesStatus && matchesApp && matchesDateRange;
  });
}
