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
  new_has_set_password boolean;
begin
  new_username := generate_username(new.email);
  new_username := substr(new_username, 1, 255);
  new_has_set_password := case when new.encrypted_password is null or new.encrypted_password = '' then false else true end;

  insert into users (id, username, has_set_password) values (new.id, new_username, new_has_set_password);
  insert into profiles (user_id, name, avatar_url) values (new.id, new_username, new.raw_user_meta_data ->> 'avatar_url');
  insert into emails (user_id, email) values (new.id, new.email);
  insert into user_roles (user_id, role) values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
