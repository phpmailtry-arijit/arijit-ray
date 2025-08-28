-- Create professional experience table
CREATE TABLE public.professional_experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  skills TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.professional_experience ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view professional experience" 
ON public.professional_experience 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage professional experience" 
ON public.professional_experience 
FOR ALL 
USING (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.user_id = auth.uid()) AND (profiles.role = 'admin'::text))));

-- Create trigger for updated_at
CREATE TRIGGER update_professional_experience_updated_at
BEFORE UPDATE ON public.professional_experience
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();