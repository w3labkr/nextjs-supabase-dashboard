-- SQL Editor > New query

drop function if exists migration_user_data;

create or replace function migration_user_data()
returns void
security definer
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

    insert into users (id, has_set_password) values (r.id, new_has_set_password);
    insert into profiles (id, username, full_name, avatar_url) values (r.id, new_username, new_username, r.raw_user_meta_data ->> 'avatar_url');
    insert into emails (user_id, email) values (r.id, r.email);
    insert into user_roles (user_id) values (r.id);
    insert into user_plans (user_id) values (r.id);
    insert into notifications (user_id) values (r.id);

  end loop;

end;
$$ language plpgsql;

select migration_user_data();

drop function migration_user_data;

-- SQL Editor > New query

drop function if exists create_new_user;

create or replace function create_new_user(email text, password text)
returns uuid
as $$
declare
  user_id uuid;
  encrypted_pw text;
begin
  user_id := gen_random_uuid();
  encrypted_pw := crypt(password, gen_salt('bf'));

  insert into auth.users
  (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
  values
  ('00000000-0000-0000-0000-000000000000', user_id, 'authenticated', 'authenticated', email, encrypted_pw, '2023-05-03 19:41:43.585805+00', '2023-04-22 13:10:03.275387+00', '2023-04-22 13:10:31.458239+00', '{"provider":"email","providers":["email"]}', '{}', '2023-05-03 19:41:43.580424+00', '2023-05-03 19:41:43.585948+00', '', '', '', '');

  insert into auth.identities
  (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values
  (gen_random_uuid(), user_id, format('{"sub":"%s","email":"%s"}', user_id::text, email)::jsonb, 'email', '2023-05-03 19:41:43.582456+00', '2023-05-03 19:41:43.582497+00', '2023-05-03 19:41:43.582497+00');

  return user_id;
end;
$$ language plpgsql;

select create_new_user('username@example.com', '123456789');

drop function create_new_user;
