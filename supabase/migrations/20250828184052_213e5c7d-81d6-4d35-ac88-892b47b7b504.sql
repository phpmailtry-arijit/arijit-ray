-- Insert the missing profile for the existing admin user
INSERT INTO public.profiles (user_id, email, full_name, role)
VALUES (
  '7b826d9a-888e-4b79-b563-61c08f3d6704',
  'arijitray.ray@gmail.com',
  'Arijit Ray',
  'admin'
);