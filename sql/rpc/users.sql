-- const { data, error } = await supabase.rpc('get_user', { uid: '' });
-- select * from get_user('uid');

drop function if exists get_user;

create or replace function get_user(uid uuid)
returns table(
  id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  deleted_at timestamptz,
  username_changed_at timestamptz,
  has_set_password boolean,
  is_ban boolean,
  banned_until timestamptz,
  role text,
  plan text
)
security definer set search_path = public
as $$
begin
	return query
  select
    u.*, ur."role", up."plan"
  from users u
    join user_roles ur on u.id = ur.user_id
    join user_plans up on u.id = up.user_id
  where u.id = uid;
end;
$$ language plpgsql;

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
