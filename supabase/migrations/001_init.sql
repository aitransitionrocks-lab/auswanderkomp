-- Migration: 001_init.sql
-- Auswander-Kompass Validation Build v1.1

create extension if not exists "pgcrypto";

-- ─── quiz_submissions ──────────────────────────────────
create table if not exists public.quiz_submissions (
  id uuid default gen_random_uuid() primary key,
  email text,
  country text,
  d_day_months integer,
  children_count integer,
  children_age_group text,
  employment text,
  has_gmbh boolean,
  kv_type text,
  has_property boolean,
  tax_advice_status text,
  co_parent_status text,
  biggest_concern text,
  risk_steuer text check (risk_steuer in ('rot', 'gelb', 'gruen')),
  risk_kv text check (risk_kv in ('rot', 'gelb', 'gruen')),
  risk_buerokratie text check (risk_buerokratie in ('rot', 'gelb', 'gruen')),
  risk_familie text check (risk_familie in ('rot', 'gelb', 'gruen')),
  segment text check (segment in ('unklar', 'plant', 'konkret', 'ready')),
  plan_score integer,
  created_at timestamptz default now()
);

-- ─── subscriptions ─────────────────────────────────────
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  status text default 'inactive',
  country text,
  created_at timestamptz default now(),
  cancelled_at timestamptz
);

-- ─── roadmap_views ─────────────────────────────────────
create table if not exists public.roadmap_views (
  id uuid default gen_random_uuid() primary key,
  email text,
  country text,
  viewed_at timestamptz default now()
);

-- ─── Indices ───────────────────────────────────────────
create index if not exists quiz_submissions_email_idx on public.quiz_submissions(email);
create index if not exists quiz_submissions_segment_idx on public.quiz_submissions(segment);
create index if not exists subscriptions_email_idx on public.subscriptions(email);
create index if not exists subscriptions_stripe_sub_idx on public.subscriptions(stripe_subscription_id);

-- ─── Row Level Security ────────────────────────────────
alter table public.quiz_submissions enable row level security;
alter table public.subscriptions enable row level security;
alter table public.roadmap_views enable row level security;

-- Anonymous insert erlaubt für Quiz (keine Auth vor Zahlung)
create policy "Anon insert quiz" on public.quiz_submissions
  for insert with check (true);

-- Service-Role darf alles (Backend via service_key)
-- Supabase behandelt service_role implizit; keine explicit policy nötig
-- RLS greift nur für anon und authenticated

comment on table public.quiz_submissions is 'Jede Quiz-Teilnahme (anonym bis Zahlung).';
comment on table public.subscriptions is 'Stripe-Subscription-Status pro E-Mail.';
comment on table public.roadmap_views is 'Tracking: wer hat den Paid-Bereich gesehen.';
