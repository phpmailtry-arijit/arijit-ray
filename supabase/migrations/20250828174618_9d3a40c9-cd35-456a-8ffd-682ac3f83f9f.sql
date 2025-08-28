-- Create profiles table for admin user
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolio content table
CREATE TABLE public.portfolio_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  title TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  published BOOLEAN DEFAULT false,
  ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact messages table
CREATE TABLE public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date_achieved DATE,
  category TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER CHECK (proficiency >= 1 AND proficiency <= 5),
  years_experience INTEGER,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Admin can view all profiles" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Portfolio content policies (public read, admin write)
CREATE POLICY "Anyone can view portfolio content" ON public.portfolio_content FOR SELECT USING (true);
CREATE POLICY "Admin can manage portfolio content" ON public.portfolio_content FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Blog posts policies (public read published, admin manage all)
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Admin can view all blog posts" ON public.blog_posts FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can manage blog posts" ON public.blog_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Contact messages policies (insert for anyone, read for admin)
CREATE POLICY "Anyone can send contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view contact messages" ON public.contact_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can manage contact messages" ON public.contact_messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Achievements policies (public read, admin write)
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Admin can manage achievements" ON public.achievements FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Projects policies (public read, admin write)
CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admin can manage projects" ON public.projects FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Skills policies (public read, admin write)
CREATE POLICY "Anyone can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admin can manage skills" ON public.skills FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_portfolio_content_updated_at BEFORE UPDATE ON public.portfolio_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial portfolio content
INSERT INTO public.portfolio_content (section, title, content) VALUES
('hero', 'Hero Section', '{"name": "Arijit Ray", "title": "Tech Lead & Full Stack Developer", "tagline": "Building innovative solutions with cutting-edge technology", "description": "Passionate about creating scalable applications and leading high-performing development teams."}'),
('about', 'About Me', '{"title": "About Me", "content": "I am a seasoned Tech Lead with over 8 years of experience in full-stack development, team leadership, and architecting scalable solutions. My passion lies in transforming complex problems into elegant, user-friendly applications.", "image": "", "highlights": ["8+ Years Experience", "Team Leadership", "Full Stack Development", "System Architecture"]}'),
('contact', 'Contact Information', '{"email": "arijit@example.com", "phone": "+1-234-567-8900", "location": "San Francisco, CA", "linkedin": "https://linkedin.com/in/arijitray", "github": "https://github.com/arijitray"}');

-- Insert sample achievements
INSERT INTO public.achievements (title, description, date_achieved, category, icon, display_order) VALUES
('Tech Lead of the Year 2023', 'Recognized for exceptional leadership and technical innovation', '2023-12-01', 'award', 'Trophy', 1),
('AWS Certified Solutions Architect', 'Professional level certification for cloud architecture', '2023-06-15', 'certification', 'Award', 2),
('Startup MVP Development', 'Led development of MVP that secured $2M Series A funding', '2022-11-30', 'achievement', 'Rocket', 3),
('Open Source Contributor', 'Active contributor to major open source projects with 1000+ stars', '2022-01-01', 'opensource', 'Code', 4);

-- Insert sample projects
INSERT INTO public.projects (title, description, tech_stack, github_url, live_url, image_url, featured, display_order) VALUES
('E-Commerce Platform', 'Full-stack e-commerce platform with real-time inventory management', '{"React", "Node.js", "PostgreSQL", "Redis", "Docker"}', 'https://github.com/arijitray/ecommerce-platform', 'https://demo-ecommerce.com', '', true, 1),
('Task Management SaaS', 'Multi-tenant task management application with real-time collaboration', '{"Next.js", "TypeScript", "Supabase", "TailwindCSS"}', 'https://github.com/arijitray/task-manager', 'https://taskmanager-demo.com', '', true, 2),
('AI Content Generator', 'AI-powered content generation tool with multiple language models', '{"Python", "FastAPI", "OpenAI", "React", "MongoDB"}', 'https://github.com/arijitray/ai-content-gen', 'https://ai-content-demo.com', '', false, 3),
('DevOps Dashboard', 'Comprehensive monitoring and deployment dashboard for microservices', '{"Vue.js", "Express.js", "InfluxDB", "Grafana", "Kubernetes"}', 'https://github.com/arijitray/devops-dashboard', '', '', false, 4);

-- Insert sample skills
INSERT INTO public.skills (name, category, proficiency, years_experience, icon, display_order) VALUES
('JavaScript', 'Programming Languages', 5, 8, 'Code', 1),
('TypeScript', 'Programming Languages', 5, 6, 'FileText', 2),
('Python', 'Programming Languages', 4, 5, 'Terminal', 3),
('React', 'Frontend Frameworks', 5, 6, 'Zap', 4),
('Next.js', 'Frontend Frameworks', 5, 4, 'ArrowRight', 5),
('Node.js', 'Backend Technologies', 5, 7, 'Server', 6),
('PostgreSQL', 'Databases', 4, 6, 'Database', 7),
('MongoDB', 'Databases', 4, 4, 'HardDrive', 8),
('AWS', 'Cloud Platforms', 4, 5, 'Cloud', 9),
('Docker', 'DevOps', 4, 4, 'Package', 10),
('Kubernetes', 'DevOps', 3, 2, 'Settings', 11),
('Team Leadership', 'Soft Skills', 5, 4, 'Users', 12);

-- Insert sample blog post
INSERT INTO public.blog_posts (title, slug, content, excerpt, tags, published, ai_generated) VALUES
('The Future of Full Stack Development', 'future-of-full-stack-development', 
'# The Future of Full Stack Development

The landscape of full stack development is rapidly evolving. With the emergence of new technologies and frameworks, developers need to stay ahead of the curve.

## Key Trends Shaping the Future

### 1. AI Integration
Artificial Intelligence is becoming integral to modern applications. From content generation to user experience personalization, AI is transforming how we build applications.

### 2. Edge Computing
Moving computation closer to users is becoming crucial for performance. Edge computing enables faster response times and better user experiences.

### 3. Serverless Architecture
Serverless computing is simplifying deployment and scaling. It allows developers to focus on code rather than infrastructure management.

## Conclusion

The future of full stack development is exciting and full of opportunities. Staying current with these trends will be crucial for success.',
'Exploring the key trends and technologies shaping the future of full stack development, from AI integration to serverless architecture.',
'{"full-stack", "web-development", "ai", "serverless", "edge-computing"}',
true,
false);