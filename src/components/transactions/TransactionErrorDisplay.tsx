
import React from "react";

interface TransactionErrorDisplayProps {
  error: string | null;
}

export function TransactionErrorDisplay({ error }: TransactionErrorDisplayProps) {
  if (!error) return null;
  
  return (
    <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md text-destructive">
      {error}
    </div>
  );
}
