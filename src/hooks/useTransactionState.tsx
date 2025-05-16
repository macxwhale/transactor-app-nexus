
import { useState } from "react";
import { Transaction } from "@/lib/api";

export function useTransactionState() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // No filtering logic, just return all transactions
  const filteredTransactions = transactions;

  return {
    transactions,
    setTransactions,
    isLoading,
    setIsLoading,
    selectedTx,
    setSelectedTx,
    filteredTransactions,
    isInitialized,
    setIsInitialized
  };
}
