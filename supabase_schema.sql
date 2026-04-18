-- Run this in your Supabase SQL Editor

-- 1. Create the 'agents' table
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    provider TEXT NOT NULL,
    api_key_secure TEXT NOT NULL, -- MVP version. Later, use pgcrypto: ENCODE(..., 'aes-256-cbc')
    status TEXT DEFAULT 'deploying' CHECK (status IN ('deploying', 'running', 'stopped', 'failed')),
    webhook_url TEXT,
    container_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Turn on Row Level Security (RLS)
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Users can only View their own agents
CREATE POLICY "Users can view own agents" 
ON public.agents FOR SELECT 
USING (auth.uid() = user_id);

-- 4. Policy: Users can only Insert their own agents
CREATE POLICY "Users can insert own agents" 
ON public.agents FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 5. Policy: Users can only Update their own agents
CREATE POLICY "Users can update own agents" 
ON public.agents FOR UPDATE 
USING (auth.uid() = user_id);

-- 6. Policy: Users can only Delete their own agents
CREATE POLICY "Users can delete own agents" 
ON public.agents FOR DELETE 
USING (auth.uid() = user_id);

-- 7. Secure the api_key_secure column so it's not exposed to the client by default
-- The easiest way in Supabase is to just let the backend read it, or omit it in queries from the frontend.
