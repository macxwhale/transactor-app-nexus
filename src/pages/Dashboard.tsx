
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardLoadingState } from "@/components/dashboard/DashboardLoadingState";
import { DashboardErrorState } from "@/components/dashboard/DashboardErrorState";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

const Dashboard = () => {
  const { stats, isLoading, fetchStats } = useDashboardStats();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of your M-Pesa transactions and statistics
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 self-start hover:bg-primary/10"
          onClick={fetchStats}
          disabled={isLoading}
        >
          <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </Button>
      </div>

      <DashboardLayout
        isLoading={isLoading}
        stats={stats}
        loadingView={<DashboardLoadingState />}
        errorView={<DashboardErrorState onRetry={fetchStats} />}
        contentView={<DashboardContent stats={stats} />}
      />
    </div>
  );
};

export default Dashboard;
