
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
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return applications.slice(startIndex, endIndex);
  }, [applications, currentPage, itemsPerPage]);

  // Log pagination info for debugging
  useEffect(() => {
    console.log(`Pagination: Page ${currentPage} of ${totalPages}, showing ${paginatedApplications.length} of ${applications.length} applications`);
  }, [currentPage, totalPages, paginatedApplications.length, applications.length]);

  return {
    currentPage,
    totalPages,
    setCurrentPage,
    paginatedApplications,
    totalItems: applications.length,
  };
}
