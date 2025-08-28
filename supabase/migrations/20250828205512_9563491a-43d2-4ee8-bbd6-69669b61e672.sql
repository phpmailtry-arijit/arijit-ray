-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a daily cron job to generate blog posts at 9 AM UTC
SELECT cron.schedule(
  'generate-daily-blog',
  '0 9 * * *', -- Every day at 9:00 AM UTC
  $$
  SELECT
    net.http_post(
        url:='https://nnkeqeikvtvpbdvbjxpb.supabase.co/functions/v1/generate-daily-blog',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ua2VxZWlrdnR2cGJkdmJqeHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MDE5ODgsImV4cCI6MjA3MTk3Nzk4OH0.CGwn1PYad-QtUO3kqqGDgWyH95p1u9XetCELNWXdAqk"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);