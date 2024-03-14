-- SQL Editor > New query
-- https://supabase.com/docs/guides/auth/managing-user-data

drop table if exists profiles;
drop table if exists accounts;

create table accounts (
  id uuid not null references auth.users on delete cascade primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  username varchar(255) not null unique,
  has_set_password bool default false
);

-- Secure the table
alter table accounts enable row level security;

-- Add row-level security
create policy "Public accounts are viewable by users who created them." on accounts for select to authenticated using ( auth.uid() = id );
-- create policy "Users can insert their own account." on accounts for insert to authenticated with check ( auth.uid() = id );
create policy "Users can update their own account." on accounts for update to authenticated using ( auth.uid() = id );
-- create policy "Users can delete their own account." on accounts for delete to authenticated using ( auth.uid() = id );

-- Update a column timestamp on every update.
create extension if not exists moddatetime schema extensions;

-- assuming the table name is "accounts", and a timestamp column "updated_at"
-- this trigger will set the "updated_at" column to the current timestamp for every update
drop trigger if exists handle_updated_at on accounts;

create trigger handle_updated_at before update on accounts
  for each row execute procedure moddatetime (updated_at);

-- Trigger the function every time a user password is updated
drop trigger if exists on_auth_user_password_updated on auth.users;
drop function if exists handle_has_set_password;

create or replace function handle_has_set_password()
returns trigger language plpgsql
security definer set search_path = public
as $$
begin
  update accounts
  set has_set_password = case when (new.encrypted_password is null or new.encrypted_password = '') then false else true end
  where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_password_updated
  after update of encrypted_password on auth.users
  for each row execute function handle_has_set_password();
