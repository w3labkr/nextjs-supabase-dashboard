-- const { data, error } = await supabase.rpc('get_post_vote', { pid: '' });
-- select * from get_post_vote('pid');

drop function if exists get_post_vote;

create or replace function get_post_vote(pid bigint)
returns table(
	id bigint,
	like_count bigint,
	dislike_count bigint
)
security definer set search_path = public
as $$
begin
	return query
	select v.post_id, sum(v.is_like), sum(v.is_dislike)
  from votes v where v.post_id = pid
  group by v.post_id;
end;
$$ language plpgsql;
