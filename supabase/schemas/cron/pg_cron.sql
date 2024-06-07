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
create extension if not exists pg_cron;

-- Dependent privileges exist. Use CASCADE to revoke them too.
-- create extension if not exists pg_cron with schema extensions;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

----------------------------------------------------------------

-- List all the jobs
-- select * from cron.job;

-- Edit a job
-- select cron.alter_job(
--   job_id := (select jobid from cron.job where jobname = 'vacuum'),
--   schedule := '*/5 * * * *'
-- );

-- Viewing previously ran jobs
-- select * from cron.job_run_details order by start_time desc;

-- Clearing previously ran jobs
truncate table cron.job_run_details restart identity;
