-- SQL Editor > New query
-- select init_emails();

drop function if exists init_emails;

create or replace function init_emails()
returns void language plpgsql
security definer
as $$
declare
  r record;
begin

  for r in (select * from auth.users) LOOP
    insert into emails (user_id, email) values (r.id, r.email);
  END LOOP;

end;
$$;

select init_emails();
drop function if exists init_emails;
