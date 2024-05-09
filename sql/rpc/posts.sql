-- const { data, error } = await supabase.rpc('count_posts', { uid: '', post_type: '' });
-- select * from count_posts('uid', 'post_type');

drop function if exists count_posts;

create or replace function count_posts(uid uuid, post_type text default 'post')
returns table(status text, count bigint)
security definer set search_path = public
as $$
begin
  return query
  select p.status, count(*)
  from posts p where p.user_id = uid and type = post_type
  group by p.status;
end;
$$ language plpgsql;

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
  select max(case when id < pid then id end),
         min(case when id > pid then id end)
  from posts
  where user_id = uid and type = post_type and status = post_status;
end;
$$ language plpgsql;

-- const { data, error } = await supabase.rpc('set_view_count', { pid: 0 });
-- select * from set_view_count('pid');

drop function if exists set_view_count;

create or replace function set_view_count(pid bigint)
returns void
security definer set search_path = public
as $$
begin
  if exists (select 1 from postmeta where post_id = pid and meta_key = 'view_count') then
    update postmeta set meta_value = meta_value::integer + 1 where post_id = pid and meta_key = 'view_count';
  else
    insert into postmeta(post_id, meta_key, meta_value) values(pid, 'view_count', '1');
  end if;
end;
$$ language plpgsql;
