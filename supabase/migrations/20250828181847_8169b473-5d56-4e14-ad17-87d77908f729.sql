-- Insert sample data without conflicts
-- Insert sample achievements (without conflicting with existing constraints)
INSERT INTO public.achievements (title, description, category, icon, date_achieved, display_order) 
SELECT * FROM (VALUES
    ('Full Stack Certification', 'Completed comprehensive full-stack development certification', 'Education', 'award', '2023-06-15', 1),
    ('React Expert', 'Mastered React and modern frontend development', 'Technical', 'code', '2023-08-20', 2),
    ('AWS Certified', 'Achieved AWS Solutions Architect certification', 'Certification', 'cloud', '2024-01-10', 3),
    ('Open Source Contributor', 'Contributed to 50+ open source projects', 'Community', 'git-branch', '2024-03-15', 4)
) AS v(title, description, category, icon, date_achieved, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE achievements.title = v.title);

-- Insert sample skills (respecting the proficiency constraint which appears to be 0-100)
INSERT INTO public.skills (name, category, proficiency, years_experience, icon, display_order) 
SELECT * FROM (VALUES
    ('React', 'Frontend', 95, 5, 'react', 1),
    ('TypeScript', 'Frontend', 90, 4, 'typescript', 2),
    ('Node.js', 'Backend', 85, 4, 'nodejs', 3),
    ('PostgreSQL', 'Database', 80, 3, 'database', 4),
    ('Python', 'Backend', 75, 3, 'python', 5),
    ('AWS', 'DevOps', 70, 2, 'cloud', 6),
    ('Docker', 'DevOps', 75, 2, 'container', 7),
    ('Git', 'Tools', 90, 5, 'git-branch', 8)
) AS v(name, category, proficiency, years_experience, icon, display_order)
WHERE NOT EXISTS (
    SELECT 1 FROM public.skills 
    WHERE skills.name = v.name AND skills.category = v.category
);

-- Insert sample projects
INSERT INTO public.projects (title, description, tech_stack, github_url, live_url, featured, image_url, display_order) 
SELECT * FROM (VALUES
    ('E-commerce Platform', 'Full-stack e-commerce solution with React, Node.js, and Stripe integration', 
     ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'], 
     'https://github.com/arijitray/ecommerce-platform', 
     'https://ecommerce-demo.arijitray.dev', 
     true, 
     'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop', 
     1),
    ('Task Management App', 'Collaborative task management application with real-time updates', 
     ARRAY['React', 'Socket.io', 'Express.js', 'MongoDB'], 
     'https://github.com/arijitray/task-manager', 
     'https://tasks.arijitray.dev', 
     true, 
     'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop', 
     2),
    ('Weather Dashboard', 'Beautiful weather dashboard with location-based forecasts', 
     ARRAY['React', 'TypeScript', 'OpenWeather API', 'Chart.js'], 
     'https://github.com/arijitray/weather-dashboard', 
     'https://weather.arijitray.dev', 
     false, 
     'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop', 
     3)
) AS v(title, description, tech_stack, github_url, live_url, featured, image_url, display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE projects.title = v.title);

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, tags, published, featured_image, ai_generated) 
SELECT * FROM (VALUES
    ('Getting Started with React Hooks', 'getting-started-with-react-hooks', 
     'A comprehensive guide to understanding and using React Hooks in your applications.', 
     '<h2>Introduction to React Hooks</h2><p>React Hooks revolutionized how we write React components by allowing us to use state and lifecycle features in functional components.</p><h3>useState Hook</h3><p>The useState hook is the most basic hook that allows you to add state to functional components...</p>', 
     ARRAY['React', 'JavaScript', 'Frontend'], 
     true, 
     'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop', 
     false),
    ('Building Scalable APIs with Node.js', 'building-scalable-apis-nodejs', 
     'Learn how to build robust and scalable REST APIs using Node.js and Express.', 
     '<h2>Building Scalable APIs</h2><p>Creating scalable APIs is crucial for modern web applications. In this guide, we''ll explore best practices for building APIs with Node.js...</p>', 
     ARRAY['Node.js', 'Backend', 'API'], 
     true, 
     'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop', 
     false),
    ('The Future of Web Development', 'future-of-web-development', 
     'Exploring emerging trends and technologies shaping the future of web development.', 
     '<h2>Emerging Trends</h2><p>The web development landscape is constantly evolving. Let''s explore what''s coming next...</p>', 
     ARRAY['Web Development', 'Trends', 'Technology'], 
     false, 
     'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop', 
     true)
) AS v(title, slug, excerpt, content, tags, published, featured_image, ai_generated)
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE blog_posts.slug = v.slug);

-- Insert portfolio content
INSERT INTO public.portfolio_content (section, title, content) 
SELECT * FROM (VALUES
    ('hero', 'Main Heading', '{"heading": "Hi, I''m Arijit Ray", "subheading": "Full Stack Developer & Digital Creator", "description": "I craft beautiful, functional web applications that solve real-world problems."}'),
    ('about', 'About Me', '{"bio": "I''m a passionate full-stack developer with 6+ years of experience in building web applications. I love turning complex problems into simple, beautiful designs.", "skills": ["React", "Node.js", "TypeScript", "Python"], "experience": "6+ years"}'),
    ('contact', 'Contact Info', '{"email": "hello@arijitray.dev", "phone": "+91 98765 43210", "location": "Kolkata, India", "availability": "Available for freelance"}')
) AS v(section, title, content)
WHERE NOT EXISTS (SELECT 1 FROM public.portfolio_content WHERE portfolio_content.section = v.section);