-- RUN THIS IN YOUR SUPABASE SQL EDITOR --

-- 1. Create Profiles Table (For storing Plan Tiers from Whop)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  plan_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Turn on Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, plan_tier)
  VALUES (new.id, new.email, 'free');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Create Agents Table (For deploying bots)
CREATE TABLE IF NOT EXISTS agents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
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
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Allow users to fully manage their own AI agents
CREATE POLICY "Users can manage own agents" 
ON agents FOR ALL 
USING (auth.uid() = user_id);
