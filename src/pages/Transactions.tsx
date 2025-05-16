
import React, { useEffect } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionDetailsDialog } from "@/components/transactions/TransactionDetailsDialog";

const Transactions = () => {
  const {
    transactions,
    applications,
    isLoading,
    currentPage,
    totalPages,
    totalItems,
    selectedTx,
    filters,
    error,
    setCurrentPage,
    setSearchTerm,
    setFilters,
    setSelectedTx,
    fetchData
  } = useTransactions();

  // Force initial fetch when component mounts
  useEffect(() => {
    console.log("Transactions page mounted, fetching data...");
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
      </div>

      <TransactionTable
        transactions={transactions}
        applications={applications}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        filters={filters}
        error={error}
        onPageChange={setCurrentPage}
        onSearch={setSearchTerm}
        onFilterChange={setFilters}
        onRefresh={() => {
          setCurrentPage(1);
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
