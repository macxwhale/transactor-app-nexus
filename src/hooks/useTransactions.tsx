
import { useState, useEffect } from "react";
import { Transaction, Application } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    applicationId: "",
    startDate: "",
    endDate: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch applications from Supabase
      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select('id, name, is_active, business_short_code, app_id, app_secret');
      
      if (appsError) {
        throw appsError;
      }
      
      // Convert Supabase applications data to our Application type
      const formattedApps: Application[] = appsData.map(app => ({
        id: app.id,
        name: app.name,
        callback_url: '',
        consumer_key: '',
        consumer_secret: '',
        business_short_code: app.business_short_code,
        passkey: '',
        bearer_token: '',
        party_a: '',
        party_b: '',
        is_active: app.is_active ?? true,
        created_at: '',
        updated_at: '',
        app_id: app.app_id || '',
        app_secret: app.app_secret || ''
      }));
      
      setApplications(formattedApps);
      
      // Build query for transactions
      let query = supabase
        .from('transactions')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.applicationId) {
        query = query.eq('app_id', filters.applicationId);
      }
      
      if (filters.startDate) {
        const startDate = new Date(filters.startDate).getTime();
        query = query.gte('transaction_date', startDate);
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        query = query.lte('transaction_date', endDate.getTime());
      }
      
      if (searchTerm) {
        query = query.or(`mpesa_receipt_number.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%`);
      }
      
      // Pagination (10 items per page)
      const perPage = 10;
      const from = (currentPage - 1) * perPage;
      const to = from + perPage - 1;
      
      const { data: txData, error: txError, count } = await query
        .range(from, to)
        .order('created_at', { ascending: false });
      
      if (txError) {
        throw txError;
      }
      
      // Convert Supabase transactions data to our Transaction type
      const formattedTransactions: Transaction[] = txData.map(tx => {
        // Handle transaction_date properly
        let formattedDate: string = '';
        if (tx.transaction_date) {
          // Check if it's in seconds (Unix timestamp) and convert to milliseconds if needed
          const timestamp = typeof tx.transaction_date === 'number' 
            ? (tx.transaction_date < 10000000000 ? tx.transaction_date * 1000 : tx.transaction_date)
            : tx.transaction_date;
          
          formattedDate = new Date(timestamp).toISOString();
        }
        
        return {
          id: tx.id,
          mpesa_receipt_number: tx.mpesa_receipt_number || '',
          phone_number: tx.phone_number,
          amount: Number(tx.amount),
          status: tx.status?.toLowerCase() as 'pending' | 'completed' | 'failed',
          transaction_date: formattedDate,
          application_id: tx.app_id,
          application_name: formattedApps.find(app => app.id === tx.app_id)?.name || `App ID: ${tx.app_id}`,
          created_at: new Date(tx.created_at).toISOString(),
          updated_at: new Date(tx.updated_at).toISOString(),
          
          // Include additional fields
          account_reference: tx.account_reference,
          transaction_desc: tx.transaction_desc,
          result_code: tx.result_code,
          result_desc: tx.result_desc,
          checkout_request_id: tx.checkout_request_id,
          merchant_request_id: tx.merchant_request_id,
          completed_at: tx.completed_at ? new Date(tx.completed_at).toISOString() : undefined,
          narration: tx.narration
        };
      });
      
      setTransactions(formattedTransactions);
      
      // Set total pages based on count
      const totalItems = count || 0;
      setTotalPages(Math.ceil(totalItems / perPage));
      
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, filters]);

  return {
    transactions,
    applications,
    isLoading,
    currentPage,
    totalPages,
    selectedTx,
    filters,
    setCurrentPage,
    setSearchTerm,
    setFilters,
    setSelectedTx,
    fetchData
  };
}
