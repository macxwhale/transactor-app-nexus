
import React from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionDetailsDialog } from "@/components/transactions/TransactionDetailsDialog";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";

const Transactions = () => {
  const {
    transactions,
    applications,
    isLoading,
    isRefreshing,
    error,
    selectedTx,
    setSelectedTx,
    fetchData,
    // Search properties
    searchTerm,
    setSearchTerm,
    // Pagination properties
    currentPage,
    totalPages,
    setCurrentPage,
    totalItems
  } = useTransactions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
      </div>

      <TransactionFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <TransactionTable
        transactions={transactions}
        applications={applications}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        error={error}
        onRefresh={fetchData}
        onViewDetails={setSelectedTx}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
          totalItems
        }}
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
