
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";
import { Transaction } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface RecentTransactionsProps {
  recentTransactions: Transaction[];
}

export const RecentTransactions = ({ recentTransactions }: RecentTransactionsProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription className="mt-1">
              Latest transaction activity
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/transactions')}
            className="text-xs gap-1"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.slice(0, 5).map((tx, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/40"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-semibold text-sm truncate">
                      {tx.mpesa_receipt_number || 'No Receipt'}
                    </div>
                    <StatusBadge status={tx.status} />
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {tx.phone_number}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(tx.transaction_date)}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="font-bold text-sm">{formatCurrency(tx.amount)}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {tx.application_name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No recent transactions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
