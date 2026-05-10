-- Migration: 002_access_tokens.sql
-- Fügt access_token + quiz_submission_id zu subscriptions hinzu.
-- access_token ist der "Magic Link"-Key in der Welcome-Mail.

alter table public.subscriptions
  add column if not exists access_token uuid default gen_random_uuid();

alter table public.subscriptions
  add column if not exists quiz_submission_id uuid;

create index if not exists subscriptions_token_idx
  on public.subscriptions(access_token);

create index if not exists subscriptions_quiz_idx
  on public.subscriptions(quiz_submission_id);

comment on column public.subscriptions.access_token is
  'Token in Welcome-Mail-Link zur passwortlosen Rückkehr ins Dashboard.';
comment on column public.subscriptions.quiz_submission_id is
  'Verknüpfung zur Quiz-Submission, auf deren Basis das Abo gekauft wurde.';
