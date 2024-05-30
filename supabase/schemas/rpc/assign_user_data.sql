-- select assign_user_data();

drop function if exists assign_user_data;

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
