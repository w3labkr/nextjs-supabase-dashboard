-- SQL Editor > New query
-- https://supabase.com/docs/guides/auth/managing-user-data

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user;

create or replace function handle_new_user()
returns trigger
security definer set search_path = public
as $$
declare
  new_username text;
  new_has_set_password boolean;
begin
  new_username := generate_username(new.email);
  new_username := substr(new_username, 1, 255);
  new_has_set_password := case when new.encrypted_password is null or new.encrypted_password = '' then false else true end;

  insert into users (id, has_set_password) values (new.id, new_has_set_password);
  insert into profiles (id, username, full_name, avatar_url) values (new.id, new_username, new_username, new.raw_user_meta_data ->> 'avatar_url');
  insert into emails (user_id, email) values (new.id, new.email);
  insert into user_roles (user_id) values (new.id);
  insert into notifications (user_id) values (new.id);

  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
