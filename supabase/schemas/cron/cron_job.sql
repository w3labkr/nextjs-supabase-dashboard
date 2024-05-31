----------------------------------------------------------------
--                                                            --
--                       Job Scheduling                       --
--                                                            --
----------------------------------------------------------------

-- pg_cron: Job Scheduling
-- https://supabase.com/docs/guides/database/extensions/pg_cron?queryGroups=database-method&database-method=sql

-- @hourly Run once an hour at the beginning of the hour
-- select cron.schedule('hourly-cron-job', '0 * * * *', 'SELECT hourly_cron_job()');
-- select cron.unschedule('hourly-cron-job');

-- @daily (or @midnight) Run once a day at midnight
-- select cron.schedule('daily-cron-job', '0 0 * * *', 'SELECT daily_cron_job()');
-- select cron.unschedule('daily-cron-job');

-- @weekly Run once a week at midnight on Sunday morning
-- select cron.schedule('weekly-cron-job', '0 0 * * 0', 'SELECT weekly_cron_job()');
-- select cron.unschedule('weekly-cron-job');

-- @monthly Run once a month at midnight of the first day of the month
-- select cron.schedule('monthly-cron-job', '0 0 1 * *', 'SELECT monthly_cron_job()');
-- select cron.unschedule('monthly-cron-job');

-- @yearly (or @annually) Run once a year at midnight of 1 January
-- select cron.schedule('yearly-cron-job', '0 0 1 1 *', 'SELECT yearly_cron_job()');
-- select cron.unschedule('yearly-cron-job');

----------------------------------------------------------------

-- Job scheduler for PostgreSQL
create extension if not exists pg_cron with schema extensions;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

----------------------------------------------------------------

select cron.schedule('hourly-publish-future-posts', '0 * * * *', 'SELECT hourly_publish_future_posts()');

drop function if exists hourly_publish_future_posts;

----------------------------------------------------------------

create or replace function hourly_publish_future_posts()
returns void
security definer set search_path = public
as $$
declare
  r record;
begin
  for r in (select * from posts where status = 'future' and date < now()) loop
    update posts set status = 'publish' where id = r.id;
  end loop;
end;
$$ language plpgsql;
