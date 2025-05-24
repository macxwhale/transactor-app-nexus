
import React from "react";
import { useTransactions } from "@/hooks/useTransactions";
import MemoizedTransactionTable from "@/components/transactions/MemoizedTransactionTable";
import { TransactionDetailsDialog } from "@/components/transactions/TransactionDetailsDialog";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { FocusManager } from "@/components/accessibility/FocusManager";

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
    // Filter properties
    filters,
    setFilters,
    resetFilters,
    // Pagination properties
    currentPage,
    totalPages,
    setCurrentPage,
    totalItems
  } = useTransactions();

  return (
    <FocusManager autoFocus>
      <SkipToContent />
      <div className="space-y-6" role="main" id="main-content" tabIndex={-1}>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight" id="page-title">
            Transactions
          </h1>
        </div>

        <section aria-labelledby="filters-heading">
          <h2 id="filters-heading" className="sr-only">Transaction Filters</h2>
          <TransactionFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFiltersChange={setFilters}
            applications={applications}
            onResetFilters={resetFilters}
          />
        </section>

        <section 
          aria-labelledby="transactions-heading" 
          aria-describedby="transactions-description"
        >
          <h2 id="transactions-heading" className="sr-only">Transactions Table</h2>
          <p id="transactions-description" className="sr-only">
            Table displaying M-Pesa transactions with pagination and filtering options
          </p>
          
          <MemoizedTransactionTable
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
        </section>

        <TransactionDetailsDialog
          transaction={selectedTx}
          open={!!selectedTx}
          onOpenChange={(open) => !open && setSelectedTx(null)}
        />
      </div>
    </FocusManager>
  );
}

export default Transactions;
