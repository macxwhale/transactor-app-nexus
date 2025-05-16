
import { useApplicationsList } from "./useApplicationsList";
import { useTransactionData } from "./useTransactionData";

export function useTransactions() {
  const { applications } = useApplicationsList();
  const { 
    transactions, 
    isLoading, 
    selectedTx, 
    setSelectedTx, 
    fetchData,
    error,
    filters,
    setSearchTerm,
    setFilters
  } = useTransactionData();

  return {
    transactions,
    applications,
    isLoading,
    selectedTx,
    filters,
    error,
    setSearchTerm,
    setFilters,
    setSelectedTx,
    fetchData
  };
}
