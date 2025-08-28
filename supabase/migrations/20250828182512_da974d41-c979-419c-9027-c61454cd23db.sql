-- Create an admin profile (the auth user will be created through signup)
INSERT INTO public.profiles (user_id, email, full_name, role) VALUES
(gen_random_uuid(), 'admin@arijitray.dev', 'Arijit Ray', 'admin');