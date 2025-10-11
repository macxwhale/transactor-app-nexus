import { supabase } from "@/integrations/supabase/client";

export interface B2CTransaction {
  id: string;
  amount: number;
  app_id: string | null;
  originator_conversation_id: string;
  initiator_name: string;
  command_id: string;
  party_a: string;
  party_b: string;
  remarks: string | null;
  occasion: string | null;
  status: string;
  result_code: number | null;
  result_desc: string | null;
  conversation_id: string | null;
  raw_callback: any;
  created_at: string;
  updated_at: string;
}

export async function fetchB2CTransactions(): Promise<B2CTransaction[]> {
  const { data, error } = await supabase
    .from('b2c_transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching B2C transactions:', error);
    throw error;
  }

  return data || [];
}
