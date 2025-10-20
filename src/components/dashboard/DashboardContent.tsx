
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
    <div className="space-y-6">
      {/* Stats Overview */}
      <section className="animate-fade-in" aria-label="Key metrics">
        <DashboardStats stats={stats} />
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-label="Analytics charts">
        {/* Daily Transaction Chart - Takes 2/3 width */}
        <div className="lg:col-span-2 bg-card rounded-xl shadow-card overflow-hidden border border-border/40 hover-lift transition-all">
          <DailyTransactionsChart dailyStats={stats.dailyStats} />
        </div>

        {/* Status Distribution - Takes 1/3 width */}
        <div className="bg-card rounded-xl shadow-card overflow-hidden border border-border/40 hover-lift transition-all">
          <StatusDistributionChart stats={stats} />
        </div>
      </section>

      {/* Applications and Transactions */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-label="Detailed insights">
        {/* Top Applications */}
        <div className="bg-card rounded-xl shadow-card overflow-hidden border border-border/40 hover-lift transition-all">
          <TopApplications topApplications={stats.topApplications} />
        </div>

        {/* Recent Transactions */}
        <div className="bg-card rounded-xl shadow-card overflow-hidden border border-border/40 hover-lift transition-all">
          <RecentTransactions recentTransactions={stats.recentTransactions} />
        </div>
      </section>
    </div>
  );
};
