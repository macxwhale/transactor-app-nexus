-- Rename c2b_transactions table to b2c_transactions
ALTER TABLE public.c2b_transactions RENAME TO b2c_transactions;

-- Rename RLS policies
ALTER POLICY "Only authenticated users can view c2b transactions" ON public.b2c_transactions RENAME TO "Only authenticated users can view b2c transactions";
ALTER POLICY "Only authenticated users can insert c2b transactions" ON public.b2c_transactions RENAME TO "Only authenticated users can insert b2c transactions";
ALTER POLICY "Only authenticated users can update c2b transactions" ON public.b2c_transactions RENAME TO "Only authenticated users can update b2c transactions";

-- Rename trigger
ALTER TRIGGER update_c2b_transactions_updated_at ON public.b2c_transactions RENAME TO update_b2c_transactions_updated_at;

-- Rename indexes
ALTER INDEX idx_c2b_transactions_application_id RENAME TO idx_b2c_transactions_application_id;
ALTER INDEX idx_c2b_transactions_created_at RENAME TO idx_b2c_transactions_created_at;