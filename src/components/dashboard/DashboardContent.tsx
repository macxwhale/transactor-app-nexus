
import React from "react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DailyTransactionsChart } from "@/components/dashboard/DailyTransactionsChart";
import { StatusDistributionChart } from "@/components/dashboard/StatusDistributionChart";
import { TopApplications } from "@/components/dashboard/TopApplications";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { Separator } from "@/components/ui/separator";

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Transaction Chart */}
        <div className="lg:col-span-2 bg-card rounded-lg shadow-card overflow-hidden border border-border/40">
          <DailyTransactionsChart dailyStats={stats.dailyStats} />
        </div>

        {/* Status Distribution */}
        <div className="bg-card rounded-lg shadow-card overflow-hidden border border-border/40">
          <StatusDistributionChart stats={stats} />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Applications */}
        <div className="bg-card rounded-lg shadow-card overflow-hidden border border-border/40">
          <TopApplications topApplications={stats.topApplications} />
        </div>

        {/* Recent Transactions */}
        <div className="bg-card rounded-lg shadow-card overflow-hidden border border-border/40">
          <RecentTransactions recentTransactions={stats.recentTransactions} />
        </div>
      </div>
    </div>
  );
};
