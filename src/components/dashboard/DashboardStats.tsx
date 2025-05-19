
import React from "react";
import { BarChart3, CreditCard, DollarSign, CheckCircle, Clock } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { formatCurrency } from "@/lib/utils";

interface DashboardStatsProps {
  stats: {
    totalTransactions: number;
    totalAmount: number;
    completedTransactions: number;
    pendingTransactions: number;
  };
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const successRate = ((stats.completedTransactions / stats.totalTransactions) * 100 || 0).toFixed(1);
  const pendingRate = ((stats.pendingTransactions / stats.totalTransactions) * 100 || 0).toFixed(1);
  
  // Calculate some fake trends for visual interest
  const fakeTrends = {
    transactions: { value: 12.4, positive: true },
    amount: { value: 8.7, positive: true },
    completed: { value: 5.3, positive: true },
    pending: { value: 3.2, positive: false }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        title="Completed Transactions"
        value={stats.completedTransactions.toLocaleString()}
        icon={<CheckCircle className="h-5 w-5" />}
        description={`${successRate}% success rate`}
        trend={fakeTrends.completed}
      />
      <StatsCard
        title="Pending Transactions"
        value={stats.pendingTransactions.toLocaleString()}
        icon={<Clock className="h-5 w-5" />}
        description={`${pendingRate}% of all transactions`}
        trend={fakeTrends.pending}
      />
    </div>
  );
};
