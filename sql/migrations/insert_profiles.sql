-- SQL Editor > New query
-- select insert_profiles();

drop function if exists insert_profiles;

create or replace function insert_profiles()
returns void language plpgsql
security definer
as $$
declare
  r record;
begin

  alter table profiles drop constraint profiles_pkey;
  alter table profiles drop constraint profiles_id_fkey;

  for r in (select * from auth.users) LOOP
    insert into
      profiles (user_id, username, name, avatar_url)
    values (
      r.id,
      generate_username(r.email),
      r.raw_user_meta_data ->> 'name',
      r.raw_user_meta_data ->> 'avatar_url'
    );
  END LOOP;

  alter table profiles add constraint profiles_id_fkey foreign key(id) references auth.users(id) on delete cascade;
  alter table profiles add primary key (id);

end;
$$;

