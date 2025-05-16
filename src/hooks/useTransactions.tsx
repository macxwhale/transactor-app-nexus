
import { useEffect } from "react";
import { useTransactionState } from "./useTransactionState";
import { useApplicationsList } from "./useApplicationsList";
import { useTransactionFetcher } from "./useTransactionFetcher";

export function useTransactions() {
  const {
    setTransactions,
    isLoading,
    setIsLoading,
    selectedTx,
    setSelectedTx,
    filteredTransactions,
    isInitialized,
    setIsInitialized
  } = useTransactionState();

  const { applications } = useApplicationsList();
  
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
  }, [applications.length, isInitialized]);

  const refreshData = () => {
    // When manually refreshing, we want to see the refresh state
    fetchTransactions(true);
  };

  return {
    transactions: filteredTransactions,
    applications,
    isLoading,
    isRefreshing,
    error,
    selectedTx,
    setSelectedTx,
    fetchData: refreshData
  };
}
