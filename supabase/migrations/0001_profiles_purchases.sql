-- Migration 0001: Profiles + Purchases
-- Hinweis: Segment-Werte 'dreamer'/'planer'/'fortgeschrittener'/'starter' matchen
-- die TypeScript-Typen in src/lib/scoring.ts (bewusste Abweichung vom Doc, das 'traeumer' nutzte).

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,

  quiz_segment text check (quiz_segment in ('dreamer', 'planer', 'fortgeschrittener', 'starter')),
  quiz_score integer check (quiz_score between 10 and 40),
  quiz_country text,
  quiz_answers jsonb,

  initial_purchased_at timestamptz,
  lifetime_purchased_at timestamptz,

  modules_purchased text[] default array[]::text[],

  retargeting_paused boolean default false,
  retargeting_completed boolean default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_profiles_email on public.profiles(email);
create index idx_profiles_lifetime on public.profiles(lifetime_purchased_at) where lifetime_purchased_at is not null;

create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  email text not null,

  stripe_session_id text not null unique,
  stripe_customer_id text,
  stripe_event_id text not null unique,

  product_type text not null check (product_type in ('quiz_27', 'dashboard_97', 'module_97', 'module_197', 'module_297')),
  amount_cents integer not null,
  currency text not null default 'eur',

  status text not null check (status in ('pending', 'completed', 'failed', 'refunded')),
  error_message text,

  metadata jsonb,
  created_at timestamptz not null default now()
);

create index idx_purchases_user on public.purchases(user_id);
create index idx_purchases_email on public.purchases(email);
create index idx_purchases_stripe_session on public.purchases(stripe_session_id);

create or replace function public.update_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();
