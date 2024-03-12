-- SQL Editor > New query

-- const { data, error } = await supabase.rpc('verify_user_password', {
--   password: ''
-- });
drop function if exists verify_user_password;

create or replace function verify_user_password(password text)
returns boolean
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
$$ language plpgsql security definer set search_path = extensions, public, auth;

-- const { error } = await supabase.rpc('delete_user');

drop function if exists delete_user;

create or replace function delete_user()
returns void
as $$
	delete from auth.users where id = auth.uid();
$$ language sql security definer;
