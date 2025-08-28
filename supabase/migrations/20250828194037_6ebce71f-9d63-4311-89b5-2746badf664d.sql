-- Create profiles storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public) VALUES ('profiles', 'profiles', true);

-- Create policies for profile picture storage
CREATE POLICY "Anyone can view profile pictures" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profiles');

CREATE POLICY "Admin can manage profile pictures" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'profiles' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));