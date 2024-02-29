-- const { data, error } = await supabase.rpc('verify_user_email_and_password', {
--   user_email: '',
--   user_password: ''
-- });

create or replace function public.verify_user_email_and_password(user_email text, user_password text)
returns boolean
language plpgsql
security definer set search_path = extensions, public, auth
as $$
declare
  user_id uuid;
begin
  user_id := auth.uid();
  return exists (
    select id
    from auth.users
    where id = user_id
      and email = user_email
      and encrypted_password = crypt(user_password::text, auth.users.encrypted_password)
  );
end;
$$;

-- const { data, error } = await supabase.rpc('verify_user_password', {
--   password: ''
-- });

create or replace function public.verify_user_password(password text)
returns boolean
language plpgsql
security definer set search_path = extensions, public, auth
as $$
declare
  user_id uuid;
begin
  user_id := auth.uid();
  return exists (
    select id
    from auth.users
    where id = user_id and encrypted_password = crypt(password::text, auth.users.encrypted_password)
  );
end;
$$;

-- const { data, error } = await supabase.rpc('delete_user');

create or replace function delete_user()
returns void
language sql security definer
as $$
	delete from auth.users where id = auth.uid();
$$;
