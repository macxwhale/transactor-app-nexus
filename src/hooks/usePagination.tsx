
import { useState } from "react";

export function usePagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  return {
    currentPage,
    totalPages,
    setCurrentPage,
    setTotalPages,
  };
}
