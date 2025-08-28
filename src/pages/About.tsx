import { useState, useEffect } from 'react';
import { Calendar, MapPin, Code, Award, Download } from 'lucide-react';
import { Navbar } from '@/components/navigation/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Experience {
  id: string;
  year: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  display_order: number;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  years_experience: number;
}

interface SkillCategory {
  title: string;
  skills: string[];
  icon: any;
}

export default function About() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchProfilePicture(),
      fetchExperiences(),
      fetchSkills()
    ]).finally(() => setLoading(false));
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('professional_experience')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    }
  };

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;

      // Group skills by category
      const groupedSkills = (data || []).reduce((acc: Record<string, Skill[]>, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      }, {});

      // Convert to SkillCategory format
      const categories: SkillCategory[] = Object.entries(groupedSkills).map(([category, skills]) => ({
        title: category,
        skills: skills.map(skill => skill.name),
        icon: getIconForCategory(category)
      }));

      setSkillCategories(categories);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const getIconForCategory = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('frontend') || lowerCategory.includes('front-end')) return Code;
    if (lowerCategory.includes('backend') || lowerCategory.includes('back-end')) return Award;
    if (lowerCategory.includes('devops') || lowerCategory.includes('tools')) return MapPin;
    return Code; // Default icon
  };

  const fetchProfilePicture = async () => {
    try {
      const { data: files } = await supabase.storage
        .from('profiles')
        .list('', { limit: 1, sortBy: { column: 'created_at', order: 'desc' } });

      if (files && files.length > 0) {
        const { data } = supabase.storage
          .from('profiles')
          .getPublicUrl(files[0].name);
        
        setProfilePictureUrl(data.publicUrl);
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
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
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="py-16 px-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                About Me
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                I'm a passionate full-stack developer with 6+ years of experience crafting digital solutions that make a difference. I specialize in modern web technologies and love turning complex problems into simple, beautiful designs.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Kolkata, India</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Available for freelance</span>
                </div>
              </div>
              <div className="flex gap-4">
                <Button onClick={handleDownloadResume} className="group">
                  <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  Download Resume
                </Button>
              </div>
            </div>
            
            <div className="relative animate-slide-in-right">
              <div className="relative w-full max-w-md mx-auto">
                <div className="aspect-square rounded-2xl bg-gradient-primary p-1 shadow-glow animate-glow-pulse">
                  <div className="w-full h-full rounded-xl bg-card flex items-center justify-center overflow-hidden">
                    {profilePictureUrl ? (
                      <img 
                        src={profilePictureUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <Code className="w-24 h-24 text-primary" />
                    )}
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent rounded-full flex items-center justify-center animate-float">
                  <Award className="w-8 h-8 text-accent-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Professional Journey</h2>
          {loading ? (
            <div className="text-center">Loading experiences...</div>
          ) : experiences.length > 0 ? (
            <div className="space-y-8">
              {experiences.map((item, index) => (
              <Card 
                key={index}
                className={`group transition-all duration-300 cursor-pointer ${
                  hoveredCard === index ? 'shadow-elevated scale-105' : 'hover:shadow-glass'
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-lg font-medium text-primary">
                        {item.company}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-lg px-4 py-1">
                      {item.year}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{item.location}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No professional experience added yet.
            </div>
          )}
        </div>
      </section>

      {/* Skills Overview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Core Skills</h2>
          {loading ? (
            <div className="text-center">Loading skills...</div>
          ) : skillCategories.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {skillCategories.map((category, index) => (
                <Card key={index} className="group hover:shadow-elevated transition-all duration-300 animate-fade-in-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <category.icon className="w-12 h-12 text-primary mb-4 group-hover:animate-tech-glow" />
                    <CardTitle>{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No skills added yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}