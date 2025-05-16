
import { supabase } from "@/integrations/supabase/client";

export function useTransactionQueries() {
  // Simplified query function that doesn't apply any filters
  const buildFilteredQuery = () => {
    // Just return a simple query that gets all transactions
    return supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
  };
  
  return {
    buildFilteredQuery
  };
}
