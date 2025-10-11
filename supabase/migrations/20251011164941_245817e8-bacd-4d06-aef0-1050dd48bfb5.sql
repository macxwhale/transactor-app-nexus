-- Add environment column to applications table
ALTER TABLE public.applications 
ADD COLUMN environment text NOT NULL DEFAULT 'Production' 
CHECK (environment IN ('Production', 'Development'));