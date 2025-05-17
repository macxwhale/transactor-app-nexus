
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardLoadingState } from "@/components/dashboard/DashboardLoadingState";
import { DashboardErrorState } from "@/components/dashboard/DashboardErrorState";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

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
