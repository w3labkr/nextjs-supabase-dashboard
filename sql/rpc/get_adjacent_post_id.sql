-- const { data, error } = await supabase.rpc('get_adjacent_post_id', { pid: '', uid: '', post_type: '', post_status: '' });
-- select * from get_adjacent_post_id('pid', 'uid');

drop function if exists get_adjacent_post_id;

create or replace function get_adjacent_post_id(
  pid bigint,
  uid uuid,
  post_type text default 'post',
  post_status text default 'publish'
)
returns table(previous_id bigint, next_id bigint)
security definer set search_path = public
as $$
begin
  return query
  select max(case when id < pid then id end) as previous,
  min(case when id > pid then id end) as next
  from posts
  where user_id = uid and type = post_type and status = post_status;
end;
$$ language plpgsql;
