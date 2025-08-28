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
      {/* Animated Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-sunset-orange/20 via-electric-purple/10 to-ocean-cyan/20 animate-rainbow" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-sunset rounded-full blur-3xl opacity-30 animate-float" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-ocean rounded-full blur-3xl opacity-40 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-electric rounded-full blur-3xl opacity-25 animate-float" style={{ animationDelay: '4s' }} />
      
      {/* Floating geometric shapes */}
      <div className="absolute top-20 right-1/4 w-4 h-4 bg-sunset-orange rounded rotate-45 animate-float opacity-60" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-1/4 w-6 h-6 bg-ocean-cyan rounded-full animate-float opacity-70" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/3 right-20 w-8 h-8 bg-electric-purple transform rotate-12 animate-float opacity-50" style={{ animationDelay: '5s' }} />

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Main Content */}
        <div className="animate-scale-in-bounce">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8 animate-slide-up-fade">
            <span className="bg-gradient-electric bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%] animate-magnetic">
              {heroData.heading}
            </span>
          </h1>
          
          <p className="text-2xl sm:text-3xl lg:text-4xl mb-6 font-light animate-slide-up-fade gradient-text" style={{ animationDelay: '0.2s' }}>
            {heroData.subheading}
          </p>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-up-fade" style={{ animationDelay: '0.4s' }}>
            {heroData.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-slide-up-fade" style={{ animationDelay: '0.6s' }}>
            <Button size="lg" className="group bg-gradient-sunset hover:bg-gradient-electric shadow-luxury hover:shadow-neon transition-all duration-500 animate-magnetic px-8 py-4 text-lg">
              <Mail className="w-6 h-6 mr-3 group-hover:animate-bounce" />
              Get In Touch
            </Button>
            <Button variant="outline" size="lg" className="group glass-effect hover:bg-gradient-ocean hover:text-white hover:border-transparent transition-all duration-500 animate-magnetic px-8 py-4 text-lg">
              <Download className="w-6 h-6 mr-3 group-hover:animate-bounce" />
              Download Resume
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-8 mb-16 animate-slide-up-fade" style={{ animationDelay: '0.8s' }}>
            <a
              href="https://github.com/arijitray"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl glass-effect hover:bg-gradient-sunset hover:shadow-glow transition-all duration-500 group animate-magnetic"
            >
              <Github className="w-7 h-7 text-muted-foreground group-hover:text-white group-hover:animate-bounce" />
            </a>
            <a
              href="https://linkedin.com/in/arijitray"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl glass-effect hover:bg-gradient-ocean hover:shadow-glow transition-all duration-500 group animate-magnetic"
            >
              <Linkedin className="w-7 h-7 text-muted-foreground group-hover:text-white group-hover:animate-bounce" />
            </a>
            <a
              href="mailto:arijit@example.com"
              className="p-4 rounded-2xl glass-effect hover:bg-gradient-electric hover:shadow-neon transition-all duration-500 group animate-magnetic"
            >
              <Mail className="w-7 h-7 text-muted-foreground group-hover:text-white group-hover:animate-bounce" />
            </a>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <button
          onClick={scrollToContent}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce animate-slide-up-fade group"
          style={{ animationDelay: '1s' }}
        >
          <div className="flex flex-col items-center space-y-3 glass-effect p-4 rounded-2xl hover:bg-gradient-electric hover:shadow-neon transition-all duration-500">
            <span className="text-sm group-hover:text-white transition-colors">Scroll to explore</span>
            <ArrowDown className="w-6 h-6 group-hover:text-white group-hover:animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
}