
import React from "react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DailyTransactionsChart } from "@/components/dashboard/DailyTransactionsChart";
import { StatusDistributionChart } from "@/components/dashboard/StatusDistributionChart";
import { TopApplications } from "@/components/dashboard/TopApplications";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { EnhancedKPICards } from "@/components/dashboard/EnhancedKPICards";
import { TransactionFunnelChart } from "@/components/dashboard/TransactionFunnelChart";
import { HeatmapChart } from "@/components/dashboard/HeatmapChart";
import { ComparisonChart } from "@/components/dashboard/ComparisonChart";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
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
    trends: {
      transactions: { value: number; positive: boolean };
      amount: { value: number; positive: boolean };
      completed: { value: number; positive: boolean };
      pending: { value: number; positive: boolean };
      failed: { value: number; positive: boolean };
    };
    enhancedKPIs: {
      averageTransactionValue: number;
      successRateTrend: { current: number; previous: number; trend: number };
      peakHour: { hour: number; count: number };
      revenueVelocity: { perHour: number; perDay: number };
    };
    funnelStages: Array<{ name: string; count: number; percentage: number; color: string }>;
    heatmapData: Array<{ hour: number; day: string; value: number }>;
    comparisonData: Array<{ date: string; current: number; previous: number }>;
    insights: Array<{ id: string; type: 'positive' | 'negative' | 'warning' | 'info'; title: string; description: string; metric?: string }>;
  };
}

export const DashboardContent = ({ stats }: DashboardContentProps) => {
  return (
    <div className="space-y-8">{/* ... keep existing code */}
      {/* Primary Stats Overview */}
      <section className="animate-fade-in" aria-label="Key metrics">
        <DashboardStats stats={stats} />
      </section>

      {/* Enhanced KPIs */}
      <section className="animate-fade-in" aria-label="Enhanced KPIs">
        <EnhancedKPICards stats={stats.enhancedKPIs} />
      </section>

      {/* AI Insights */}
      <section className="animate-fade-in" aria-label="AI Insights">
        <InsightsPanel insights={stats.insights} />
      </section>

      {/* Main Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-label="Analytics charts">
        <div className="lg:col-span-2 bg-card rounded-xl shadow-card overflow-hidden border border-border/40 hover-lift transition-all">
          <DailyTransactionsChart dailyStats={stats.dailyStats} />
        </div>
        <div className="bg-card rounded-xl shadow-card overflow-hidden border border-border/40 hover-lift transition-all">
          <StatusDistributionChart stats={stats} />
        </div>
      </section>

      {/* Advanced Analytics */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-label="Advanced analytics">
        <div className="bg-card rounded-xl shadow-card overflow-hidden border border-border/40 hover-lift transition-all">
          <ComparisonChart data={stats.comparisonData} />
        </div>
        <div className="bg-card rounded-xl shadow-card overflow-hidden border border-border/40 hover-lift transition-all">
          <TransactionFunnelChart stages={stats.funnelStages} />
        </div>
      </section>

      {/* Heatmap Section */}
      <section className="animate-fade-in" aria-label="Activity heatmap">
        <div className="bg-card rounded-xl shadow-card overflow-hidden border border-border/40 hover-lift transition-all">
          <HeatmapChart data={stats.heatmapData} />
        </div>
      </section>

      {/* Applications and Transactions */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-label="Detailed insights">
        <div className="bg-card rounded-xl shadow-card overflow-hidden border border-border/40 hover-lift transition-all">
          <TopApplications topApplications={stats.topApplications} />
        </div>
        <div className="bg-card rounded-xl shadow-card overflow-hidden border border-border/40 hover-lift transition-all">
          <RecentTransactions recentTransactions={stats.recentTransactions} />
        </div>
      </section>
    </div>
  );
};
