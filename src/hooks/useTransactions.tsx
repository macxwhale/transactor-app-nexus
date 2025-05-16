
import { useEffect } from "react";
import { fetchTransactionsFromSupabase } from "@/services/transactionSupabaseService";
import { useTransactionState } from "./useTransactionState";
import { useApplicationsList } from "./useApplicationsList";
import { Application, Transaction } from "@/lib/api";

export function useTransactions() {
  const {
    transactions,
    setTransactions,
    isLoading,
    setIsLoading,
    selectedTx,
    setSelectedTx,
    filteredTransactions
  } = useTransactionState();

  const { applications } = useApplicationsList();

  const fetchTxs = async () => {
    setIsLoading(true);
    const txs = await fetchTransactionsFromSupabase();
    
    // Populate application names
    const txsWithAppNames = txs.map((tx) => {
      const app = applications.find((app) => app.id === tx.application_id);
      return {
        ...tx,
        application_name: app ? app.name : `App ID: ${tx.application_id}`
      };
    });
    
    setTransactions(txsWithAppNames);
    setIsLoading(false);
  };

  // Fetch transactions on component mount and whenever applications list changes
  useEffect(() => {
    if (applications.length > 0) { // Only fetch if applications are loaded
      fetchTxs();
    }
  }, [applications.length]);

  return {
    transactions: filteredTransactions,
    applications,
    isLoading,
    selectedTx,
    setSelectedTx,
    fetchData: fetchTxs
  };
}
