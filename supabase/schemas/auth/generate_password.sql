-- select generate_password();

drop function if exists generate_password;

----------------------------------------------------------------

create or replace function generate_password()
returns text
security definer set search_path = public
as $$
begin
  return trim(both from (encode(decode(md5(random()::text || current_timestamp || random()),'hex'),'base64')), '=');
end;
$$ language plpgsql;
