----------------------------------------------------------------
--                                                            --
--                       Job Scheduling                       --
--                                                            --
----------------------------------------------------------------

select cron.unschedule('hourly-publish-future-posts');
select cron.unschedule('daily-delete-old-cron-job-run-details');

drop function if exists hourly_publish_future_posts;
drop function if exists daily_delete_old_cron_job_run_details;

----------------------------------------------------------------

select cron.schedule('hourly-publish-future-posts', '0 * * * *', 'SELECT hourly_publish_future_posts()');
select cron.schedule('daily-delete-old-cron-job-run-details', '0 0 * * *', 'SELECT daily_delete_old_cron_job_run_details()');

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
    select meta_value into visibility from postmeta where post_id = r.id and meta_key = 'visibility';

    if visibility = 'private' then
      update posts set status = 'private' where id = r.id;
    else
      update posts set status = 'publish' where id = r.id;
    end if;

    update postmeta set meta_value = null where post_id = r.id and meta_key = 'future_date';
  end loop;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function daily_delete_old_cron_job_run_details()
returns void
security definer set search_path = public
as $$
begin
  delete from cron.job_run_details where start_time < now() - interval '30 days';
end;
$$ language plpgsql;
