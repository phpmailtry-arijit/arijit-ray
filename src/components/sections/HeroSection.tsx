import { useEffect, useState } from 'react';
import { ArrowDown, Github, Linkedin, Mail, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface HeroData {
  heading: string;
  subheading: string;
  description: string;
}

export function HeroSection() {
  const navigate = useNavigate();
  const [heroData, setHeroData] = useState<HeroData>({
    heading: 'Hi, I am Arijit Ray',
    subheading: 'Full Stack Developer & Digital Creator', 
    description: 'I craft beautiful, functional web applications that solve real-world problems.'
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

  const handleGetInTouch = () => {
    navigate('/contact');
  };

  const handleDownloadResume = async () => {
    try {
      const { data } = await supabase.storage
        .from('resumes')
        .list('', { limit: 1, sortBy: { column: 'created_at', order: 'desc' } });

      if (data && data.length > 0) {
        const { data: downloadData } = await supabase.storage
          .from('resumes')
          .download(data[0].name);

        if (downloadData) {
          const url = URL.createObjectURL(downloadData);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'resume.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      } else {
        alert('No resume available for download');
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Error downloading resume');
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Professional Animated Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/15 via-primary-indigo/8 to-accent-teal/12" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-primary rounded-full blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-accent rounded-full blur-3xl opacity-25 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-professional rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '4s' }} />
      
      {/* Elegant floating geometric shapes */}
      <div className="absolute top-20 right-1/4 w-3 h-3 bg-primary-blue/60 rounded rotate-45 animate-float opacity-40" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-accent-teal/60 rounded-full animate-float opacity-50" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/3 right-20 w-6 h-6 bg-primary-indigo/60 transform rotate-12 animate-float opacity-35" style={{ animationDelay: '5s' }} />

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Main Content */}
        <div className="animate-scale-in-bounce">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8 animate-slide-up-fade">
            <span className="bg-gradient-primary bg-clip-text text-transparent font-bold">
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
            <Button onClick={handleGetInTouch} size="lg" className="group bg-gradient-primary hover:bg-gradient-professional shadow-luxury hover:shadow-professional transition-all duration-500 animate-magnetic px-8 py-4 text-lg">
              <Mail className="w-6 h-6 mr-3 group-hover:animate-bounce" />
              Get In Touch
            </Button>
            <Button onClick={handleDownloadResume} variant="outline" size="lg" className="group glass-effect hover:bg-gradient-accent hover:text-white hover:border-transparent transition-all duration-500 animate-magnetic px-8 py-4 text-lg">
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
              className="p-4 rounded-2xl glass-effect hover:bg-gradient-primary hover:shadow-professional transition-all duration-500 group animate-magnetic"
            >
              <Github className="w-7 h-7 text-muted-foreground group-hover:text-white group-hover:animate-bounce" />
            </a>
            <a
              href="https://linkedin.com/in/arijitray"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl glass-effect hover:bg-gradient-accent hover:shadow-professional transition-all duration-500 group animate-magnetic"
            >
              <Linkedin className="w-7 h-7 text-muted-foreground group-hover:text-white group-hover:animate-bounce" />
            </a>
            <a
              href="mailto:arijit@example.com"
              className="p-4 rounded-2xl glass-effect hover:bg-gradient-professional hover:shadow-professional transition-all duration-500 group animate-magnetic"
            >
              <Mail className="w-7 h-7 text-muted-foreground group-hover:text-white group-hover:animate-bounce" />
            </a>
          </div>
        </div>

        {/* Professional Scroll Indicator */}
        <button
          onClick={scrollToContent}
          className="fixed bottom-8 right-8 z-20 animate-bounce animate-slide-up-fade group"
          style={{ animationDelay: '1s' }}
        >
          <div className="flex flex-col items-center space-y-2 glass-effect p-3 rounded-xl hover:bg-gradient-professional hover:shadow-professional transition-all duration-300 border border-white/10">
            <span className="text-xs font-medium text-muted-foreground group-hover:text-white transition-colors">Explore</span>
            <ArrowDown className="w-5 h-5 text-muted-foreground group-hover:text-white group-hover:animate-bounce transition-colors" />
          </div>
        </button>
      </div>
    </section>
  );
}