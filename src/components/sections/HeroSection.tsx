import { useEffect, useState } from 'react';
import { ArrowDown, Github, Linkedin, Mail, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface HeroData {
  heading: string;
  subheading: string;
  description: string;
}

export function HeroSection() {
  const [heroData, setHeroData] = useState<HeroData>({
    heading: 'Arijit Ray',
    subheading: 'Tech Lead & Full Stack Developer', 
    description: 'Passionate about creating scalable applications and leading high-performing development teams.'
  });

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    const { data } = await supabase
      .from('portfolio_content')
      .select('content')
      .eq('section', 'hero')
      .single();
    
    if (data?.content) {
      setHeroData(data.content as unknown as HeroData);
    }
  };

  const scrollToContent = () => {
    const element = document.getElementById('about');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-50 animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Main Content */}
        <div className="animate-fade-in-scale">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="block text-foreground mb-2">Hi, I'm</span>
            <span className="bg-gradient-neon bg-clip-text text-transparent animate-tech-glow">
              {heroData.heading}
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-4 font-light">
            {heroData.subheading}
          </p>
          
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            {heroData.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="group shadow-glow hover:shadow-neon transition-all duration-300">
              <Mail className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Get In Touch
            </Button>
            <Button variant="outline" size="lg" className="group border-primary/50 hover:border-primary">
              <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Download Resume
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-12">
            <a
              href="https://github.com/arijitray"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-border hover:border-primary transition-all duration-300 hover:shadow-glow group"
            >
              <Github className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
            </a>
            <a
              href="https://linkedin.com/in/arijitray"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-border hover:border-primary transition-all duration-300 hover:shadow-glow group"
            >
              <Linkedin className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
            </a>
            <a
              href="mailto:arijit@example.com"
              className="p-3 rounded-full border border-border hover:border-primary transition-all duration-300 hover:shadow-glow group"
            >
              <Mail className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <div className="flex flex-col items-center space-y-2 text-muted-foreground hover:text-primary transition-colors">
            <span className="text-sm">Scroll to explore</span>
            <ArrowDown className="w-5 h-5" />
          </div>
        </button>
      </div>
    </section>
  );
}