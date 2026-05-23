-- Migration 0002: Tasks + Task Templates

create table public.task_templates (
  id uuid primary key default gen_random_uuid(),

  country text not null,
  category text not null check (category in (
    'finanzen','recht','versicherung','familie','wohnen',
    'arbeit','sprache','gesundheit','sonstiges'
  )),

  title text not null,
  description text,
  priority text not null check (priority in ('kritisch','wichtig','optional')),

  phase text not null check (phase in ('vorbereitung','umzug','ankunft','etablierung')),

  lead_time_days integer default 0,

  risk_tags text[] default array[]::text[],

  sort_order integer default 0,
  active boolean default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_templates_country on public.task_templates(country);
create index idx_templates_active on public.task_templates(active) where active = true;

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  template_id uuid references public.task_templates(id) on delete set null,

  country text not null,
  category text not null,
  title text not null,
  description text,
  priority text not null,
  phase text not null,

  status text not null default 'open' check (status in (
    'open','in_progress','done','not_relevant'
  )),

  due_date date,
  completed_at timestamptz,

  sort_order integer default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_tasks_user on public.tasks(user_id);
create index idx_tasks_user_status on public.tasks(user_id, status);
create index idx_tasks_user_phase on public.tasks(user_id, phase);

create trigger trg_tasks_updated_at
  before update on public.tasks
  for each row execute function public.update_updated_at();
