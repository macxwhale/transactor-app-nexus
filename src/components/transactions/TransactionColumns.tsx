
import React from "react";
import { Transaction } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";

export function getTransactionColumns(onViewDetails: (tx: Transaction) => void) {
  return [
    {
      id: "receipt",
      header: "Receipt No.",
      cell: (tx: Transaction) => (
        <div>
          <div className="font-medium">{tx.mpesa_receipt_number}</div>
          <div className="text-sm text-muted-foreground">
            {tx.phone_number}
          </div>
        </div>
      ),
    },
    {
      id: "amount",
      header: "Amount",
      cell: (tx: Transaction) => (
        <div className="font-medium">{formatCurrency(tx.amount)}</div>
      ),
    },
    {
      id: "date",
      header: "Date",
      cell: (tx: Transaction) => formatDate(tx.transaction_date),
    },
    {
      id: "application",
      header: "Application",
      cell: (tx: Transaction) => tx.application_name || `App ID: ${tx.application_id}`,
    },
    {
      id: "status",
      header: "Status",
      cell: (tx: Transaction) => <StatusBadge status={tx.status as StatusType} />,
    },
    {
      id: "actions",
      header: "",
      cell: (tx: Transaction) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(tx)}
          >
            View Details
          </Button>
        </div>
      ),
    },
  ];
}
