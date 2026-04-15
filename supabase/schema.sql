-- ==========================================
-- ClickRunClaw Supabase Schema & Policies
-- ==========================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Create Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  subscription_tier text default 'free' check (subscription_tier in ('free', 'starter', 'pro')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Agents Table (For Docker+SQLite Orchestration)
create table public.agents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  status text default 'pending_activation' check (status in ('pending_activation', 'ready_to_boot', 'running', 'stopped', 'error')),
  plan text not null check (plan in ('starter', 'pro')),
  container_id text,
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.agents enable row level security;

-- 5. Profiles Policies
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- 6. Agents Policies
create policy "Users can view their own agents" on public.agents
  for select using (auth.uid() = user_id);

create policy "Users can insert their own agents" on public.agents
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own agents" on public.agents
  for update using (auth.uid() = user_id);

create policy "Users can delete their own agents" on public.agents
  for delete using (auth.uid() = user_id);

-- 7. Function to handle new user signup automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 8. Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
