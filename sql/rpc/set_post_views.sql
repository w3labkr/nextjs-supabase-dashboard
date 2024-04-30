-- const { data, error } = await supabase.rpc('set_post_views', { pid: 0 });
-- select * from set_post_views('pid');

drop function if exists set_post_views;

create or replace function set_post_views(pid bigint)
returns integer
security definer
as $$
declare
  old_views integer;
begin
    select views into old_views from posts p where id = pid;
    update posts set views = old_views + 1 where id = pid;
    return old_views + 1;
end;
$$ language plpgsql;
