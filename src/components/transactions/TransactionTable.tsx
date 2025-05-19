
import React from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Transaction, Application } from "@/lib/api";
import { getTransactionColumns } from "./TransactionColumns";
import { TransactionTableHeader } from "./TransactionTableHeader";
import { TransactionErrorDisplay } from "./TransactionErrorDisplay";

interface TransactionTableProps {
  transactions: Transaction[];
  applications: Application[];
  isLoading: boolean;
  isRefreshing?: boolean;
  onRefresh: () => void;
  onViewDetails: (tx: Transaction) => void;
  error?: string | null;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
  };
}

export function TransactionTable({
  transactions,
  applications,
  isLoading,
  isRefreshing = false,
  onRefresh,
  onViewDetails,
  error,
  pagination,
}: TransactionTableProps) {
  const columns = getTransactionColumns(onViewDetails);

  return (
    <Card>
      <TransactionTableHeader 
        onRefresh={onRefresh} 
        onExport={() => {}} 
        isLoading={isRefreshing} 
      />
      
      <CardContent>
        <TransactionErrorDisplay error={error} />

        <DataTable
          data={transactions}
          columns={columns}
          isLoading={isLoading}
          pagination={pagination}
        />
      </CardContent>
    </Card>
  );
}
