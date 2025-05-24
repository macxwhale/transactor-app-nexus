
import React, { memo } from "react";
import { TransactionTable } from "./TransactionTable";
import { Transaction, Application } from "@/lib/api";

interface MemoizedTransactionTableProps {
  transactions: Transaction[];
  applications: Application[];
  isLoading: boolean;
  isRefreshing?: boolean;
  onRefresh: () => void;
  onViewDetails: (tx: Transaction) => void;
  error?: string | null;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
  };
}

// Memoized transaction table to prevent unnecessary re-renders
const MemoizedTransactionTable = memo(function MemoizedTransactionTable({
  transactions,
  applications,
  isLoading,
  isRefreshing = false,
  onRefresh,
  onViewDetails,
  error,
  pagination,
}: MemoizedTransactionTableProps) {
  return (
    <TransactionTable
      transactions={transactions}
      applications={applications}
      isLoading={isLoading}
      isRefreshing={isRefreshing}
      onRefresh={onRefresh}
      onViewDetails={onViewDetails}
      error={error}
      pagination={pagination}
    />
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.transactions.length === nextProps.transactions.length &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.isRefreshing === nextProps.isRefreshing &&
    prevProps.error === nextProps.error &&
    prevProps.pagination?.currentPage === nextProps.pagination?.currentPage &&
    prevProps.pagination?.totalPages === nextProps.pagination?.totalPages
  );
});

export default MemoizedTransactionTable;
