
import { apiClient } from './client';
import { ApiResponse, Transaction } from './types';

export async function fetchDashboardStats(): Promise<{
  totalTransactions: number;
  totalAmount: number;
  pendingTransactions: number;
  completedTransactions: number;
  failedTransactions: number;
  dailyStats: Array<{ date: string; count: number; amount: number }>;
  topApplications: Array<{ name: string; transactions: number; amount: number }>;
  recentTransactions: Transaction[];
}> {
  const response = await apiClient.get<ApiResponse<any>>('stats/dashboard');
  return response.data;
}
