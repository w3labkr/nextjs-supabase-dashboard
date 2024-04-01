-- SQL Editor > New query

drop function if exists migration_user_data;

create or replace function migration_user_data()
returns void language plpgsql
security definer
as $$
declare
  r record;
  new_username text;
  new_has_set_password boolean;
begin

  for r in (select * from auth.users) LOOP
    new_username := generate_username(r.email);
    new_username := substr(new_username, 1, 255);
    new_has_set_password := case when r.encrypted_password is null or r.encrypted_password = '' then false else true end;

    insert into users (id, username, has_set_password) values (r.id, new_username, new_has_set_password);
    insert into profiles (user_id, name, avatar_url) values (r.id, new_username, r.raw_user_meta_data ->> 'avatar_url');
    insert into emails (user_id, email) values (r.id, r.email);
    insert into user_roles (user_id) values (r.id);
    insert into notifications (user_id) values (r.id);
    insert into appearances (user_id) values (r.id);

  END LOOP;

end;
$$;

select migration_user_data();

drop function migration_user_data;
