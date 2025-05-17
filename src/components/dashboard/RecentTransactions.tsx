
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";
import { Transaction } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

interface RecentTransactionsProps {
  recentTransactions: Transaction[];
}

export const RecentTransactions = ({ recentTransactions }: RecentTransactionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {recentTransactions.length > 0 ? (
          <div className="divide-y">
            {recentTransactions.map((tx, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{tx.mpesa_receipt_number || 'No Receipt'}</div>
                  <div className="text-sm text-muted-foreground">
                    {tx.phone_number} • {formatDate(tx.transaction_date)}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(tx.amount)}</div>
                    <div className="text-sm text-muted-foreground">
                      {tx.application_name}
                    </div>
                  </div>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No recent transactions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
