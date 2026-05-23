-- Migration 0005: Row-Level-Security

-- PROFILES
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

-- PURCHASES
alter table public.purchases enable row level security;

create policy "Users can view own purchases"
  on public.purchases for select using (auth.uid() = user_id);

-- TASK TEMPLATES (read-only für authenticated)
alter table public.task_templates enable row level security;

create policy "Authenticated can view active templates"
  on public.task_templates for select
  using (auth.role() = 'authenticated' and active = true);

-- TASKS
alter table public.tasks enable row level security;

create policy "Users can view own tasks"
  on public.tasks for select using (auth.uid() = user_id);

create policy "Users can update own tasks"
  on public.tasks for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete own tasks"
  on public.tasks for delete using (auth.uid() = user_id);

-- DOCUMENTS (Insert nur für Lifetime-User)
alter table public.documents enable row level security;

create policy "Users can view own documents"
  on public.documents for select using (auth.uid() = user_id);

create policy "Lifetime users can create documents"
  on public.documents for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and lifetime_purchased_at is not null
    )
  );

create policy "Users can update own documents"
  on public.documents for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete own documents"
  on public.documents for delete using (auth.uid() = user_id);

-- DOCUMENT SHARES
alter table public.document_shares enable row level security;

create policy "Users can view own shares"
  on public.document_shares for select using (auth.uid() = user_id);

create policy "Users can create own shares"
  on public.document_shares for insert with check (auth.uid() = user_id);

create policy "Users can delete own shares"
  on public.document_shares for delete using (auth.uid() = user_id);

-- MAIL QUEUE + LOG: nur service_role
alter table public.mail_queue enable row level security;
alter table public.mail_log enable row level security;
