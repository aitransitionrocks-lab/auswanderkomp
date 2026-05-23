-- Migration 0004: Retargeting Mail Queue + Mail Log

create table public.mail_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,

  sequence_name text not null default 'dashboard_upsell',
  sequence_step integer not null,

  scheduled_at timestamptz not null,

  status text not null default 'pending' check (status in (
    'pending','sent','cancelled','failed'
  )),

  sent_at timestamptz,
  cancelled_reason text,
  error_message text,

  created_at timestamptz not null default now()
);

create unique index idx_mail_queue_unique on public.mail_queue(user_id, sequence_name, sequence_step);
create index idx_mail_queue_pending on public.mail_queue(scheduled_at, status) where status = 'pending';

create table public.mail_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,

  email text not null,
  subject text not null,
  template_name text not null,

  resend_message_id text,

  status text not null check (status in ('sent','failed','opened','clicked')),

  opened_at timestamptz,
  clicked_at timestamptz,

  created_at timestamptz not null default now()
);

create index idx_mail_log_user on public.mail_log(user_id);
create index idx_mail_log_template on public.mail_log(template_name);
