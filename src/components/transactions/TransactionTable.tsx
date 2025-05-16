
import React from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Transaction, Application } from "@/lib/api";
import { getTransactionColumns } from "./TransactionColumns";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionTableHeader } from "./TransactionTableHeader";
import { TransactionErrorDisplay } from "./TransactionErrorDisplay";
import { exportTransactions } from "./TransactionExporter";

interface TransactionTableProps {
  transactions: Transaction[];
  applications: Application[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  filters: {
    status: string;
    applicationId: string;
    startDate: string;
    endDate: string;
  };
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  onFilterChange: (filters: any) => void;
  onRefresh: () => void;
  onViewDetails: (tx: Transaction) => void;
  error?: string | null;
}

export function TransactionTable({
  transactions,
  applications,
  isLoading,
  currentPage,
  totalPages,
  totalItems,
  filters,
  onPageChange,
  onSearch,
  onFilterChange,
  onRefresh,
  onViewDetails,
  error,
}: TransactionTableProps) {
  const columns = getTransactionColumns(onViewDetails);

  const handleExport = () => {
    exportTransactions(filters, applications);
  };

  return (
    <Card>
      <TransactionTableHeader 
        totalItems={totalItems} 
        onRefresh={onRefresh} 
        onExport={handleExport} 
        isLoading={isLoading} 
      />
      
      <CardContent>
        <TransactionFilters
          filters={filters}
          applications={applications}
          onFilterChange={onFilterChange}
        />

        <TransactionErrorDisplay error={error} />

        <DataTable
          data={transactions}
          columns={columns}
          searchPlaceholder="Search by receipt number or phone..."
          onSearch={onSearch}
          pagination={{
            currentPage,
            totalPages,
            totalItems,
            onPageChange,
          }}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
