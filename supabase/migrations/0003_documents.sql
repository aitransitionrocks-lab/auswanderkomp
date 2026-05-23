-- Migration 0003: Documents + Shares

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,

  storage_path text not null,
  file_name text not null,
  file_size_bytes bigint not null,
  mime_type text not null,

  category text check (category in (
    'identitaet','familie','finanzen','arbeit','bildung',
    'gesundheit','wohnen','versicherung','sonstiges'
  )),

  linked_task_id uuid references public.tasks(id) on delete set null,

  tags text[] default array[]::text[],
  notes text,
  expires_at date,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_documents_user on public.documents(user_id);
create index idx_documents_user_category on public.documents(user_id, category);
create index idx_documents_expiring on public.documents(expires_at) where expires_at is not null;

create trigger trg_documents_updated_at
  before update on public.documents
  for each row execute function public.update_updated_at();

create table public.document_shares (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,

  share_token text not null unique,
  password_hash text,

  expires_at timestamptz not null,
  max_downloads integer default 0,
  download_count integer default 0,

  created_for_recipient text,

  created_at timestamptz not null default now()
);

create index idx_shares_token on public.document_shares(share_token);
create index idx_shares_user on public.document_shares(user_id);
create index idx_shares_expires on public.document_shares(expires_at);
