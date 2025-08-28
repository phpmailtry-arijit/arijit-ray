-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Create storage policies for resumes
CREATE POLICY "Admins can upload resumes" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'resumes' AND (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
)));

CREATE POLICY "Admins can view resumes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resumes' AND (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
)));

CREATE POLICY "Admins can update resumes" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'resumes' AND (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
)));

CREATE POLICY "Admins can delete resumes" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'resumes' AND (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
)));

-- Public access for resumes (for download button)
CREATE POLICY "Anyone can download resumes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resumes');