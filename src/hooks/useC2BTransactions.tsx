import { useState, useEffect, useMemo, useCallback } from "react";
import { Transaction } from "@/lib/api";
import { useTransactionState } from "./useTransactionState";
import { useApplicationsList } from "./useApplicationsList";
import { useTransactionFilters } from "./useTransactionFilters";
import { useTransactionPagination } from "./useTransactionPagination";
import { fetchC2BTransactionsFromSupabase } from "@/services/c2bTransactionService";

export function useC2BTransactions() {
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const data = await fetchC2BTransactionsFromSupabase();
      
      // Map application names to transactions
      const transactionsWithAppNames = data.map(tx => ({
        ...tx,
        application_name: applications.find(app => app.app_id === tx.application_id)?.name || 'Unknown'
      }));

      setTransactions(transactionsWithAppNames);
      setIsInitialized(true);
    } catch (err) {
      console.error("Error fetching C2B transactions:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch transactions");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [applications, setTransactions, setIsLoading, setIsInitialized]);

  // Fetch data on mount and when applications change
  useEffect(() => {
    if (!isInitialized || applications.length > 0) {
      fetchTransactions();
    }
  }, [applications.length]);

  const fetchData = useCallback(() => {
    fetchTransactions(true);
  }, [fetchTransactions]);

  // Apply filters
  const filteredTransactions = useMemo(() => {
    return applyFilters(transactions, searchTerm, filters, applications);
  }, [transactions, searchTerm, filters, applications]);

  // Pagination
  const { 
    currentPage, 
    totalPages, 
    setCurrentPage, 
    paginatedTransactions,
    totalItems 
  } = useTransactionPagination(filteredTransactions);

  return {
    transactions: paginatedTransactions,
    applications,
    isLoading,
    isRefreshing,
    error,
    selectedTx,
    setSelectedTx,
    fetchData,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    resetFilters,
    currentPage,
    totalPages,
    setCurrentPage,
    totalItems,
  };
}

// Filter logic
function applyFilters(
  transactions: Transaction[],
  searchTerm: string,
  filters: { status: string; applicationId: string; startDate: string; endDate: string },
  applications: any[] = []
) {
  let filtered = [...transactions];

  // Search filter
  if (searchTerm) {
    const search = searchTerm.toLowerCase();
    filtered = filtered.filter((tx) =>
      tx.mpesa_receipt_number?.toLowerCase().includes(search) ||
      tx.phone_number?.toLowerCase().includes(search) ||
      tx.account_reference?.toLowerCase().includes(search) ||
      tx.application_name?.toLowerCase().includes(search)
    );
  }

  // Status filter
  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((tx) => tx.status === filters.status);
  }

  // Application filter
  if (filters.applicationId && filters.applicationId !== "all") {
    filtered = filtered.filter((tx) => tx.application_id === filters.applicationId);
  }

  // Date range filter
  if (filters.startDate) {
    const startDate = new Date(filters.startDate).getTime();
    filtered = filtered.filter((tx) => {
      const txDate = new Date(tx.transaction_date).getTime();
      return txDate >= startDate;
    });
  }

  if (filters.endDate) {
    const endDate = new Date(filters.endDate).getTime();
    filtered = filtered.filter((tx) => {
      const txDate = new Date(tx.transaction_date).getTime();
      return txDate <= endDate;
    });
  }

  return filtered;
}
