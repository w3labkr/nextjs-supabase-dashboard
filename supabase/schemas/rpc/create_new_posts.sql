-- select create_new_posts('username@example.com');

drop function if exists create_new_posts;

----------------------------------------------------------------

create or replace function create_new_posts(useremail text)
returns void
security definer set search_path = public
as $$
declare
  userid uuid;
begin
  select id into userid from auth.users where email = useremail;

  if userid is not null then
    insert into posts
    (date, user_id, status, title, slug, content)
    values
    (now(), userid, 'publish', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', 'lorem-ipsum-dolor-sit-amet-consectetur-adipiscing-elit', 'Aenean pellentesque tortor non velit posuere, ut fringilla libero egestas.'),
    (now(), userid, 'publish', 'Integer in dui vel nibh hendrerit ultrices', 'integer-in-dui-vel-nibh-hendrerit-ultrices', 'Vestibulum porta eros ornare nisi lacinia accumsan.'),
    (now() + interval '10 minutes', userid, 'future', 'Posted 1 hour later', 'posted-1-hour-later', 'Vivamus commodo turpis volutpat neque varius commodo.');
  end if;

end;
$$ language plpgsql;
