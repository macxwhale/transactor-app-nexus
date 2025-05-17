
import { useState, useEffect } from "react";
import { Transaction } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { useApplicationsList } from "@/hooks/useApplicationsList";
import { toast } from "sonner";

interface DashboardStats {
  totalTransactions: number;
  totalAmount: number;
  completedTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  dailyStats: Array<{ date: string; count: number; amount: number }>;
  topApplications: Array<{ name: string; transactions: number; amount: number }>;
  recentTransactions: Transaction[];
}

export function useDashboardStats() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const { applications } = useApplicationsList();

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching transactions for dashboard stats...");
      
      // Fetch transactions from Supabase
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('*');
      
      if (txError) {
        throw txError;
      }
      
      console.log(`Fetched ${transactions?.length || 0} transactions for dashboard`);
      
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
          try {
            // Handle transaction_date as a Unix timestamp (seconds)
            let dateObj;
            
            // Check if transaction_date is already a number
            if (typeof tx.transaction_date === 'number') {
              // If it's in seconds (Unix timestamp), convert to milliseconds
              dateObj = new Date(tx.transaction_date * 1000);
            } else {
              // If it's a string, parse it
              const timestamp = parseInt(String(tx.transaction_date), 10);
              if (!isNaN(timestamp)) {
                dateObj = new Date(timestamp * 1000);
              } else {
                // If parsing fails, use current date
                console.warn("Invalid transaction_date:", tx.transaction_date);
                dateObj = new Date();
              }
            }
            
            // Format date as YYYY-MM-DD
            const dateStr = dateObj.toISOString().split('T')[0];
            
            if (!dailyMap.has(dateStr)) {
              dailyMap.set(dateStr, { count: 0, amount: 0 });
            }
            
            const entry = dailyMap.get(dateStr);
            entry.count += 1;
            entry.amount += Number(tx.amount || 0);
          } catch (err) {
            console.error("Error processing transaction date:", tx.transaction_date, err);
          }
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
            transaction_date: tx.transaction_date ? tx.transaction_date.toString() : '',
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
      
      console.log("Dashboard stats processed successfully");
      setStats(dashboardStats);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      toast.error("Could not load dashboard data");
      setStats(null);
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

  return { stats, isLoading, fetchStats };
}
