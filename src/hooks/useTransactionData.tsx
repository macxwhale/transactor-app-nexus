
import { useState, useEffect, useRef } from "react";
import { Transaction } from "@/lib/api";
import { useApplicationsList } from "./useApplicationsList";
import { useTransactionFilters } from "./useTransactionFilters";
import { usePagination } from "./usePagination";
import { useTransactionFetcher } from "./useTransactionFetcher";

export function useTransactionData() {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  
  const { applications } = useApplicationsList();
  const { searchTerm, filters } = useTransactionFilters();
  const { currentPage, setTotalPages, setTotalItems } = usePagination();
  
  const { 
    transactions, 
    isLoading, 
    error,
    fetchTransactions
  } = useTransactionFetcher(applications);

  // Fetch data when filters, search, or page changes
  useEffect(() => {
    // Create a debounce mechanism for search
    const searchTimer = setTimeout(() => {
      fetchTransactions(currentPage, searchTerm, filters, setTotalItems, setTotalPages);
    }, searchTerm ? 300 : 0);
    
    return () => clearTimeout(searchTimer);
  }, [currentPage, searchTerm, filters.status, filters.applicationId, filters.startDate, filters.endDate, applications.length]);

  // Wrapper function to allow manual refresh
  const fetchData = () => {
    fetchTransactions(currentPage, searchTerm, filters, setTotalItems, setTotalPages);
  };

  return {
    transactions,
    isLoading,
    error,
    selectedTx,
    setSelectedTx,
    fetchData
  };
}
