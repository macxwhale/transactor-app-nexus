
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { Transaction } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Main Transaction Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Receipt Number</p>
              <p className="font-medium">{transaction.mpesa_receipt_number || "N/A"}</p>
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
          </div>

          <Separator />

          {/* Description Info */}
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Reference</p>
              <p className="font-medium">{transaction.account_reference || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium">{transaction.transaction_desc || "N/A"}</p>
            </div>
            {transaction.narration && (
              <div>
                <p className="text-sm text-muted-foreground">Narration</p>
                <p className="font-medium">{transaction.narration}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Result Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Application</p>
              <p className="font-medium">
                {transaction.application_name || `App ID: ${transaction.application_id}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Result Code</p>
              <p className="font-medium">{transaction.result_code !== undefined ? transaction.result_code : "N/A"}</p>
            </div>
            {transaction.result_desc && (
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Result Description</p>
                <p className="font-medium">{transaction.result_desc}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Technical Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Transaction Date</p>
              <p className="font-medium">{formatDate(transaction.transaction_date)}</p>
            </div>
            {transaction.completed_at && (
              <div>
                <p className="text-sm text-muted-foreground">Completed At</p>
                <p className="font-medium">{formatDate(transaction.completed_at)}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{formatDate(transaction.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Updated At</p>
              <p className="font-medium">{formatDate(transaction.updated_at)}</p>
            </div>
          </div>

          {/* MPesa Request IDs */}
          {(transaction.merchant_request_id || transaction.checkout_request_id) && (
            <>
              <Separator />
              <div className="space-y-3">
                {transaction.merchant_request_id && (
                  <div>
                    <p className="text-sm text-muted-foreground">Merchant Request ID</p>
                    <p className="font-medium text-xs break-all">{transaction.merchant_request_id}</p>
                  </div>
                )}
                {transaction.checkout_request_id && (
                  <div>
                    <p className="text-sm text-muted-foreground">Checkout Request ID</p>
                    <p className="font-medium text-xs break-all">{transaction.checkout_request_id}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
