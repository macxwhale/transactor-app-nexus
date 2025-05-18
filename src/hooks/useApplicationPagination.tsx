
import { useState, useEffect } from "react";
import { Application } from "@/lib/api";

const ITEMS_PER_PAGE = 10;

export function useApplicationPagination(applications: Application[]) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Calculate total pages when applications change
  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(applications.length / ITEMS_PER_PAGE)));
  }, [applications]);

  // Reset to first page when application count changes significantly
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedApplications = applications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return {
    currentPage,
    totalPages,
    setCurrentPage,
    paginatedApplications,
  };
}
