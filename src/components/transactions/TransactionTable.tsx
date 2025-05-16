
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Transaction, Application } from "@/lib/api";
import { Download, RefreshCcw } from "lucide-react";
import { TransactionFilters } from "./TransactionFilters";
import { getTransactionColumns } from "./TransactionColumns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TransactionTableProps {
  transactions: Transaction[];
  applications: Application[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  filters: {
    status: string;
    applicationId: string;
    startDate: string;
    endDate: string;
  };
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void;
  onFilterChange: (filters: any) => void;
  onRefresh: () => void;
  onViewDetails: (tx: Transaction) => void;
  error?: string | null;
}

export function TransactionTable({
  transactions,
  applications,
  isLoading,
  currentPage,
  totalPages,
  filters,
  onPageChange,
  onSearch,
  onFilterChange,
  onRefresh,
  onViewDetails,
  error,
}: TransactionTableProps) {
  const columns = getTransactionColumns(onViewDetails);

  const handleExport = async () => {
    toast.loading("Preparing export...");
    
    try {
      // Build query with the same filters as the table
      let query = supabase.from('transactions').select('*');
      
      if (filters.status) {
        // Use case-insensitive matching for status
        query = query.ilike('status', `%${filters.status}%`);
      }
      
      if (filters.applicationId) {
        query = query.eq('app_id', filters.applicationId);
      }
      
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        startDate.setHours(0, 0, 0, 0);
        query = query.gte('transaction_date', startDate.getTime());
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        query = query.lte('transaction_date', endDate.getTime());
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast.dismiss();
        toast.error("No data to export");
        return;
      }
      
      // Transform data for CSV
      const csvData = data.map(tx => {
        // Get application name
        const appName = applications.find(app => app.id === tx.app_id)?.name || tx.app_id;
        
        // Format the date properly
        let formattedDate = 'N/A';
        if (tx.transaction_date) {
          try {
            formattedDate = new Date(Number(tx.transaction_date)).toLocaleDateString();
          } catch (e) {
            console.error("Error formatting date:", e);
          }
        }
        
        return {
          Receipt: tx.mpesa_receipt_number || '',
          Phone: tx.phone_number || '',
          Amount: tx.amount || 0,
          Status: tx.status || 'Unknown',
          Date: formattedDate,
          Application: appName,
          Reference: tx.account_reference || '',
          Description: tx.transaction_desc || ''
        };
      });
      
      // Convert to CSV
      const headers = Object.keys(csvData[0]).join(',');
      const rows = csvData.map(row => Object.values(row).join(','));
      const csv = [headers, ...rows].join('\n');
      
      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success("Export completed successfully");
    } catch (error) {
      console.error("Export failed:", error);
      toast.dismiss();
      toast.error("Export failed. Please try again.");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            View and filter all your M-Pesa transactions
          </CardDescription>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="gap-1"
            onClick={handleExport}
            disabled={isLoading}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <TransactionFilters
          filters={filters}
          applications={applications}
          onFilterChange={onFilterChange}
        />

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md text-destructive">
            {error}
          </div>
        )}

        <DataTable
          data={transactions}
          columns={columns}
          searchPlaceholder="Search by receipt number or phone..."
          onSearch={onSearch}
          pagination={{
            currentPage,
            totalPages,
            onPageChange,
          }}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
