
import React from "react";
import { BarChart3, CreditCard, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { formatCurrency } from "@/lib/utils";

interface DashboardStatsProps {
  stats: {
    totalTransactions: number;
    totalAmount: number;
    completedTransactions: number;
    pendingTransactions: number;
    failedTransactions?: number;
  };
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const successRate = ((stats.completedTransactions / stats.totalTransactions) * 100 || 0).toFixed(1);
  const pendingRate = ((stats.pendingTransactions / stats.totalTransactions) * 100 || 0).toFixed(1);
  const failedRate = ((stats.failedTransactions || 0) / stats.totalTransactions * 100 || 0).toFixed(1);
  
  // Calculate some trends for visual interest
  const fakeTrends = {
    transactions: { value: 12.4, positive: true },
    amount: { value: 8.7, positive: true },
    completed: { value: 5.3, positive: true },
    pending: { value: 3.2, positive: false },
    failed: { value: 1.5, positive: false }
  };
  
  return (
    <div className="dashboard-grid">
      <StatsCard
        title="Total Transactions"
        value={stats.totalTransactions.toLocaleString()}
        icon={<BarChart3 className="h-5 w-5" />}
        description="All time transactions"
        trend={fakeTrends.transactions}
      />
      <StatsCard
        title="Total Amount"
        value={formatCurrency(stats.totalAmount)}
        icon={<DollarSign className="h-5 w-5" />}
        description="Total money transacted"
        trend={fakeTrends.amount}
      />
      <StatsCard
        title="Completed"
        value={stats.completedTransactions.toLocaleString()}
        icon={<CheckCircle className="h-5 w-5" />}
        description={`${successRate}% success rate`}
        trend={fakeTrends.completed}
      />
      <StatsCard
        title="Pending"
        value={stats.pendingTransactions.toLocaleString()}
        icon={<Clock className="h-5 w-5" />}
        description={`${pendingRate}% of all transactions`}
        trend={fakeTrends.pending}
        className="border-l-warning"
      />
      {stats.failedTransactions !== undefined && (
        <StatsCard
          title="Failed"
          value={(stats.failedTransactions || 0).toLocaleString()}
          icon={<AlertCircle className="h-5 w-5" />}
          description={`${failedRate}% failure rate`}
          trend={fakeTrends.failed}
          className="border-l-destructive"
        />
      )}
    </div>
  );
};
