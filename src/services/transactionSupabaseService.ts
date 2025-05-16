
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/lib/api";
import { toast } from "sonner";
import { normalizeStatus } from "@/utils/transactionUtils";

export async function fetchTransactionsFromSupabase(): Promise<Transaction[]> {
  try {
    console.log("Fetching transactions from Supabase...");
    const { data, error } = await supabase
      .from('transactions')
      .select('*');
    
    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    
    console.log("Received transaction data from Supabase:", data);
    
    if (!data || data.length === 0) {
      console.log("No transactions found in Supabase");
      return [];
    }
    
    // Convert Supabase transactions data to our Transaction type
    const formattedTransactions: Transaction[] = data.map(tx => {
      // Ensure proper type conversion and handle nulls
      const status = normalizeStatus(tx.status);
      
      return {
        id: tx.id,
        mpesa_receipt_number: tx.mpesa_receipt_number || '',
        phone_number: tx.phone_number || '',
        amount: Number(tx.amount || 0),
        status: status,
        transaction_date: tx.transaction_date ? tx.transaction_date.toString() : '',
        application_id: tx.app_id || '',
        application_name: '', // Will be populated later
        created_at: tx.created_at ? new Date(tx.created_at).toISOString() : new Date().toISOString(),
        updated_at: tx.updated_at ? new Date(tx.updated_at).toISOString() : new Date().toISOString(),
        
        // Include additional fields with null handling
        account_reference: tx.account_reference || '',
        transaction_desc: tx.transaction_desc || '',
        result_code: tx.result_code,
        result_desc: tx.result_desc || '',
        checkout_request_id: tx.checkout_request_id || '',
        merchant_request_id: tx.merchant_request_id || '',
        completed_at: tx.completed_at ? new Date(tx.completed_at).toISOString() : undefined,
        narration: tx.narration || ''
      };
    }) || [];
    
    console.log("Formatted transactions:", formattedTransactions);
    return formattedTransactions;
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    toast.error("Failed to fetch transactions");
    return [];
  }
}
