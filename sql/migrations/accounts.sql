-- SQL Editor > New query
-- select init_accounts();

drop function if exists init_accounts;

create or replace function init_accounts()
returns void language plpgsql
security definer
as $$
declare
  r record;
  new_username text;
begin

  for r in (select * from auth.users) LOOP
    new_username := generate_username(r.email);
    new_username := substr(new_username, 1, 255);

    insert into
      accounts (id, username, has_set_password)
    values (
      r.id,
      new_username,
      case when r.encrypted_password is null or r.encrypted_password = '' then false else true end
    );
  END LOOP;

end;
$$;

select init_accounts();
drop function if exists init_accounts;
