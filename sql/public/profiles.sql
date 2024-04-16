-- SQL Editor > New query
-- https://supabase.com/docs/guides/auth/managing-user-data

drop table if exists profiles;

create table profiles (
  id uuid not null references auth.users on delete cascade primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  username text unique not null,
  email varchar(255),
  full_name text,
  first_name text,
  last_name text,
  age integer,
  avatar_url text,
  website text,
  bio text
);

-- Secure the table
alter table profiles enable row level security;

-- Add row-level security
create policy "Public profiles are viewable by everyone." on profiles for select to authenticated, anon using ( true );
-- create policy "Users can insert their own profile." on profiles for insert to authenticated with check ( auth.uid() = id );
create policy "Users can update their own profile." on profiles for update to authenticated using ( auth.uid() = id );
-- create policy "Users can delete their own profile." on profiles for delete to authenticated using ( auth.uid() = id );

-- Update a column timestamp on every update.
create extension if not exists moddatetime schema extensions;

-- assuming the table name is "profiles", and a timestamp column "updated_at"
-- this trigger will set the "updated_at" column to the current timestamp for every update
drop trigger if exists handle_updated_at on profiles;

create trigger handle_updated_at before update on profiles
  for each row execute procedure moddatetime (updated_at);

-- Trigger the function every time a username is updated
drop trigger if exists on_username_updated on profiles;
drop function if exists handle_username_changed_at;

create or replace function handle_username_changed_at()
returns trigger
security definer set search_path = public
as $$
begin
  update users set username_changed_at = now() where id = new.id;
  return new;
end;
$$ language plpgsql;

create trigger on_username_updated
  after update of username on profiles
  for each row execute function handle_username_changed_at();
