
import React from "react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DailyTransactionsChart } from "@/components/dashboard/DailyTransactionsChart";
import { StatusDistributionChart } from "@/components/dashboard/StatusDistributionChart";
import { TopApplications } from "@/components/dashboard/TopApplications";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";

interface DashboardContentProps {
  stats: {
    totalTransactions: number;
    totalAmount: number;
    completedTransactions: number;
    pendingTransactions: number;
    failedTransactions: number;
    dailyStats: Array<{ date: string; count: number; amount: number }>;
    topApplications: Array<{ name: string; transactions: number; amount: number }>;
    recentTransactions: any[];
  };
}

export const DashboardContent = ({ stats }: DashboardContentProps) => {
  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="animate-fade-in">
        <DashboardStats stats={stats} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Daily Transaction Chart */}
        <div className="lg:col-span-2 h-[400px] glass-card rounded-xl p-2 hover-lift">
          <DailyTransactionsChart dailyStats={stats.dailyStats} />
        </div>

        {/* Status Distribution */}
        <div className="lg:col-span-1 h-[400px] glass-card rounded-xl p-2 hover-lift">
          <StatusDistributionChart stats={stats} />
        </div>
      </div>

      {/* Top Applications */}
      <div className="glass-card rounded-xl p-2 hover-lift">
        <TopApplications topApplications={stats.topApplications} />
      </div>

      {/* Recent Transactions */}
      <div className="glass-card rounded-xl p-2 hover-lift">
        <RecentTransactions recentTransactions={stats.recentTransactions} />
      </div>
    </div>
  );
};
