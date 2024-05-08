-- const { data, error } = await supabase.rpc('set_post_view', { pid: 0 });
-- select * from set_post_view('pid');

drop function if exists set_post_view;

create or replace function set_post_view(pid bigint)
returns void
security definer set search_path = public
as $$
begin
  update post_views set view_count = view_count + 1 where id = pid;
end;
$$ language plpgsql;
