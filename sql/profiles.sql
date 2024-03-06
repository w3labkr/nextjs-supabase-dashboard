-- SQL Editor > New query

drop table public.profiles;

create table public.profiles (
  id uuid not null primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz,
  user_id uuid not null references auth.users on delete cascade,
  avatar_url text default ''::text,
  email text default ''::text,
  full_name text default ''::text,
  name text default ''::text,
  picture text default ''::text,
  bio text default ''::text,
  deleted_at timestamptz
);

alter table public.profiles enable row level security;

-- Indexes

create index profiles_user_id_idx on profiles using btree (user_id);

-- Update a column timestamp on every update.
create extension if not exists moddatetime schema extensions;

-- assuming the table name is "profiles", and a timestamp column "updated_at"
-- this trigger will set the "updated_at" column to the current timestamp for every update
drop trigger if exists handle_updated_at on profiles;

create trigger handle_updated_at before update on profiles
  for each row execute procedure moddatetime (updated_at);

-- inserts a row into public.profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into
    public.profiles (user_id,avatar_url,email,full_name,name,picture)
  values (
    new.id,
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'email',
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'picture'
  );
  return new;
end;
$$;

-- trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- policies

create policy "Public profiles are visible to everyone."
  on profiles for select
  using ( true );

create policy "Users can create a profile."
  on profiles for insert
  to authenticated
  with check ( auth.uid() = user_id );

create policy "Users can update their own profile."
  on profiles for update
  to authenticated
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

create policy "Users can delete a profile."
  on profiles for delete
  to authenticated
  using ( auth.uid() = user_id );
