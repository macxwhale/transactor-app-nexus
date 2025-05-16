
import React from "react";
import { Transaction } from "@/lib/api";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { displayValue, formatTransactionDate, formatTransactionAmount } from "@/utils/transactionDisplayUtils";

export function ReceiptCell({ tx }: { tx: Transaction }) {
  return (
    <div>
      <div className="font-medium">{displayValue(tx.mpesa_receipt_number, (val) => val || "Pending")}</div>
      <div className="text-sm text-muted-foreground">
        {displayValue(tx.phone_number)}
      </div>
    </div>
  );
}

export function AmountCell({ tx }: { tx: Transaction }) {
  return (
    <div className="font-medium">{formatTransactionAmount(tx.amount)}</div>
  );
}

export function ReferenceCell({ tx }: { tx: Transaction }) {
  return (
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
  );
}

export function DateCell({ tx }: { tx: Transaction }) {
  return formatTransactionDate(tx.transaction_date);
}

export function ApplicationCell({ tx }: { tx: Transaction }) {
  return displayValue(tx.application_name || `App ID: ${tx.application_id}`);
}

export function StatusCell({ tx }: { tx: Transaction }) {
  return <StatusBadge status={tx.status as any} />;
}
