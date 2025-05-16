
import { useState } from "react";

export interface TransactionFilters {
  status: string;
  applicationId: string;
  startDate: string;
  endDate: string;
}

export function useTransactionFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<TransactionFilters>({
    status: "",
    applicationId: "",
    startDate: "",
    endDate: "",
  });

  return {
    searchTerm,
    filters,
    setSearchTerm,
    setFilters,
  };
}
