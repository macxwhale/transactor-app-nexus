-- Create C2B transactions table
CREATE TABLE public.c2b_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id uuid REFERENCES public.applications(id) ON DELETE CASCADE,
  originator_conversation_id text NOT NULL,
  initiator_name text NOT NULL,
  command_id text NOT NULL,
  amount numeric NOT NULL,
  party_a text NOT NULL,
  party_b text NOT NULL,
  remarks text,
  occasion text,
  status character varying DEFAULT 'pending'::character varying,
  result_code bigint,
  result_desc text,
  raw_callback jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.c2b_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Only authenticated users can view c2b transactions"
ON public.c2b_transactions
FOR SELECT
USING (auth.role() = 'authenticated'::text);

CREATE POLICY "Only authenticated users can insert c2b transactions"
ON public.c2b_transactions
FOR INSERT
WITH CHECK (auth.role() = 'authenticated'::text);

CREATE POLICY "Only authenticated users can update c2b transactions"
ON public.c2b_transactions
FOR UPDATE
USING (auth.role() = 'authenticated'::text);

-- Create updated_at trigger
CREATE TRIGGER update_c2b_transactions_updated_at
BEFORE UPDATE ON public.c2b_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_timestamp();

-- Create index for better query performance
CREATE INDEX idx_c2b_transactions_application_id ON public.c2b_transactions(application_id);
CREATE INDEX idx_c2b_transactions_created_at ON public.c2b_transactions(created_at DESC);