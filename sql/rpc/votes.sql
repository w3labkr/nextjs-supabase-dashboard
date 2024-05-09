-- const { data, error } = await supabase.rpc('get_vote', { pid: '' });
-- select * from get_vote('pid');

drop function if exists get_vote;

create or replace function get_vote(pid bigint)
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

-- const { data, error } = await supabase.rpc('set_is_like', { uid: '', pid: '', islike: '' });
-- select * from set_is_like('uid', 'pid', 'islike');

drop function if exists set_is_like;

create or replace function set_is_like(
  uid uuid,
  pid bigint,
  islike smallint
)
returns void
security definer set search_path = public
as $$
begin
  if exists (select 1 from votes where user_id = uid and post_id = pid) then
    update votes set is_like = islike where user_id = uid and post_id = pid;
  else
    insert into votes(user_id, post_id, is_like) values(uid, pid, islike);
  end if;
end;
$$ language plpgsql;

-- const { data, error } = await supabase.rpc('set_is_dislike', { uid: '', pid: '', isdislike: '' });
-- select * from set_is_dislike('uid', 'pid', 'isdislike');

drop function if exists set_is_dislike;

create or replace function set_is_dislike(
  uid uuid,
  pid bigint,
  isdislike smallint
)
returns void
security definer set search_path = public
as $$
begin
  if exists (select 1 from votes where user_id = uid and post_id = pid) then
    update votes set is_dislike = isdislike where user_id = uid and post_id = pid;
  else
    insert into votes(user_id, post_id, is_dislike) values(uid, pid, isdislike);
  end if;
end;
$$ language plpgsql;
