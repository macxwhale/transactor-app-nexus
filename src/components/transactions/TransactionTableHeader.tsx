
import React from "react";
import { Button } from "@/components/ui/button";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, RefreshCcw } from "lucide-react";

interface TransactionTableHeaderProps {
  totalItems?: number;
  onRefresh: () => void;
  onExport: () => void;
  isLoading: boolean;
}

export function TransactionTableHeader({
  totalItems,
  onRefresh,
  onExport,
  isLoading,
}: TransactionTableHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          View and filter all your M-Pesa transactions
          {totalItems !== undefined && (
            <span className="ml-1">({totalItems} total records)</span>
          )}
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
          <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="gap-1"
          onClick={onExport}
          disabled={isLoading}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </CardHeader>
  );
}
