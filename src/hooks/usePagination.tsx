
import { useState } from "react";

export interface PaginationState {
  currentPage: number;
  totalPages: number;
}

export function usePagination(initialPage = 1) {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    currentPage: initialPage,
    totalPages: 1,
  });

  const setCurrentPage = (page: number) => {
    setPaginationState(prev => ({ ...prev, currentPage: page }));
  };

  const setTotalPages = (total: number) => {
    setPaginationState(prev => ({ ...prev, totalPages: total }));
  };

  return {
    ...paginationState,
    setCurrentPage,
    setTotalPages,
  };
}
