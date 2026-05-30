-- Migration 0008: Module-System (Phase 1b Sprint C)

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text not null,
  category text,
  price_cents integer not null,
  currency text not null default 'eur',
  stripe_price_id text,
  active boolean not null default true,
  available_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_modules_active on public.modules(active) where active = true;

create trigger trg_modules_updated_at
  before update on public.modules
  for each row execute function public.update_updated_at();

-- User-Modul-Käufe
create table public.user_modules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  module_slug text not null,
  module_title text not null,
  price_paid_cents integer not null,
  stripe_session_id text not null unique,
  stripe_event_id text not null unique,
  purchased_at timestamptz not null default now(),
  unique(user_id, module_slug)
);

create index idx_user_modules_user on public.user_modules(user_id);

-- RLS
alter table public.modules enable row level security;
alter table public.user_modules enable row level security;

create policy "Anyone can view active modules"
  on public.modules for select using (active = true);

create policy "Users can view own purchases"
  on public.user_modules for select using (auth.uid() = user_id);

-- Seed-Modul: M6 GKV-Exit (Beispiel)
insert into public.modules (slug, title, short_description, category, price_cents, sort_order)
values
  ('m6-gkv-exit', 'GKV-Exit für Familien', 'Schritt für Schritt: wann kündigen, was vor dem Wegzug, was nach Ankunft. Mit Versicherungs-Vergleich + Entscheidungs-Tool + PDF-Leitfaden.', 'gesundheit', 3700, 1),
  ('m9-sauberer-exit', 'Sauberer Exit DACH', 'Abmeldung, Wegzugsbesteuerung, GmbH-Anteile, laufende Verträge — die finale Checkliste.', 'buerokratie', 9700, 2);
