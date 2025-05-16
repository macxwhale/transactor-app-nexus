import React from "react";
import { Transaction } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";

export function getTransactionColumns(onViewDetails: (tx: Transaction) => void) {
  // Helper function to display N/A for null or undefined values
  const displayValue = (value: any, formatter?: (val: any) => string) => {
    if (value === null || value === undefined || value === '') {
      return "N/A";
    }
    return formatter ? formatter(value) : value;
  };

  return [
    {
      id: "receipt",
      header: "Receipt No.",
      cell: (tx: Transaction) => (
        <div>
          <div className="font-medium">{displayValue(tx.mpesa_receipt_number, (val) => val || "Pending")}</div>
          <div className="text-sm text-muted-foreground">
            {displayValue(tx.phone_number)}
          </div>
        </div>
      ),
    },
    {
      id: "amount",
      header: "Amount",
      cell: (tx: Transaction) => (
        <div className="font-medium">{displayValue(tx.amount, formatCurrency)}</div>
      ),
    },
    {
      id: "reference",
      header: "Reference",
      cell: (tx: Transaction) => (
        <div>
          <div className="font-medium truncate max-w-[150px]" title={displayValue(tx.account_reference)}>
            {displayValue(tx.account_reference)}
          </div>
          {tx.result_code !== undefined && (
            <div className="text-sm text-muted-foreground">
              Code: {displayValue(tx.result_code)}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "date",
      header: "Transaction Date",
      cell: (tx: Transaction) => {
        // Convert to number if it's a string representation of a number
        const dateValue = tx.transaction_date && !isNaN(Number(tx.transaction_date)) 
          ? Number(tx.transaction_date) 
          : tx.transaction_date;
        
        return displayValue(dateValue, formatDate);
      },
    },
    {
      id: "application",
      header: "Application",
      cell: (tx: Transaction) => displayValue(tx.application_name || `App ID: ${tx.application_id}`),
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
