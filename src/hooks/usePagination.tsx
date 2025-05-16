
import { useState } from "react";

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number; // Added to track total number of records
}

export function usePagination(initialPage = 1) {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    currentPage: initialPage,
    totalPages: 1,
    totalItems: 0, // Initialize with 0
  });

  const setCurrentPage = (page: number) => {
    setPaginationState(prev => {
      console.log(`Pagination: Changing page from ${prev.currentPage} to ${page}`);
      return { ...prev, currentPage: page };
    });
  };

  const setTotalPages = (total: number) => {
    setPaginationState(prev => {
      console.log(`Pagination: Setting total pages to ${total}`);
      return { ...prev, totalPages: total };
    });
  };
  
  const setTotalItems = (total: number) => {
    setPaginationState(prev => {
      console.log(`Pagination: Setting total items to ${total}`);
      return { ...prev, totalItems: total };
    });
  };

  return {
    ...paginationState,
    setCurrentPage,
    setTotalPages,
    setTotalItems,
  };
}
