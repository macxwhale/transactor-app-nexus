
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, ChevronDown } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardLoadingState } from "@/components/dashboard/DashboardLoadingState";
import { DashboardErrorState } from "@/components/dashboard/DashboardErrorState";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const { stats, isLoading, fetchStats } = useDashboardStats();
  const [timeRange, setTimeRange] = React.useState("This Week");

  const timeRanges = [
    "Today",
    "This Week",
    "This Month",
    "Last 3 Months",
    "This Year",
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of your M-Pesa transactions and statistics
          </p>
        </div>
        
        <div className="flex gap-3 self-start">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {timeRange}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {timeRanges.map((range) => (
                <DropdownMenuItem key={range} onClick={() => setTimeRange(range)}>
                  {range}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="outline"
            size="default"
            className="gap-2 hover:bg-primary/10"
            onClick={fetchStats}
            disabled={isLoading}
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
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
