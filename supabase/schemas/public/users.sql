----------------------------------------------------------------
--                                                            --
--                        public.users                        --
--                                                            --
----------------------------------------------------------------

-- User Management
-- https://supabase.com/docs/guides/auth/managing-user-data

----------------------------------------------------------------

-- Functions for tracking last modification time
create extension if not exists moddatetime schema extensions;

----------------------------------------------------------------

drop trigger if exists on_updated_at on users;
drop trigger if exists on_username_updated on users;

drop function if exists verify_user_password;
drop function if exists handle_username_changed_at;

drop table if exists users;

----------------------------------------------------------------

create table users (
  id uuid not null references auth.users on delete cascade primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  deleted_at timestamptz,
  email varchar(255),
  full_name text,
  first_name text,
  last_name text,
  age integer,
  avatar_url text,
  website text,
  bio text,
  username text not null,
  username_changed_at timestamptz,
  has_set_password boolean default false not null,
  is_ban boolean default false not null,
  banned_until timestamptz,
  unique (username)
);
comment on column users.has_set_password is 'handle_has_set_password';
comment on column users.username_changed_at is 'handle_username_changed_at';

-- Secure the table
alter table users enable row level security;

-- Add row-level security
create policy "Public access for all users" on users for select to authenticated, anon using ( true );
create policy "User can insert their own users" on users for insert to authenticated with check ( (select auth.uid()) = id );
create policy "User can update their own users" on users for update to authenticated using ( (select auth.uid()) = id );
create policy "User can delete their own users" on users for delete to authenticated using ( (select auth.uid()) = id );

-- Trigger for tracking last modification time
create trigger on_updated_at before update on users
  for each row execute procedure moddatetime (updated_at);

-- const { data, error } = await supabase.rpc('verify_user_password', { userid: '', password: '' });
-- select * from verify_user_password('userid', 'password');

create or replace function verify_user_password(userid uuid, password text)
returns boolean
security definer set search_path = public, extensions, auth
as $$
begin
  return exists (
    select id
    from auth.users
    where id = userid
      and encrypted_password = crypt(password::text, auth.users.encrypted_password)
  );
end;
$$ language plpgsql;

-- Trigger the function every time a username is updated

create or replace function handle_username_changed_at()
returns trigger
security definer set search_path = public
as $$
begin
  update users set username_changed_at = now() where id = new.id;
  return new;
end;
$$ language plpgsql;

create trigger on_username_updated after update of username on users
  for each row execute function handle_username_changed_at();
