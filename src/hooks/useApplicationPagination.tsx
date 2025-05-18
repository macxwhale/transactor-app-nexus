
import { useState, useEffect, useMemo } from "react";
import { Application } from "@/lib/api";

interface PaginationOptions {
  itemsPerPage?: number;
}

export function useApplicationPagination(applications: Application[], options: PaginationOptions = {}) {
  const { itemsPerPage = 10 } = options;
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate total pages based on applications length
  const totalPages = useMemo(() => 
    Math.max(1, Math.ceil(applications.length / itemsPerPage)),
    [applications.length, itemsPerPage]
  );

  // Ensure current page is valid when total pages changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Calculate paginated applications
  const paginatedApplications = useMemo(() => 
    applications.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ),
    [applications, currentPage, itemsPerPage]
  );

  return {
    currentPage,
    totalPages,
    setCurrentPage,
    paginatedApplications,
    totalItems: applications.length,
  };
}
