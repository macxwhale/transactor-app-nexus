
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
  onRefresh: () => void;
  onViewDetails: (tx: Transaction) => void;
  error?: string | null;
}

export function TransactionTable({
  transactions,
  applications,
  isLoading,
  onRefresh,
  onViewDetails,
  error,
}: TransactionTableProps) {
  const columns = getTransactionColumns(onViewDetails);

  return (
    <Card>
      <TransactionTableHeader 
        onRefresh={onRefresh} 
        onExport={() => {}} 
        isLoading={isLoading} 
      />
      
      <CardContent>
        <TransactionErrorDisplay error={error} />

        <DataTable
          data={transactions}
          columns={columns}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
