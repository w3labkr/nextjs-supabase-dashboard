-- SQL Editor > New query
-- const { data, error } = await supabase.rpc('set_post_views', { post_id: 0 });

drop function if exists set_post_views;

create or replace function set_post_views(post_id bigint)
returns integer
security definer
as $$
declare
  old_views integer;
begin
    select views into old_views from posts p where id = post_id;
    update posts set views = old_views + 1 where id = post_id;
    return old_views + 1;
end;
$$ language plpgsql;

-- select * from set_post_views(0);
