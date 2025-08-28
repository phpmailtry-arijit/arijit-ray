import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface AboutData {
  title: string;
  content: string;
  image: string;
  highlights: string[];
}

export function AboutSection() {
  const [aboutData, setAboutData] = useState<AboutData>({
    title: 'About Me',
    content: 'I am a seasoned Tech Lead with over 8 years of experience in full-stack development, team leadership, and architecting scalable solutions. My passion lies in transforming complex problems into elegant, user-friendly applications.',
    image: '',
    highlights: ['8+ Years Experience', 'Team Leadership', 'Full Stack Development', 'System Architecture']
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    const { data } = await supabase
      .from('portfolio_content')
      .select('content')
      .eq('section', 'about')
      .single();
    
    if (data?.content) {
      setAboutData(data.content as unknown as AboutData);
    }
  };

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {aboutData.title}
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <div className="relative group">
            <div className="aspect-square rounded-2xl bg-gradient-card p-8 shadow-elevated">
              <div className="w-full h-full rounded-xl bg-muted flex items-center justify-center text-6xl font-bold text-muted-foreground">
                AR
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="animate-fade-in">
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {aboutData.content}
              </p>

              {/* Highlights */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Key Highlights</h3>
                <div className="grid grid-cols-2 gap-3">
                  {aboutData.highlights.map((highlight, index) => (
                    <Card
                      key={index}
                      className="p-4 bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 group"
                    >
                      <Badge variant="secondary" className="w-full justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {highlight}
                      </Badge>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">8+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50+</div>
                  <div className="text-sm text-muted-foreground">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">15+</div>
                  <div className="text-sm text-muted-foreground">Team Members Led</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}