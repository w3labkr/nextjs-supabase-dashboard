-- SQL Editor > New query
-- https://supabase.com/docs/guides/auth/managing-user-data

drop table if exists emails;
drop table if exists posts;
drop table if exists profiles;
drop table if exists user_roles;
drop table if exists users;

create table users (
  id uuid not null references auth.users on delete cascade primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz,
  username text not null,
  raw_appearance jsonb,
  has_set_password boolean default false,
  is_ban boolean default false,
  banned_until timestamptz,
  unique (username)
);
comment on column users.has_set_password is 'handle_has_set_password';

-- Secure the table
alter table users enable row level security;

-- Add row-level security
create policy "Users can view their users." on users for select to authenticated using ( auth.uid() = id );
create policy "Users can insert their own user." on users for insert to authenticated with check ( auth.uid() = id );
create policy "Users can update their own user." on users for update to authenticated using ( auth.uid() = id );
-- create policy "Users can delete their own user." on users for delete to authenticated using ( auth.uid() = id );

-- Update a column timestamp on every update.
create extension if not exists moddatetime schema extensions;

-- assuming the table name is "users", and a timestamp column "updated_at"
-- this trigger will set the "updated_at" column to the current timestamp for every update
drop trigger if exists handle_updated_at on users;

create trigger handle_updated_at before update on users
  for each row execute procedure moddatetime (updated_at);
