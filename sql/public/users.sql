-- SQL Editor > New query
-- https://supabase.com/docs/guides/auth/managing-user-data

drop trigger if exists handle_updated_at on users;

drop function if exists verify_user_password;
drop function if exists get_user;

drop table if exists users;

create table users (
  id uuid not null references auth.users on delete cascade primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  deleted_at timestamptz,
  username_changed_at timestamptz,
  has_set_password boolean default false not null,
  is_ban boolean default false not null,
  banned_until timestamptz
);
comment on column users.has_set_password is 'handle_has_set_password';

-- Secure the table
alter table users enable row level security;

-- Add row-level security
create policy "Users can view their users." on users for select to authenticated using ( (select auth.uid()) = id );
create policy "Users can insert their own user." on users for insert to authenticated with check ( (select auth.uid()) = id );
create policy "Users can update their own user." on users for update to authenticated using ( (select auth.uid()) = id );
create policy "Users can delete their own user." on users for delete to authenticated using ( (select auth.uid()) = id );

-- Update a column timestamp on every update.
create extension if not exists moddatetime schema extensions;

-- assuming the table name is "users", and a timestamp column "updated_at"
-- this trigger will set the "updated_at" column to the current timestamp for every update
create trigger handle_updated_at before update on users
  for each row execute procedure moddatetime (updated_at);

-- const { data, error } = await supabase.rpc('get_user', { uid: '' });
-- select * from get_user('uid');

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
