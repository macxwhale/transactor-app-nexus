
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
    trends: {
      transactions: { value: number; positive: boolean };
      amount: { value: number; positive: boolean };
      completed: { value: number; positive: boolean };
      pending: { value: number; positive: boolean };
      failed: { value: number; positive: boolean };
    };
  };
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const successRate = ((stats.completedTransactions / stats.totalTransactions) * 100 || 0).toFixed(1);
  const pendingRate = ((stats.pendingTransactions / stats.totalTransactions) * 100 || 0).toFixed(1);
  const failedRate = ((stats.failedTransactions || 0) / stats.totalTransactions * 100 || 0).toFixed(1);
  
  return (
    <div className="dashboard-grid">
      <StatsCard
        title="Total Transactions"
        value={stats.totalTransactions.toLocaleString()}
        icon={<BarChart3 className="h-5 w-5" />}
        description="vs previous period"
        trend={stats.trends.transactions}
      />
      <StatsCard
        title="Total Amount"
        value={formatCurrency(stats.totalAmount)}
        icon={<DollarSign className="h-5 w-5" />}
        description="vs previous period"
        trend={stats.trends.amount}
      />
      <StatsCard
        title="Completed"
        value={stats.completedTransactions.toLocaleString()}
        icon={<CheckCircle className="h-5 w-5" />}
        description={`${successRate}% success rate`}
        trend={stats.trends.completed}
      />
      <StatsCard
        title="Pending"
        value={stats.pendingTransactions.toLocaleString()}
        icon={<Clock className="h-5 w-5" />}
        description={`${pendingRate}% of all transactions`}
        trend={stats.trends.pending}
        className="border-l-warning"
      />
      {stats.failedTransactions !== undefined && (
        <StatsCard
          title="Failed"
          value={(stats.failedTransactions || 0).toLocaleString()}
          icon={<AlertCircle className="h-5 w-5" />}
          description={`${failedRate}% failure rate`}
          trend={stats.trends.failed}
          className="border-l-destructive"
        />
      )}
    </div>
  );
};
