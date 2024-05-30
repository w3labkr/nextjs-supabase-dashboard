-- select create_new_user('username@example.com', '123456789');

drop function if exists create_new_user;

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
