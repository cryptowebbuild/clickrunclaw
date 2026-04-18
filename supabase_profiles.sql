-- Run this in your Supabase SQL Editor to manage User Subscription Tiers (Paywall)

-- 1. Create the Profiles table 
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    plan_tier TEXT DEFAULT 'free' CHECK (plan_tier IN ('free', 'starter', 'pro')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Turn on Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Users can only View their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- 4. Auto-create Profile Trigger (So when someone signs up, they automatically enter the 'free' tier)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, plan_tier)
  VALUES (new.id, new.email, 'free');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- WHAT TO DO IN WHOP / STRIPE WEBHOOKS:
-- When a user successfully pays, your webhook logic should run this query inside Supabase:
-- UPDATE public.profiles SET plan_tier = 'starter' WHERE email = 'user_email_from_whop';
