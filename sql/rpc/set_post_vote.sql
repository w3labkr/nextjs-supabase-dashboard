-- const { data, error } = await supabase.rpc('set_post_vote', { uid: '', pid: '', islike: '', isdislike: '' });
-- select * from set_post_vote('uid', 'pid', 'islike', 'isdislike');

drop function if exists set_post_vote;

create or replace function set_post_vote(
  uid uuid,
  pid bigint,
  islike smallint default null,
  isdislike smallint default null
)
returns void
security definer set search_path = public
as $$
begin
  if (islike is not null) then

    if exists (select from post_votes where user_id = uid and post_id = pid) then
      update post_votes set is_like = islike where user_id = uid and post_id = pid;
    else
      insert into post_votes(user_id, post_id, is_like) values(uid, pid, islike);
    end if;

  elsif (isdislike is not null) then

    if exists (select from post_votes where user_id = uid and post_id = pid) then
      update post_votes set is_dislike = isdislike where user_id = uid and post_id = pid;
    else
      insert into post_votes(user_id, post_id, is_dislike) values(uid, pid, isdislike);
    end if;

  end if;
end;
$$ language plpgsql;
