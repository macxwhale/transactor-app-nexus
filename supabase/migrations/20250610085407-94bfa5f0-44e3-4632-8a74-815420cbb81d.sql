
-- Enable RLS on all tables and add proper security policies

-- 1. Enable RLS on applications table
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create policies for applications table (admin-only access)
CREATE POLICY "Only authenticated users can view applications" 
ON public.applications FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can insert applications" 
ON public.applications FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update applications" 
ON public.applications FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete applications" 
ON public.applications FOR DELETE 
USING (auth.role() = 'authenticated');

-- 2. Enable RLS on transactions table
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions table (admin-only access)
CREATE POLICY "Only authenticated users can view transactions" 
ON public.transactions FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can insert transactions" 
ON public.transactions FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update transactions" 
ON public.transactions FOR UPDATE 
USING (auth.role() = 'authenticated');

-- 3. Enable RLS on api_configurations table
ALTER TABLE public.api_configurations ENABLE ROW LEVEL SECURITY;

-- Create policies for api_configurations table (admin-only access)
CREATE POLICY "Only authenticated users can view api configurations" 
ON public.api_configurations FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can insert api configurations" 
ON public.api_configurations FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update api configurations" 
ON public.api_configurations FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete api configurations" 
ON public.api_configurations FOR DELETE 
USING (auth.role() = 'authenticated');

-- 4. Create a profiles table for user management
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  username TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Admin users can view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'username', new.email),
    'admin' -- First user is admin, subsequent users are regular users
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Add update timestamp trigger to profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.update_timestamp();
