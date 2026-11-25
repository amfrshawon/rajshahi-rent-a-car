-- M0: dispatch timeouts (M3) and scheduled jobs need pg_cron.
-- It is available on Supabase projects without extra setup; this migration
-- only turns it on.
create extension if not exists pg_cron;
