-- SQL Editor > New query
-- const { data, error } = await supabase.rpc('count_posts', { uid: '' });

drop function if exists count_posts;

create or replace function count_posts(uid uuid)
returns table(status text, count bigint)
security definer
as $$
begin
	return query
	select posts.status, count(*) from posts where user_id = uid group by posts.status;
end;
$$ language plpgsql;
