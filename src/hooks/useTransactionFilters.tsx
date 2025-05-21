
import { useState } from "react";

export interface TransactionFilters {
  status: string;
  applicationId: string;
  startDate: string;
  endDate: string;
}

export interface FilterState {
  searchTerm: string;
  filters: TransactionFilters;
}

export function useTransactionFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<TransactionFilters>({
    status: "all",
    applicationId: "all",
    startDate: "",
    endDate: "",
  });

  const resetFilters = () => {
    setFilters({
      status: "all",
      applicationId: "all",
      startDate: "",
      endDate: "",
    });
  };

  return {
    searchTerm,
    filters,
    setSearchTerm,
    setFilters,
    resetFilters,
  };
}
