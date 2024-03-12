-- SQL Editor > New query
-- https://supabase.com/docs/guides/auth/managing-user-data

drop table if exists profiles;

create table profiles (
  id uuid not null references auth.users on delete cascade primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  username varchar(255) not null unique,
  email varchar(255) not null unique,
  avatar_url text,
  full_name text,
  name text,
  bio text,
  has_set_password bool default false
);

-- Secure the table
alter table profiles enable row level security;

-- Add row-level security
create policy "Public profiles are visible to everyone." on profiles for select to authenticated, anon using ( true );
-- create policy "Users can create a profile." on profiles for insert to authenticated with check ( auth.uid() = id );
create policy "Users can update their own profile." on profiles for update to authenticated using ( auth.uid() = id );
-- create policy "Users can delete a profile." on profiles for delete to authenticated using ( auth.uid() = id );

-- Update a column timestamp on every update.
-- create extension if not exists moddatetime schema extensions;

-- assuming the table name is "profiles", and a timestamp column "updated_at"
-- this trigger will set the "updated_at" column to the current timestamp for every update
drop trigger if exists handle_updated_at on profiles;

create trigger handle_updated_at before update on profiles
  for each row execute procedure moddatetime (updated_at);

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user;

create or replace function handle_new_user()
returns trigger
as $$
begin
  insert into
    profiles (id, username, email, avatar_url, full_name, name, has_set_password)
  values (
    new.id,
    generate_username(new.email),
    new.email,
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    case when new.encrypted_password is null or new.encrypted_password = '' then false else true end
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Trigger the function every time a user password is updated
drop trigger if exists on_auth_user_password_updated on auth.users;
drop function if exists handle_has_set_password;

create or replace function handle_has_set_password()
returns trigger
as $$
begin
  update profiles
  set has_set_password = case when (new.encrypted_password is null or new.encrypted_password = '') then false else true end
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_password_updated
  after update of encrypted_password on auth.users
  for each row execute function handle_has_set_password();

-- Generate unique username
drop function if exists generate_username;

create or replace function generate_username(email text)
returns text
as $$
declare
  username_new text;
  username_exists boolean;
begin
  -- generate username based on email address
  username_new = lower(split_part(email, '@', 1));

  -- check if username already exists in profiles table
  select exists(select 1 from profiles where username = username_new) into username_exists;

  -- increase username length gradually if needed
  while username_exists loop
    username_new = username_new || '_' || to_char(trunc(random()*1000000), 'fm000000');
    select exists(select 1 from profiles where username = username_new) into username_exists;
  end loop;

  return username_new;
end;
$$ language plpgsql security definer;

-- Insert all of the user's profiles
drop function if exists inserts_profiles;

create or replace function inserts_profiles()
returns void
as $$
declare
  r record;
begin

  alter table profiles drop constraint profiles_pkey;
  alter table profiles drop constraint profiles_id_fkey;

  for r in (select * from auth.users) LOOP
    insert into profiles (id, username, email, avatar_url, full_name, name, has_set_password)
    values (
      r.id,
      generate_username(r.email),
      r.email,
      r.raw_user_meta_data ->> 'avatar_url',
      r.raw_user_meta_data ->> 'full_name',
      r.raw_user_meta_data ->> 'name',
      case when r.encrypted_password is null or r.encrypted_password = '' then false else true end
    );
  END LOOP;

  alter table profiles add constraint profiles_id_fkey foreign key(id) references auth.users(id) on delete cascade;
  alter table profiles add primary key (id);

end;
$$ language plpgsql security definer;

select inserts_profiles();
