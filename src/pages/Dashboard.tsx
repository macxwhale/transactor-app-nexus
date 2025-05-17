
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
import { formatCurrency, formatDate } from "@/lib/utils";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/lib/api";
import { useApplicationsList } from "@/hooks/useApplicationsList";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const { applications } = useApplicationsList();

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // Fetch transactions from Supabase
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('*');
      
      if (txError) {
        throw txError;
      }
      
      // Calculate statistics from actual data
      const totalTransactions = transactions?.length || 0;
      const totalAmount = transactions?.reduce((sum, tx) => sum + Number(tx.amount || 0), 0) || 0;
      
      const completedTransactions = transactions?.filter(tx => 
        tx.status?.toLowerCase() === 'completed').length || 0;
        
      const pendingTransactions = transactions?.filter(tx => 
        tx.status?.toLowerCase() === 'pending' || tx.status?.toLowerCase() === 'processing').length || 0;
        
      const failedTransactions = transactions?.filter(tx => 
        tx.status?.toLowerCase() === 'failed').length || 0;
      
      // Generate daily stats from actual data
      const dailyMap = new Map();
      
      transactions?.forEach(tx => {
        if (tx.transaction_date) {
          // Convert timestamp to date string (YYYY-MM-DD)
          const date = new Date(tx.transaction_date * 1000);
          const dateStr = date.toISOString().split('T')[0];
          
          if (!dailyMap.has(dateStr)) {
            dailyMap.set(dateStr, { count: 0, amount: 0 });
          }
          
          const entry = dailyMap.get(dateStr);
          entry.count += 1;
          entry.amount += Number(tx.amount || 0);
        }
      });
      
      // Convert map to array and sort by date
      const dailyStats = Array.from(dailyMap.entries()).map(([date, data]) => ({
        date,
        count: data.count,
        amount: data.amount
      })).sort((a, b) => a.date.localeCompare(b.date));
      
      // Get most recent 7 days or all days if less than 7
      const recentDailyStats = dailyStats.slice(-7);
      
      // Calculate top applications
      const appMap = new Map();
      
      transactions?.forEach(tx => {
        const appId = tx.app_id || 'unknown';
        
        if (!appMap.has(appId)) {
          appMap.set(appId, { 
            transactions: 0, 
            amount: 0,
            name: applications.find(app => app.id === appId)?.name || `App ID: ${appId}`
          });
        }
        
        const entry = appMap.get(appId);
        entry.transactions += 1;
        entry.amount += Number(tx.amount || 0);
      });
      
      // Convert to array and sort by transaction count
      const topApplications = Array.from(appMap.values())
        .sort((a, b) => b.transactions - a.transactions)
        .slice(0, 5);
      
      // Get recent transactions
      const recentTransactions = transactions
        ?.sort((a, b) => {
          // Sort by created_at if available, otherwise by transaction_date
          const dateA = a.created_at ? new Date(a.created_at).getTime() : (a.transaction_date || 0);
          const dateB = b.created_at ? new Date(b.created_at).getTime() : (b.transaction_date || 0);
          return dateB - dateA;
        })
        .slice(0, 5)
        .map(tx => {
          // Format transactions to match our expected type
          return {
            id: tx.id,
            mpesa_receipt_number: tx.mpesa_receipt_number || '',
            phone_number: tx.phone_number || '',
            amount: Number(tx.amount || 0),
            status: tx.status?.toLowerCase() || 'pending',
            transaction_date: tx.transaction_date ? (tx.transaction_date * 1000).toString() : '',
            application_id: tx.app_id || '',
            application_name: applications.find(app => app.id === tx.app_id)?.name || `App ID: ${tx.app_id}`,
            created_at: tx.created_at ? new Date(tx.created_at).toISOString() : new Date().toISOString(),
            updated_at: tx.updated_at ? new Date(tx.updated_at).toISOString() : new Date().toISOString(),
            
            // Include additional fields with null handling
            account_reference: tx.account_reference || '',
            transaction_desc: tx.transaction_desc || '',
            result_code: tx.result_code,
            result_desc: tx.result_desc || '',
            checkout_request_id: tx.checkout_request_id || '',
            merchant_request_id: tx.merchant_request_id || '',
            completed_at: tx.completed_at ? new Date(tx.completed_at).toISOString() : undefined
          } as Transaction;
        }) || [];

      // Assemble stats object
      const dashboardStats = {
        totalTransactions,
        totalAmount,
        completedTransactions,
        pendingTransactions,
        failedTransactions,
        dailyStats: recentDailyStats,
        topApplications,
        recentTransactions
      };
      
      setStats(dashboardStats);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch stats when applications are loaded
    if (applications.length > 0) {
      fetchStats();
    }
  }, [applications.length]);

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
              description={`${((stats.completedTransactions / stats.totalTransactions) * 100 || 0).toFixed(1)}% success rate`}
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
                {stats.totalTransactions > 0 ? (
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
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No transaction data available</p>
                  </div>
                )}
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
                {stats.topApplications.length > 0 ? (
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
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No application data available</p>
                  </div>
                )}
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
                {stats.recentTransactions.length > 0 ? (
                  <div className="divide-y">
                    {stats.recentTransactions.map((tx: Transaction, i: number) => (
                      <div key={i} className="py-3 flex items-center justify-between">
                        <div>
                          <div className="font-medium">{tx.mpesa_receipt_number || 'No Receipt'}</div>
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
                          <StatusBadge status={tx.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No recent transactions</p>
                  </div>
                )}
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
