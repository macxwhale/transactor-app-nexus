
import React from "react";
import { Button } from "@/components/ui/button";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, RefreshCcw } from "lucide-react";

interface TransactionTableHeaderProps {
  onRefresh: () => void;
  onExport: () => void;
  isLoading: boolean;
}

export function TransactionTableHeader({
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
