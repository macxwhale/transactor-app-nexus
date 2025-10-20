import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface B2CTransaction {
  id: string;
  originator_conversation_id: string;
  conversation_id: string | null;
  mpesa_originator_conversation_id: string | null;
  initiator_name: string;
  command_id: string;
  party_a: string;
  party_b: string;
  amount: number;
  remarks: string | null;
  occasion: string | null;
  status: string;
  result_code: number | null;
  result_desc: string | null;
  app_id: string | null;
  created_at: string;
  updated_at: string;
}

interface B2CTransactionDetailsDialogProps {
  transaction: B2CTransaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function B2CTransactionDetailsDialog({ 
  transaction, 
  open, 
  onOpenChange 
}: B2CTransactionDetailsDialogProps) {
  if (!transaction) return null;

  // Helper function to display N/A for null or undefined values
  const displayValue = (value: any, formatter?: (val: any) => string) => {
    if (value === null || value === undefined || value === '') {
      return "N/A";
    }
    return formatter ? formatter(value) : value;
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>B2C Transaction Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Main Transaction Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium font-mono">{displayValue(transaction.party_b)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-medium text-lg">{formatCurrency(transaction.amount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={getStatusBadgeVariant(transaction.status)} className="mt-1">
                {transaction.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Command ID</p>
              <p className="font-medium text-sm">{displayValue(transaction.command_id)}</p>
            </div>
          </div>

          <Separator />

          {/* Initiator Info */}
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Initiator Name</p>
              <p className="font-medium">{displayValue(transaction.initiator_name)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Party A (Business)</p>
              <p className="font-medium">{displayValue(transaction.party_a)}</p>
            </div>
            {transaction.remarks && (
              <div>
                <p className="text-sm text-muted-foreground">Remarks</p>
                <p className="font-medium">{transaction.remarks}</p>
              </div>
            )}
            {transaction.occasion && (
              <div>
                <p className="text-sm text-muted-foreground">Occasion</p>
                <p className="font-medium">{transaction.occasion}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Result Info */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Result Code</p>
                <p className="font-medium">{displayValue(transaction.result_code)}</p>
              </div>
              {transaction.app_id && (
                <div>
                  <p className="text-sm text-muted-foreground">App ID</p>
                  <p className="font-medium text-xs truncate">{transaction.app_id}</p>
                </div>
              )}
            </div>
            {transaction.result_desc && (
              <div>
                <p className="text-sm text-muted-foreground">Result Description</p>
                <p className="font-medium text-sm">{transaction.result_desc}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Conversation IDs */}
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Originator Conversation ID</p>
              <p className="font-medium text-xs break-all">{displayValue(transaction.originator_conversation_id)}</p>
            </div>
            {transaction.conversation_id && (
              <div>
                <p className="text-sm text-muted-foreground">Conversation ID</p>
                <p className="font-medium text-xs break-all">{transaction.conversation_id}</p>
              </div>
            )}
            {transaction.mpesa_originator_conversation_id && (
              <div>
                <p className="text-sm text-muted-foreground">M-Pesa Originator ID</p>
                <p className="font-medium text-xs break-all">{transaction.mpesa_originator_conversation_id}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium text-sm">{displayValue(transaction.created_at, formatDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Updated At</p>
              <p className="font-medium text-sm">{displayValue(transaction.updated_at, formatDate)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
