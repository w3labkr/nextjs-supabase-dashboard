-- SQL Editor > New query
-- select init_profiles();

drop function if exists init_profiles;

create or replace function init_profiles()
returns void language plpgsql
security definer
as $$
declare
  r record;
begin

  for r in (select u.*, a.username from auth.users as u join accounts as a on u.id = a.id) LOOP
    insert into
      profiles (id, username, name, avatar_url)
    values (
      r.id,
      generate_username(r.email),
      r.raw_user_meta_data ->> 'name',
      r.raw_user_meta_data ->> 'avatar_url'
    );
  END LOOP;

end;
$$;

select init_profiles();
drop function if exists init_profiles;
