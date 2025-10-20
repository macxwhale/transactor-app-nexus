
import React from "react";
import { RefreshCcw, ChevronDown } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardLoadingState } from "@/components/dashboard/DashboardLoadingState";
import { DashboardErrorState } from "@/components/dashboard/DashboardErrorState";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { FocusManager } from "@/components/accessibility/FocusManager";
import { AccessibleButton } from "@/components/accessibility/AccessibleButton";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const [timeRange, setTimeRange] = React.useState<"Today" | "This Week" | "This Month" | "Last 3 Months" | "This Year">("This Week");
  const { stats, isLoading, fetchStats } = useDashboardStats(timeRange);
  const { debounce } = usePerformanceOptimization();

  const timeRanges = [
    "Today",
    "This Week", 
    "This Month",
    "Last 3 Months",
    "This Year",
  ];

  // Debounced refresh function for performance
  const debouncedRefresh = React.useMemo(
    () => debounce(fetchStats, 300),
    [debounce, fetchStats]
  );

  return (
    <FocusManager autoFocus>
      <SkipToContent />
      <div className="space-y-8" role="main" id="main-content" tabIndex={-1}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground" id="page-title">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1" id="page-description">
              Overview of your M-Pesa transactions and statistics
            </p>
          </div>
          
          <div className="flex gap-3 self-start" role="group" aria-label="Dashboard controls">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <AccessibleButton 
                  variant="outline" 
                  className="gap-2"
                  aria-label={`Time range selector, currently set to ${timeRange}`}
                  ariaDescribedBy="time-range-description"
                >
                  {timeRange}
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </AccessibleButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent role="menu" aria-label="Time range options">
                {timeRanges.map((range) => (
                  <DropdownMenuItem 
                    key={range} 
                    onClick={() => setTimeRange(range as typeof timeRange)}
                    role="menuitem"
                    aria-selected={timeRange === range}
                  >
                    {range}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div id="time-range-description" className="sr-only">
              Select a time range to filter dashboard statistics
            </div>
            
            <AccessibleButton
              variant="outline"
              size="default"
              className="gap-2 hover:bg-primary/10"
              onClick={debouncedRefresh}
              loading={isLoading}
              loadingText="Refreshing..."
              aria-label="Refresh dashboard data"
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
              Refresh
            </AccessibleButton>
          </div>
        </div>

        <section aria-labelledby="dashboard-content-heading">
          <h2 id="dashboard-content-heading" className="sr-only">Dashboard Statistics and Charts</h2>
          <DashboardLayout
            isLoading={isLoading}
            stats={stats}
            loadingView={<DashboardLoadingState />}
            errorView={<DashboardErrorState onRetry={fetchStats} />}
            contentView={<DashboardContent stats={stats} />}
          />
        </section>
      </div>
    </FocusManager>
  );
};

export default Dashboard;
