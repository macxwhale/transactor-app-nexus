import React, { useState } from "react";
import { FocusManager } from "@/components/accessibility/FocusManager";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import MemoizedTransactionTable from "@/components/transactions/MemoizedTransactionTable";
import { TransactionDetailsDialog } from "@/components/transactions/TransactionDetailsDialog";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { Transaction } from "@/lib/api";
import { useC2BTransactions } from "@/hooks/useC2BTransactions";

export default function C2BTransactions() {
  const {
    transactions,
    applications,
    isLoading,
    isRefreshing,
    error,
    selectedTx,
    setSelectedTx,
    fetchData,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    resetFilters,
    currentPage,
    totalPages,
    setCurrentPage,
    totalItems,
  } = useC2BTransactions();

  return (
    <FocusManager>
      <SkipToContent />
      <div className="space-y-6" id="main-content">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">C2B Transactions</h1>
          <p className="text-muted-foreground mt-2">
            Customer to Business payment transactions
          </p>
        </div>

        <TransactionFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFiltersChange={setFilters}
          onResetFilters={resetFilters}
          applications={applications}
        />

        <MemoizedTransactionTable
          transactions={transactions}
          applications={applications}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          onRefresh={fetchData}
          onViewDetails={setSelectedTx}
          error={error}
          pagination={{
            currentPage,
            totalPages,
            onPageChange: setCurrentPage,
            totalItems,
          }}
        />

        <TransactionDetailsDialog
          transaction={selectedTx}
          open={!!selectedTx}
          onOpenChange={(open) => !open && setSelectedTx(null)}
        />
      </div>
    </FocusManager>
  );
}
