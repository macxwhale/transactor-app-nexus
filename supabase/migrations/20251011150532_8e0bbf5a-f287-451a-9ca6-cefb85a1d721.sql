-- Add transaction_type column to applications table
ALTER TABLE public.applications 
ADD COLUMN transaction_type text NOT NULL DEFAULT 'CustomerPayBillOnline' 
CHECK (transaction_type IN ('CustomerBuyGoodsOnline', 'CustomerPayBillOnline'));