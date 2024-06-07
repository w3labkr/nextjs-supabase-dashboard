----------------------------------------------------------------
--                                                            --
--                  Call a Postgres function                  --
--                                                            --
----------------------------------------------------------------

-- Call a Postgres function
-- https://supabase.com/docs/reference/javascript/rpc

truncate table cron.job_run_details restart identity;

select cron.unschedule('hourly-publish-future-posts');

drop function if exists hourly_publish_future_posts;

----------------------------------------------------------------

select cron.schedule('hourly-publish-future-posts', '0 * * * *', 'SELECT hourly_publish_future_posts()');

----------------------------------------------------------------

create or replace function hourly_publish_future_posts()
returns void
security definer set search_path = public
as $$
declare
  r record;
  visibility text;
begin

  for r in (select * from posts where status = 'future' and date < now()) loop
    select meta_value into visibility from post_metas where post_id = r.id and meta_key = 'visibility';

    if visibility = 'private' then
      update posts set status = 'private' where id = r.id;
    else
      update posts set status = 'publish' where id = r.id;
    end if;

    update post_metas set meta_value = null where post_id = r.id and meta_key = 'future_date';
  end loop;

end;
$$ language plpgsql;
