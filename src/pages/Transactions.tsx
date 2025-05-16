
import React, { useEffect } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionDetailsDialog } from "@/components/transactions/TransactionDetailsDialog";

const Transactions = () => {
  const {
    transactions,
    applications,
    isLoading,
    selectedTx,
    setSelectedTx,
    fetchData
  } = useTransactions();

  // Force initial fetch when component mounts
  useEffect(() => {
    console.log("Transactions page mounted, fetching data...");
    // Small delay to ensure all hooks are initialized
    const timer = setTimeout(() => {
      fetchData();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [fetchData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
      </div>

      <TransactionTable
        transactions={transactions}
        applications={applications}
        isLoading={isLoading}
        error={null}
        onRefresh={() => {
          fetchData();
        }}
        onViewDetails={setSelectedTx}
      />

      <TransactionDetailsDialog
        transaction={selectedTx}
        open={!!selectedTx}
        onOpenChange={(open) => !open && setSelectedTx(null)}
      />
    </div>
  );
}

export default Transactions;
