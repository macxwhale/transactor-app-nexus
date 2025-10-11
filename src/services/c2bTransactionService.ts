import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/lib/api";
import { toast } from "sonner";
import { normalizeStatus } from "@/utils/transactionUtils";
import { safeToISOString } from "@/utils/dateUtils";

export async function fetchC2BTransactionsFromSupabase(): Promise<Transaction[]> {
  try {
    console.log("Fetching C2B transactions from Supabase...");
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    
    console.log("Received C2B transaction data from Supabase:", data);
    
    if (!data || data.length === 0) {
      console.log("No C2B transactions found in Supabase");
      return [];
    }
    
    // Convert Supabase transactions data to our Transaction type with safe date handling
    const formattedTransactions: Transaction[] = data.map(tx => {
      try {
        const status = normalizeStatus(tx.status);
        
        return {
          id: tx.id,
          mpesa_receipt_number: tx.mpesa_receipt_number || '',
          phone_number: tx.phone_number || '',
          amount: Number(tx.amount || 0),
          status: status,
          transaction_date: tx.transaction_date ? tx.transaction_date.toString() : '',
          application_id: tx.app_id || '',
          application_name: '',
          created_at: safeToISOString(tx.created_at) || new Date().toISOString(),
          updated_at: safeToISOString(tx.updated_at) || new Date().toISOString(),
          
          account_reference: tx.account_reference || '',
          transaction_desc: tx.transaction_desc || '',
          result_code: tx.result_code,
          result_desc: tx.result_desc || '',
          checkout_request_id: tx.checkout_request_id || '',
          merchant_request_id: tx.merchant_request_id || '',
          completed_at: safeToISOString(tx.completed_at),
          narration: tx.narration || ''
        };
      } catch (error) {
        console.error("Error processing C2B transaction:", tx.id, error);
        return {
          id: tx.id,
          mpesa_receipt_number: tx.mpesa_receipt_number || '',
          phone_number: tx.phone_number || '',
          amount: Number(tx.amount || 0),
          status: normalizeStatus(tx.status),
          transaction_date: '',
          application_id: tx.app_id || '',
          application_name: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          account_reference: tx.account_reference || '',
          transaction_desc: tx.transaction_desc || '',
          result_code: tx.result_code,
          result_desc: tx.result_desc || '',
          checkout_request_id: tx.checkout_request_id || '',
          merchant_request_id: tx.merchant_request_id || '',
          completed_at: undefined,
          narration: tx.narration || ''
        };
      }
    }) || [];
    
    console.log("Formatted C2B transactions:", formattedTransactions);
    return formattedTransactions;
  } catch (error) {
    console.error("Failed to fetch C2B transactions:", error);
    toast.error("Failed to fetch C2B transactions");
    return [];
  }
}
