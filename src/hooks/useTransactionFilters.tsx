
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
    status: "",
    applicationId: "",
    startDate: "",
    endDate: "",
  });

  const resetFilters = () => {
    setFilters({
      status: "",
      applicationId: "",
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
