
import { useState, useEffect, useMemo } from "react";
import { Transaction } from "@/lib/api";

interface PaginationOptions {
  itemsPerPage?: number;
}

export function useTransactionPagination(transactions: Transaction[], options: PaginationOptions = {}) {
  const { itemsPerPage = 10 } = options;
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate total pages based on transactions length
  const totalPages = useMemo(() => 
    Math.max(1, Math.ceil(transactions.length / itemsPerPage)),
    [transactions.length, itemsPerPage]
  );

  // Ensure current page is valid when total pages changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Calculate paginated transactions
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return transactions.slice(startIndex, endIndex);
  }, [transactions, currentPage, itemsPerPage]);

  // Log pagination info for debugging
  useEffect(() => {
    console.log(`Transaction Pagination: Page ${currentPage} of ${totalPages}, showing ${paginatedTransactions.length} of ${transactions.length} transactions`);
  }, [currentPage, totalPages, paginatedTransactions.length, transactions.length]);

  return {
    currentPage,
    totalPages,
    setCurrentPage,
    paginatedTransactions,
    totalItems: transactions.length,
  };
}
