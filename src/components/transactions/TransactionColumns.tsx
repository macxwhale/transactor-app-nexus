
import React from "react";
import { Transaction } from "@/lib/api";
import { 
  ReceiptCell,
  AmountCell,
  ReferenceCell,
  DateCell,
  ApplicationCell,
  StatusCell
} from "./TransactionCells";
import { TransactionActions } from "./TransactionActions";

export function getTransactionColumns(onViewDetails: (tx: Transaction) => void) {
  return [
    {
      id: "receipt",
      header: "Receipt No.",
      cell: (tx: Transaction) => <ReceiptCell tx={tx} />,
    },
    {
      id: "amount",
      header: "Amount",
      cell: (tx: Transaction) => <AmountCell tx={tx} />,
    },
    {
      id: "reference",
      header: "Reference",
      cell: (tx: Transaction) => <ReferenceCell tx={tx} />,
    },
    {
      id: "date",
      header: "Transaction Date",
      cell: (tx: Transaction) => <DateCell tx={tx} />,
    },
    {
      id: "application",
      header: "Application",
      cell: (tx: Transaction) => <ApplicationCell tx={tx} />,
    },
    {
      id: "status",
      header: "Status",
      cell: (tx: Transaction) => <StatusCell tx={tx} />,
    },
    {
      id: "actions",
      header: "",
      cell: (tx: Transaction) => (
        <TransactionActions
          transaction={tx}
          onViewDetails={onViewDetails}
        />
      ),
    },
  ];
}
