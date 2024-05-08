-- const { data, error } = await supabase.rpc('count_posts', { uid: '' });
-- select * from count_posts('uid');

drop function if exists count_posts;

create or replace function count_posts(uid uuid)
returns table(status text, count bigint)
security definer set search_path = public
as $$
begin
  return query
  select p.status, count(*)
  from posts p where p.user_id = uid
  group by p.status;
end;
$$ language plpgsql;
