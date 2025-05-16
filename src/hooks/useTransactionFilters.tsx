
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
  const [filterState, setFilterState] = useState<FilterState>({
    searchTerm: "",
    filters: {
      status: "",
      applicationId: "",
      startDate: "",
      endDate: "",
    }
  });

  const setSearchTerm = (term: string) => {
    setFilterState(prev => ({ ...prev, searchTerm: term }));
  };

  const setFilters = (newFilters: TransactionFilters) => {
    setFilterState(prev => ({ ...prev, filters: newFilters }));
  };

  return {
    searchTerm: filterState.searchTerm,
    filters: filterState.filters,
    setSearchTerm,
    setFilters,
  };
}
