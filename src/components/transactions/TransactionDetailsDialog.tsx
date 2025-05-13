
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { Transaction } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";

interface TransactionDetailsDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailsDialog({ 
  transaction, 
  open, 
  onOpenChange 
}: TransactionDetailsDialogProps) {
  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Receipt Number</p>
              <p className="font-medium">{transaction.mpesa_receipt_number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium">{transaction.phone_number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-medium">{formatCurrency(transaction.amount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <StatusBadge status={transaction.status as StatusType} className="mt-1" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transaction Date</p>
              <p className="font-medium">{formatDate(transaction.transaction_date)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Application</p>
              <p className="font-medium">
                {transaction.application_name || `App ID: ${transaction.application_id}`}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created At</p>
            <p className="font-medium">{formatDate(transaction.created_at)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
