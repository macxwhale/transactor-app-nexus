
import React from "react";
import { Transaction, queryTransaction } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search } from "lucide-react";

interface TransactionActionsProps {
  transaction: Transaction;
  onViewDetails: (tx: Transaction) => void;
}

export function TransactionActions({ 
  transaction, 
  onViewDetails 
}: TransactionActionsProps) {
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

  return (
    <div className="flex justify-end space-x-2">
      {transaction.checkout_request_id && 
       (transaction.status === 'pending' || transaction.status === 'processing') && (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleQueryTransaction(transaction);
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
        onClick={() => onViewDetails(transaction)}
      >
        View Details
      </Button>
    </div>
  );
}
