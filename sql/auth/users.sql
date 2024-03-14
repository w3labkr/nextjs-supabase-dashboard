-- SQL Editor > New query
-- https://supabase.com/docs/guides/auth/managing-user-data

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user;

create or replace function handle_new_user()
returns trigger language plpgsql
security definer set search_path = public
as $$
declare
  new_username text;
begin
  new_username := generate_username(new.email);
  new_username := substr(new_username, 1, 255);

  insert into
    accounts (id, username, has_set_password)
  values (
    new.id,
    new_username,
    case when new.encrypted_password is null or new.encrypted_password = '' then false else true end
  );

  insert into
    profiles (user_id, username, name, avatar_url)
  values (
    new.id,
    new_username,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'avatar_url'
  );

  insert into
    emails (user_id, email, email_confirmed_at)
  values (
    new.id,
    new.email,
    new.email_confirmed_at
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
