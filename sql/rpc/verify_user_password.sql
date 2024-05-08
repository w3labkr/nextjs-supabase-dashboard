-- SQL Editor > New query
-- const { data, error } = await supabase.rpc('verify_user_password', { uid: '', password: '' });
-- select * from verify_user_password('uid', 'password');

drop function if exists verify_user_password;

create or replace function verify_user_password(uid uuid, password text)
returns boolean
security definer set search_path = public, extensions, auth
as $$
begin
  return exists (
    select id
    from auth.users
    where id = uid
      and encrypted_password = crypt(password::text, auth.users.encrypted_password)
  );
end;
$$ language plpgsql;
