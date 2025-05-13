
import React from "react";
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
    selectedTx,
    filters,
    setCurrentPage,
    setSearchTerm,
    setFilters,
    setSelectedTx,
    fetchData
  } = useTransactions();

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
        filters={filters}
        onPageChange={setCurrentPage}
        onSearch={setSearchTerm}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
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
};

export default Transactions;
