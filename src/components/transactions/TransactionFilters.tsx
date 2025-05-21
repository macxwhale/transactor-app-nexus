
import React from "react";
import TransactionSearch from "./TransactionSearch";

interface TransactionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function TransactionFilters({ searchTerm, onSearchChange }: TransactionFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      <div>
        <h3 className="text-lg font-medium">Transaction List</h3>
        <p className="text-sm text-muted-foreground">Search and view transactions</p>
      </div>
      
      <TransactionSearch 
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />
    </div>
  );
}
