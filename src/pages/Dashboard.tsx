
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/ui/stats-card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  BarChart3,
  CreditCard,
  DollarSign,
  RefreshCcw,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchDashboardStats, Transaction } from "@/lib/api";
import { generateMockDashboardStats } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would call the API
      // const data = await fetchDashboardStats();
      
      // For demo purposes, we'll use mock data
      const data = generateMockDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Colors for the pie chart
  const COLORS = ["#17c964", "#f5a524", "#f31260"];

  // Status data for pie chart
  const statusData = stats
    ? [
        { name: "Completed", value: stats.completedTransactions },
        { name: "Pending", value: stats.pendingTransactions },
        { name: "Failed", value: stats.failedTransactions },
      ]
    : [];

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
              <CardHeader className="h-20 bg-muted/30" />
              <CardContent className="h-16 bg-muted/20" />
            </Card>
          ))}
        </div>
      ) : stats ? (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Transactions"
              value={stats.totalTransactions.toLocaleString()}
              icon={<BarChart3 className="h-4 w-4" />}
              description="All time transactions"
            />
            <StatsCard
              title="Total Amount"
              value={formatCurrency(stats.totalAmount)}
              icon={<DollarSign className="h-4 w-4" />}
              description="Total money transacted"
            />
            <StatsCard
              title="Completed Transactions"
              value={stats.completedTransactions.toLocaleString()}
              icon={<CreditCard className="h-4 w-4" />}
              description={`${((stats.completedTransactions / stats.totalTransactions) * 100).toFixed(1)}% success rate`}
            />
            <StatsCard
              title="Pending Transactions"
              value={stats.pendingTransactions.toLocaleString()}
              icon={<WalletCards className="h-4 w-4" />}
              description="Requiring attention"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Daily Transaction Chart */}
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Daily Transactions</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.dailyStats}>
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        });
                      }}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any) => [`${value} transactions`]}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        });
                      }}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Bar 
                      dataKey="count" 
                      name="Transactions"
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Status</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [`${value} transactions`]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Applications */}
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {stats.topApplications.map((app: any, i: number) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium">{app.name}</div>
                        <div className="mt-1 text-2xl font-bold">{app.transactions}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {formatCurrency(app.amount)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {stats.recentTransactions.map((tx: Transaction, i: number) => (
                    <div key={i} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{tx.mpesa_receipt_number}</div>
                        <div className="text-sm text-muted-foreground">
                          {tx.phone_number} • {formatDate(tx.transaction_date)}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(tx.amount)}</div>
                          <div className="text-sm text-muted-foreground">
                            {tx.application_name}
                          </div>
                        </div>
                        <StatusBadge status={tx.status as any} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
