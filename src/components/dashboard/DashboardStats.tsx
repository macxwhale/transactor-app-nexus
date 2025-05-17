
import React from "react";
import { BarChart3, CreditCard, DollarSign, WalletCards } from "lucide-react";
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
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Transactions"
        value={stats.totalTransactions.toLocaleString()}
        icon={<BarChart3 className="h-4 w-4" />}
        description="All time transactions"
      />
      <StatsCard
        title="Total Amount"
        value={formatCurrency(stats.totalAmount)}
        icon={<DollarSign className="h-4 w-4" />}
        description="Total money transacted"
      />
      <StatsCard
        title="Completed Transactions"
        value={stats.completedTransactions.toLocaleString()}
        icon={<CreditCard className="h-4 w-4" />}
        description={`${successRate}% success rate`}
      />
      <StatsCard
        title="Pending Transactions"
        value={stats.pendingTransactions.toLocaleString()}
        icon={<WalletCards className="h-4 w-4" />}
        description="Requiring attention"
      />
    </div>
  );
};
