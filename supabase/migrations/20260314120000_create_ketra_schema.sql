-- Create required extension for UUID generation (Supabase usually has this enabled)
create extension if not exists "pgcrypto";

-- 1. users
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  full_name text,
  instagram_id text,
  avatar_url text,
  plan text default 'free',
  tryon_count integer default 2,
  total_tryons_used integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.users enable row level security;

-- 2. vendors
create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  store_name text,
  owner_name text,
  email text unique,
  phone text,
  country text,
  currency text,
  website text,
  subdomain text unique,
  monthly_pool integer default 100,
  pool_used integer default 0,
  per_customer_limit integer default 3,
  status text default 'pending',
  plan_price decimal,
  warning_sent boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.vendors enable row level security;

-- 3. tryon_sessions
create table if not exists public.tryon_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  vendor_id uuid references public.vendors(id),
  person_image_url text,
  outfit_image_url text,
  result_image_url text,
  source text,
  status text default 'pending',
  created_at timestamptz default now()
);

alter table public.tryon_sessions enable row level security;

-- 4. vendor_customers
create table if not exists public.vendor_customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  vendor_id uuid references public.vendors(id),
  tryons_used integer default 0,
  first_visit timestamptz default now(),
  last_visit timestamptz default now()
);

alter table public.vendor_customers enable row level security;

-- 5. plans
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text,
  price_inr decimal,
  price_usd decimal,
  price_eur decimal,
  price_kwd decimal,
  price_bhd decimal,
  tryon_limit integer,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.plans enable row level security;

-- 6. payments
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  vendor_id uuid references public.vendors(id),
  amount decimal,
  currency text,
  gateway text,
  gateway_payment_id text,
  status text,
  payment_type text,
  tryons_credited integer,
  created_at timestamptz default now()
);

alter table public.payments enable row level security;

-- 7. outfit_submissions
create table if not exists public.outfit_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  photo_url text,
  instagram_id text,
  caption text,
  submission_type text,
  ai_score decimal,
  style_score decimal,
  trend_score decimal,
  creativity_score decimal,
  impression_score decimal,
  community_votes integer default 0,
  total_score decimal,
  week_number integer,
  year integer,
  is_winner boolean default false,
  created_at timestamptz default now()
);

alter table public.outfit_submissions enable row level security;

-- 8. votes
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  voter_id uuid references public.users(id),
  submission_id uuid references public.outfit_submissions(id),
  week_number integer,
  year integer,
  created_at timestamptz default now()
);

alter table public.votes enable row level security;

-- 9. hall_of_fame
create table if not exists public.hall_of_fame (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  submission_id uuid references public.outfit_submissions(id),
  full_name text,
  instagram_id text,
  photo_url text,
  final_score decimal,
  week_number integer,
  year integer,
  tryons_credited integer default 2,
  created_at timestamptz default now()
);

alter table public.hall_of_fame enable row level security;

-- 10. notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_type text,
  recipient_id uuid,
  type text,
  channel text,
  status text default 'pending',
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;

-- 11. promo_codes
create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  type text,
  value decimal,
  max_uses integer,
  used_count integer default 0,
  expiry_date timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.promo_codes enable row level security;

-- 12. code_redemptions
create table if not exists public.code_redemptions (
  id uuid primary key default gen_random_uuid(),
  code_id uuid references public.promo_codes(id),
  user_id uuid references public.users(id),
  tryons_credited integer,
  redeemed_at timestamptz default now()
);

alter table public.code_redemptions enable row level security;

-- Indexes on user_id
create index if not exists idx_tryon_sessions_user_id on public.tryon_sessions (user_id);
create index if not exists idx_vendor_customers_user_id on public.vendor_customers (user_id);
create index if not exists idx_payments_user_id on public.payments (user_id);
create index if not exists idx_outfit_submissions_user_id on public.outfit_submissions (user_id);
create index if not exists idx_votes_voter_id on public.votes (voter_id);
create index if not exists idx_hall_of_fame_user_id on public.hall_of_fame (user_id);
create index if not exists idx_code_redemptions_user_id on public.code_redemptions (user_id);

-- Indexes on vendor_id
create index if not exists idx_tryon_sessions_vendor_id on public.tryon_sessions (vendor_id);
create index if not exists idx_vendor_customers_vendor_id on public.vendor_customers (vendor_id);
create index if not exists idx_payments_vendor_id on public.payments (vendor_id);

-- Indexes on email
create index if not exists idx_users_email on public.users (email);
create index if not exists idx_vendors_email on public.vendors (email);

-- Indexes on status
create index if not exists idx_vendors_status on public.vendors (status);
create index if not exists idx_tryon_sessions_status on public.tryon_sessions (status);
create index if not exists idx_payments_status on public.payments (status);
create index if not exists idx_notifications_status on public.notifications (status);

-- Indexes on week_number
create index if not exists idx_outfit_submissions_week_year on public.outfit_submissions (week_number, year);
create index if not exists idx_votes_week_year on public.votes (week_number, year);
create index if not exists idx_hall_of_fame_week_year on public.hall_of_fame (week_number, year);

