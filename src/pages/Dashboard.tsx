
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DailyTransactionsChart } from "@/components/dashboard/DailyTransactionsChart";
import { StatusDistributionChart } from "@/components/dashboard/StatusDistributionChart";
import { TopApplications } from "@/components/dashboard/TopApplications";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";

const Dashboard = () => {
  const { stats, isLoading, fetchStats } = useDashboardStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={fetchStats}
          disabled={isLoading}
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-36 bg-muted/20 flex items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
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
      ) : (
        <div className="p-12 text-center">
          <p className="text-muted-foreground">Could not load dashboard data</p>
          <Button onClick={fetchStats} className="mt-4">
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
