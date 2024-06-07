----------------------------------------------------------------
--                                                            --
--                         auth.users                         --
--                                                            --
----------------------------------------------------------------

-- Call a Postgres function
-- https://supabase.com/docs/reference/javascript/rpc

drop trigger if exists on_auth_user_password_updated on auth.users;
drop trigger if exists on_auth_user_created on auth.users;

drop function if exists generate_password;
drop function if exists generate_username;
drop function if exists handle_has_set_password;
drop function if exists handle_new_user;
drop function if exists create_new_user;
drop function if exists assign_user_data;

----------------------------------------------------------------

create or replace function generate_password()
returns text
security definer set search_path = public
as $$
begin
  return trim(both from (encode(decode(md5(random()::text || current_timestamp || random()),'hex'),'base64')), '=');
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function generate_username(email text)
returns text
security definer set search_path = public
as $$
declare
  new_username text;
  username_exists boolean;
begin
  -- generate username based on email address
  new_username := lower(split_part(email, '@', 1));

  -- check if username already exists in users table
  select exists(select 1 from users where username = new_username) into username_exists;

  -- increase username length gradually if needed
  while username_exists loop
    new_username := new_username || '_' || to_char(trunc(random()*1000000), 'fm000000');
    select exists(select 1 from users where username = new_username) into username_exists;
  end loop;

  return new_username;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function handle_has_set_password()
returns trigger
security definer set search_path = public
as $$
declare
  new_has_set_password boolean;
begin
  new_has_set_password := case when (new.encrypted_password is null or new.encrypted_password = '') then false else true end;
  update users set has_set_password = new_has_set_password where id = new.id;
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_password_updated after update of encrypted_password on auth.users
  for each row execute function handle_has_set_password();

----------------------------------------------------------------

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

  insert into users
  (id, has_set_password, username, full_name, avatar_url)
  values
  (new.id, new_has_set_password, new_username, new_username, new.raw_user_meta_data ->> 'avatar_url');
  insert into emails (user_id, email) values (new.id, new.email);
  insert into user_roles (user_id) values (new.id);
  insert into user_plans (user_id) values (new.id);
  insert into notifications (user_id) values (new.id);

  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure handle_new_user();

----------------------------------------------------------------

create or replace function create_new_user(useremail text, password text = null, metadata JSONB = '{}'::JSONB)
returns uuid
as $$
declare
  user_id uuid;
  encrypted_pw text;
  app_metadata jsonb;
begin
  select id into user_id from auth.users where email = useremail;

  if user_id is null then
    user_id := gen_random_uuid();
    encrypted_pw := crypt(password, gen_salt('bf'));
    app_metadata := '{"provider":"email","providers":["email"]}'::jsonb || metadata::jsonb;

    insert into auth.users
    (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, confirmation_sent_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    values
    ('00000000-0000-0000-0000-000000000000', user_id, 'authenticated', 'authenticated', useremail, encrypted_pw, now(), now(), now(), now(), app_metadata, '{}', now(), now(), '', '', '', '');

    insert into auth.identities
    (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    values
    (gen_random_uuid(), user_id, format('{"sub":"%s","email":"%s"}', user_id::text, useremail)::jsonb, 'email', now(), now(), now());
  end if;

  return user_id;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function assign_user_data()
returns void
security definer set search_path = public
as $$
declare
  r record;
  new_username text;
  new_has_set_password boolean;
begin
  for r in (select * from auth.users) loop

    new_username := generate_username(r.email);
    new_username := substr(new_username, 1, 255);
    new_has_set_password := case when r.encrypted_password is null or r.encrypted_password = '' then false else true end;

    insert into users
    (id, has_set_password, username, full_name, avatar_url)
    values
    (r.id, new_has_set_password, new_username, new_username, r.raw_user_meta_data ->> 'avatar_url');
    insert into emails (user_id, email) values (r.id, r.email);
    insert into user_roles (user_id) values (r.id);
    insert into user_plans (user_id) values (r.id);
    insert into notifications (user_id) values (r.id);

  end loop;
end;
$$ language plpgsql;
