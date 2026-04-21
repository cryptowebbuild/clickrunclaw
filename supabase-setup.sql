-- RUN THIS IN YOUR SUPABASE SQL EDITOR --

-- 1. Ensure extensions are enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create or Update Profiles Table (Updated for Onboarding)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  company TEXT,
  email TEXT,
  plan_tier TEXT DEFAULT 'free' CHECK (plan_tier IN ('free', 'starter', 'pro')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Turn on Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 5. Robust Trigger Function for New Users
-- This is likely where the 'Database error saving new user' is coming from.
-- We use COALESCE and handle errors gracefully.
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, plan_tier, full_name)
  VALUES (
    new.id, 
    new.email, 
    'free',
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Agents Table
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  api_key_secure TEXT NOT NULL,
  telegram_bot_token TEXT,
  telegram_status TEXT DEFAULT 'none',
  status TEXT DEFAULT 'deploying',
  webhook_url TEXT,
  container_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Turn on Security
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Allow users to fully manage their own AI agents
DROP POLICY IF EXISTS "Users can manage own agents" ON public.agents;
CREATE POLICY "Users can manage own agents" 
ON public.agents FOR ALL 
USING (auth.uid() = user_id);
