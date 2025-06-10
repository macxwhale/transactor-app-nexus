
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { normalizeStatus } from "@/utils/transactionUtils";
import { safeToISOString } from "@/utils/dateUtils";

interface DashboardStats {
  totalTransactions: number;
  totalAmount: number;
  completedTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  dailyStats: Array<{ date: string; count: number; amount: number }>;
  topApplications: Array<{ name: string; transactions: number; amount: number }>;
  recentTransactions: any[];
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    console.log("Fetching dashboard stats...");
    setIsLoading(true);

    try {
      // Fetch transactions data
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (txError) {
        console.error("Error fetching transactions:", txError);
        throw txError;
      }

      // Fetch applications data (optional, don't fail if empty)
      const { data: applications } = await supabase
        .from('applications')
        .select('*');

      console.log(`Fetched ${transactions?.length || 0} transactions and ${applications?.length || 0} applications`);

      if (!transactions || transactions.length === 0) {
        console.log("No transactions found, setting empty stats");
        setStats({
          totalTransactions: 0,
          totalAmount: 0,
          completedTransactions: 0,
          pendingTransactions: 0,
          failedTransactions: 0,
          dailyStats: [],
          topApplications: [],
          recentTransactions: []
        });
        return;
      }

      // Create application lookup map
      const appLookup = (applications || []).reduce((acc, app) => {
        acc[app.id] = app.name;
        return acc;
      }, {} as Record<string, string>);

      // Calculate stats
      const totalTransactions = transactions.length;
      const totalAmount = transactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
      
      const statusCounts = transactions.reduce((acc, tx) => {
        const status = normalizeStatus(tx.status);
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const completedTransactions = statusCounts['completed'] || 0;
      const pendingTransactions = statusCounts['pending'] || 0;
      const failedTransactions = statusCounts['failed'] || 0;

      // Daily stats (last 7 days) with safe date handling
      const dailyStats = generateDailyStats(transactions);

      // Top applications
      const appStats = transactions.reduce((acc, tx) => {
        const appId = tx.app_id || 'unknown';
        const appName = appLookup[appId] || `App: ${appId}`;
        
        if (!acc[appName]) {
          acc[appName] = { transactions: 0, amount: 0 };
        }
        acc[appName].transactions += 1;
        acc[appName].amount += Number(tx.amount || 0);
        return acc;
      }, {} as Record<string, { transactions: number; amount: number }>);

      const topApplications = Object.entries(appStats)
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.transactions - a.transactions)
        .slice(0, 5);

      // Recent transactions (last 10) with safe date conversion
      const recentTransactions = transactions
        .slice(0, 10)
        .map(tx => {
          try {
            return {
              ...tx,
              application_name: appLookup[tx.app_id] || `App: ${tx.app_id || 'Unknown'}`,
              created_at: safeToISOString(tx.created_at) || tx.created_at,
              updated_at: safeToISOString(tx.updated_at) || tx.updated_at,
              completed_at: safeToISOString(tx.completed_at) || tx.completed_at
            };
          } catch (error) {
            console.error("Error processing recent transaction:", tx.id, error);
            return {
              ...tx,
              application_name: appLookup[tx.app_id] || `App: ${tx.app_id || 'Unknown'}`
            };
          }
        });

      const newStats = {
        totalTransactions,
        totalAmount,
        completedTransactions,
        pendingTransactions,
        failedTransactions,
        dailyStats,
        topApplications,
        recentTransactions
      };

      console.log("Dashboard stats calculated:", newStats);
      setStats(newStats);

    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      // Set empty stats on error
      setStats({
        totalTransactions: 0,
        totalAmount: 0,
        completedTransactions: 0,
        pendingTransactions: 0,
        failedTransactions: 0,
        dailyStats: [],
        topApplications: [],
        recentTransactions: []
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    fetchStats
  };
}

function generateDailyStats(transactions: any[]) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  return last7Days.map(date => {
    const dayTransactions = transactions.filter(tx => {
      if (!tx.created_at) return false;
      try {
        const createdAtISO = safeToISOString(tx.created_at);
        if (!createdAtISO) return false;
        const txDate = new Date(createdAtISO).toISOString().split('T')[0];
        return txDate === date;
      } catch (error) {
        console.error("Error filtering transaction by date:", tx.id, error);
        return false;
      }
    });

    return {
      date,
      count: dayTransactions.length,
      amount: dayTransactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0)
    };
  });
}
