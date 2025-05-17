
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
    <>
      {/* Stats Overview */}
      <DashboardStats stats={stats} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Daily Transaction Chart */}
        <DailyTransactionsChart dailyStats={stats.dailyStats} />

        {/* Status Distribution */}
        <StatusDistributionChart stats={stats} />
      </div>

      {/* Top Applications */}
      <div className="mt-6">
        <TopApplications topApplications={stats.topApplications} />
      </div>

      {/* Recent Transactions */}
      <div className="mt-6">
        <RecentTransactions recentTransactions={stats.recentTransactions} />
      </div>
    </>
  );
};
