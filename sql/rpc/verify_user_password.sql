-- SQL Editor > New query
-- const { data, error } = await supabase.rpc('verify_user_password', {
--   password: ''
-- });

drop function if exists verify_user_password;

create or replace function verify_user_password(password text)
returns boolean language plpgsql
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
