
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
  // Return empty objects since we're not filtering anymore
  return {
    searchTerm: "",
    filters: {
      status: "",
      applicationId: "",
      startDate: "",
      endDate: "",
    },
    setSearchTerm: () => {},
    setFilters: () => {},
  };
}
