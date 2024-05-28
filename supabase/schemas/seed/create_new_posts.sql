-- select create_new_posts('username@example.com');

drop function if exists create_new_posts;

----------------------------------------------------------------

create or replace function create_new_posts(useremail text)
returns void
security definer set search_path = public
as $$
declare
  r record;
  userid uuid;
begin
  select id into userid from auth.users where email = useremail;

  if userid is not null then
    insert into posts
    (published_at, user_id, status, title, slug, content)
    values
    (now(), userid, 'publish', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', 'lorem-ipsum-dolor-sit-amet-consectetur-adipiscing-elit', 'Aenean pellentesque tortor non velit posuere, ut fringilla libero egestas.'),
    (now(), userid, 'publish', 'Integer in dui vel nibh hendrerit ultrices', 'integer-in-dui-vel-nibh-hendrerit-ultrices', 'Vestibulum porta eros ornare nisi lacinia accumsan.'),
    (now(), userid, 'publish', 'Proin volutpat nisl dictum risus molestie porttitor', 'proin-volutpat-nisl-dictum-risus-molestie-porttitor', 'Vivamus commodo turpis volutpat neque varius commodo.');

    for r in (select * from posts) loop
      insert into post_metas(post_id, meta_key, meta_value) values(r.id, 'view_count', '1');
    end loop;
  end if;

end;
$$ language plpgsql;
