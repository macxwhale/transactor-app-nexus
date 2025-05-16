
import React from "react";
import { Transaction, queryTransaction } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Search } from "lucide-react";

export function getTransactionColumns(onViewDetails: (tx: Transaction) => void) {
  // Helper function to display N/A for null or undefined values
  const displayValue = (value: any, formatter?: (val: any) => string) => {
    if (value === null || value === undefined || value === '') {
      return "N/A";
    }
    return formatter ? formatter(value) : value;
  };

  // Handle query transaction
  const handleQueryTransaction = async (tx: Transaction) => {
    toast.loading("Querying transaction...");
    
    try {
      const result = await queryTransaction(tx);
      toast.dismiss();
      
      if (result) {
        toast.success("Transaction query successful");
        console.log("Transaction query result:", result);
        // You could update the transaction details or show them in a modal here
        onViewDetails({...tx, result_desc: result.ResultDesc || tx.result_desc});
      } else {
        toast.error("Failed to query transaction");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Error querying transaction");
    }
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
        <div className="flex justify-end space-x-2">
          {tx.checkout_request_id && (tx.status === 'pending' || tx.status === 'processing') && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleQueryTransaction(tx);
              }}
              className="flex items-center gap-1"
            >
              <Search className="h-4 w-4" />
              Query
            </Button>
          )}
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
