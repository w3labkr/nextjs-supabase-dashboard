----------------------------------------------------------------
--                                                            --
--                        public.users                        --
--                                                            --
----------------------------------------------------------------

-- User Management
-- https://supabase.com/docs/guides/auth/managing-user-data

----------------------------------------------------------------

-- drop type if exists public.type_name;
-- create type public.type_name as enum ('type_value', 'type_value');
-- alter type public.type_name add value 'new_type';
-- alter type public.type_name rename value 'old_type' to 'new_type';
-- alter type public.type_name rename to new_type_name;

----------------------------------------------------------------

-- Functions for tracking last modification time
create extension if not exists moddatetime schema extensions;

----------------------------------------------------------------

drop trigger if exists on_updated_at on users;
drop trigger if exists on_username_updated on users;
drop trigger if exists on_role_updated on users;
drop trigger if exists on_plan_updated on users;

drop function if exists handle_username_changed_at;
drop function if exists handle_role_changed_at;
drop function if exists handle_plan_changed_at;
drop function if exists set_user_role;
drop function if exists set_user_plan;
drop function if exists get_users;

drop table if exists users;

----------------------------------------------------------------

-- Create a table
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
  role text default 'guest'::text not null,
  role_changed_at timestamptz,
  plan text default 'free'::text not null,
  plan_changed_at timestamptz,
  is_ban boolean default false not null,
  banned_until timestamptz,
  unique (username)
);
comment on column users.updated_at is 'on_updated_at';
comment on column users.username_changed_at is 'on_username_updated';
comment on column users.has_set_password is 'on_encrypted_password_updated';
comment on column users.role is 'guest, user, admin, superadmin';
comment on column users.role_changed_at is 'on_role_updated';
comment on column users.plan is 'free, basic, standard, premium';
comment on column users.plan_changed_at is 'on_plan_updated';

-- Add table indexing
create index users_username_idx on users (username);
create index users_role_idx on users (role);
create index users_plan_idx on users (plan);

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

----------------------------------------------------------------

create or replace function handle_username_changed_at()
returns trigger
security definer set search_path = public
as $$
begin
  update users set username_changed_at = now() where id = new.id;

  update posts
  set permalink = replace(permalink, old.username, new.username)
  where user_id = new.id and permalink like '%/'|| old.username ||'/%';

  update statistics
  set path = replace(path, old.username, new.username),
      location = replace(location, old.username, new.username),
      referrer = replace(referrer, old.username, new.username)
  where path like '/'|| old.username ||'/%';

  return new;
end;
$$ language plpgsql;

create trigger on_username_updated after update of username on users
  for each row execute function handle_username_changed_at();

----------------------------------------------------------------

create or replace function handle_role_changed_at()
returns trigger
security definer set search_path = public
as $$
begin
  update users set role_changed_at = now() where id = new.id;
  return new;
end;
$$ language plpgsql;

create trigger on_role_updated after update of role on users
  for each row execute function handle_role_changed_at();

----------------------------------------------------------------

create or replace function handle_plan_changed_at()
returns trigger
security definer set search_path = public
as $$
begin
  update users set plan_changed_at = now() where id = new.id;
  return new;
end;
$$ language plpgsql;

create trigger on_plan_updated after update of plan on users
  for each row execute function handle_plan_changed_at();

----------------------------------------------------------------

create or replace function set_user_role(userrole text, userid uuid = null, useremail text = null)
returns void
security definer set search_path = public
as $$
begin
  if userid is not null and useremail is not null then
    update users u set role = userrole from auth.users au where au.id = u.id and au.id = userid and au.email = useremail;
  elsif userid is not null then
    update users u set role = userrole from auth.users au where au.id = u.id and au.id = userid;
  elsif useremail is not null then
    update users u set role = userrole from auth.users au where au.id = u.id and au.email = useremail;
  end if;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function set_user_plan(userplan text, userid uuid = null, useremail text = null)
returns void
security definer set search_path = public
as $$
begin
  if userid is not null and useremail is not null then
    update users u set plan = userplan from auth.users au where au.id = u.id and au.id = userid and au.email = useremail;
  elsif userid is not null then
    update users u set plan = userplan from auth.users au where au.id = u.id and au.id = userid;
  elsif useremail is not null then
    update users u set plan = userplan from auth.users au where au.id = u.id and au.email = useremail;
  end if;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function get_users(userrole text = null, userplan text = null)
returns setof users
security definer set search_path = public
as $$
begin
	if userrole is not null and userplan is not null then
		return query
    select * from users where role = userrole and plan = userplan;
	elsif userrole is not null then
		return query
    select * from users where role = userrole;
	elsif userplan is not null then
    return query
    select * from users where plan = userplan;
	end if;
end;
$$ language plpgsql;
