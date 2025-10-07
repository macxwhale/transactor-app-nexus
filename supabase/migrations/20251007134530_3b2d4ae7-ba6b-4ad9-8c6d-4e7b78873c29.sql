-- Add initiator_password column to applications table
ALTER TABLE public.applications 
ADD COLUMN initiator_password text;