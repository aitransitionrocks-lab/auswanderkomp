-- Migration 0006: Storage Bucket Policies
-- WICHTIG: Vorher Bucket 'documents' im Supabase Dashboard erstellen:
--   - Public: false
--   - File-Size-Limit: 25 MB
--   - Allowed MIME: application/pdf, image/jpeg, image/png, image/heic,
--                   application/msword,
--                   application/vnd.openxmlformats-officedocument.wordprocessingml.document
-- Pfad-Pattern: users/{user_id}/documents/{file_id}.ext
-- foldername()[1] = 'users', foldername()[2] = '{user_id}'

create policy "Users can upload to own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[2]
  );

create policy "Users can read own files"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[2]
  );

create policy "Users can delete own files"
  on storage.objects for delete
  using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[2]
  );
