-- Add new M-Pesa configuration fields to applications table
ALTER TABLE public.applications 
ADD COLUMN originator_conversation_id TEXT,
ADD COLUMN initiator_name TEXT,
ADD COLUMN security_credential TEXT,
ADD COLUMN command_id TEXT CHECK (command_id IN ('SalaryPayment', 'BusinessPayment', 'PromotionPayment')),
ADD COLUMN queue_timeout_url TEXT,
ADD COLUMN result_url TEXT;