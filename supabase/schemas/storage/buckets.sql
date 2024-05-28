
-- Use Supabase to store and serve files.
-- https://supabase.com/docs/guides/storage

delete from storage.objects where bucket_id = 'my_bucket_id';
delete from storage.buckets where id = 'my_bucket_id';

drop policy if exists "Public access for all users" on storage.objects;
drop policy if exists "User can upload in their own folders" on storage.objects;
drop policy if exists "User can update their own objects" on storage.objects;
drop policy if exists "User can delete their own objects" on storage.objects;

----------------------------------------------------------------

insert into storage.buckets (id, name, public) values ('my_bucket_id', 'my_bucket_id', true);

-- Add row-level security
create policy "Public access for all users" on storage.objects
  for select to authenticated, anon using (bucket_id = 'my_bucket_id');
create policy "User can upload in their own folders" on storage.objects
  for insert to authenticated with check (bucket_id = 'my_bucket_id' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "User can update their own objects" on storage.objects
  for update to authenticated using (owner_id = (select auth.uid()::text));
create policy "User can delete their own objects" on storage.objects
  for delete to authenticated using (owner_id = (select auth.uid()::text));

