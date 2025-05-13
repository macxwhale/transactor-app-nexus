
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Transaction, Application } from "@/lib/api";
import { Download, RefreshCcw } from "lucide-react";
import { TransactionFilters } from "./TransactionFilters";
import { getTransactionColumns } from "./TransactionColumns";
import { toast } from "sonner";

interface TransactionTableProps {
  transactions: Transaction[];
  applications: Application[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
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
}

export function TransactionTable({
  transactions,
  applications,
  isLoading,
  currentPage,
  totalPages,
  filters,
  onPageChange,
  onSearch,
  onFilterChange,
  onRefresh,
  onViewDetails,
}: TransactionTableProps) {
  const columns = getTransactionColumns(onViewDetails);

  const handleExport = () => {
    toast.success("Export started. Your file will be ready for download shortly.");
    // In a real app, this would trigger an API call to generate and download a report
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            View and filter all your M-Pesa transactions
          </CardDescription>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="gap-1"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <TransactionFilters
          filters={filters}
          applications={applications}
          onFilterChange={onFilterChange}
        />

        <DataTable
          data={transactions}
          columns={columns}
          searchPlaceholder="Search by receipt number or phone..."
          onSearch={onSearch}
          pagination={{
            currentPage,
            totalPages,
            onPageChange,
          }}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
