-- PostgREST Aggregate Functions
-- https://supabase.com/blog/postgrest-aggregate-functions

-- Staying Safe with Aggregate Functions
ALTER ROLE authenticator SET pgrst.db_aggregates_enabled = 'true';
NOTIFY pgrst, 'reload config';
