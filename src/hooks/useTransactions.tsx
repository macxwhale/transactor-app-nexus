
import { useState, useEffect } from "react";
import { Transaction, Application, fetchTransactions } from "@/lib/api";
import { generateMockApplications, generateMockTransactions } from "@/lib/utils";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    applicationId: "",
    startDate: "",
    endDate: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would call the API
      // const apps = await fetchApplications();
      // const response = await fetchTransactions(currentPage, {
      //   search: searchTerm,
      //   startDate: filters.startDate,
      //   endDate: filters.endDate,
      //   status: filters.status,
      //   applicationId: filters.applicationId ? parseInt(filters.applicationId) : undefined,
      // });

      // For demo purposes, we'll use mock data
      const apps = generateMockApplications(10);
      setApplications(apps);
      
      let mockTransactions = generateMockTransactions(100, apps);
      
      // Apply filters
      if (filters.status) {
        mockTransactions = mockTransactions.filter(tx => tx.status === filters.status);
      }
      
      if (filters.applicationId) {
        mockTransactions = mockTransactions.filter(tx => tx.application_id === parseInt(filters.applicationId));
      }
      
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        mockTransactions = mockTransactions.filter(tx => new Date(tx.transaction_date) >= startDate);
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999); // End of day
        mockTransactions = mockTransactions.filter(tx => new Date(tx.transaction_date) <= endDate);
      }
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        mockTransactions = mockTransactions.filter(tx => 
          tx.mpesa_receipt_number.toLowerCase().includes(term) || 
          tx.phone_number.toLowerCase().includes(term)
        );
      }
      
      // Pagination
      const perPage = 10;
      const totalItems = mockTransactions.length;
      const totalPgs = Math.ceil(totalItems / perPage);
      
      setTotalPages(totalPgs);
      
      // Get current page items
      const startIndex = (currentPage - 1) * perPage;
      const paginatedTransactions = mockTransactions.slice(startIndex, startIndex + perPage);
      
      setTransactions(paginatedTransactions);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, filters]);

  return {
    transactions,
    applications,
    isLoading,
    currentPage,
    totalPages,
    selectedTx,
    filters,
    setCurrentPage,
    setSearchTerm,
    setFilters,
    setSelectedTx,
    fetchData
  };
}
