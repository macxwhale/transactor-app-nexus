
import { useState } from "react";
import { Transaction } from "@/lib/api";
import { useTransactionSearch } from "./useTransactionSearch";

export function useTransactionState() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Use the transaction search hook
  const { searchTerm, setSearchTerm, filteredTransactions } = useTransactionSearch(transactions);

  return {
    transactions,
    setTransactions,
    isLoading,
    setIsLoading,
    selectedTx,
    setSelectedTx,
    searchTerm,
    setSearchTerm,
    filteredTransactions,
    isInitialized,
    setIsInitialized
  };
}
