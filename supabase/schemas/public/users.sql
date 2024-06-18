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

drop function if exists handle_username_changed_at;
drop function if exists get_users;

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
comment on column users.updated_at is 'on_updated_at';
comment on column users.username_changed_at is 'on_username_updated';
comment on column users.has_set_password is 'on_encrypted_password_updated';

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
  return new;
end;
$$ language plpgsql;

create trigger on_username_updated after update of username on users
  for each row execute function handle_username_changed_at();

----------------------------------------------------------------

create or replace function get_users(userrole text = null, userplan text = null)
returns setof users
security definer set search_path = public
as $$
begin
	if userrole is not null and userplan is not null then
		return query
      select u.*
      from users u
        join user_roles ur on u.id = ur.user_id
        join user_plans up on u.id = up.user_id
      where ur.role = userrole and up.plan = userplan;
	elsif userrole is not null then
		return query
      select u.*
      from users u join user_roles ur on u.id = ur.user_id
      where ur.role = userrole;
	elsif userplan is not null then
    return query
      select u.*
      from users u join user_plans up on u.id = up.user_id
      where up.plan = userplan;
	end if;
end;
$$ language plpgsql;
