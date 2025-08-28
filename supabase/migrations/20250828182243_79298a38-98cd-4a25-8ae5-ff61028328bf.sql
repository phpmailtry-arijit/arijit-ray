-- Create an admin user account
-- Note: In production, you would sign up through the auth UI and then update the profile
-- For now, let's create a profile that can be linked to a user account

INSERT INTO public.profiles (user_id, email, full_name, role) VALUES
(gen_random_uuid(), 'admin@arijitray.dev', 'Arijit Ray', 'admin')
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- Show instructions for creating the actual auth user
SELECT 'Admin profile created. To complete setup:' as instructions
UNION ALL
SELECT '1. Go to /admin/login and try to sign up with admin@arijitray.dev' as instructions
UNION ALL  
SELECT '2. Or manually create the auth user in Supabase dashboard' as instructions
UNION ALL
SELECT '3. The profile will be automatically linked via the existing RLS policies' as instructions;