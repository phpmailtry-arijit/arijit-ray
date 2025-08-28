import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Code, FileText, Terminal, Zap, ArrowRight, Server, 
  Database, HardDrive, Cloud, Package, Settings, Users 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  years_experience: number;
  icon: string;
}

const iconMap = {
  Code, FileText, Terminal, Zap, ArrowRight, Server,
  Database, HardDrive, Cloud, Package, Settings, Users
};

export function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const { data } = await supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (data) {
      setSkills(data);
    }
  };

  const getIcon = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || Code;
  };

  const skillCategories = Array.from(new Set(skills.map(skill => skill.category)));

  const getCategoryColor = (category: string) => {
    const colors = {
      'Programming Languages': 'border-primary-blue text-primary-blue',
      'Frontend Frameworks': 'border-accent-teal text-accent-teal',
      'Backend Technologies': 'border-primary-indigo text-primary-indigo',
      'Databases': 'border-accent-purple text-accent-purple',
      'Cloud Platforms': 'border-primary-blue text-primary-blue',
      'DevOps': 'border-accent-teal text-accent-teal',
      'Soft Skills': 'border-primary text-primary',
    };
    return colors[category as keyof typeof colors] || 'border-primary text-primary';
  };

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Skills & Expertise
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and areas of expertise
          </p>
          <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full mt-6" />
        </div>

        <div className="space-y-12">
          {skillCategories.map((category, categoryIndex) => {
            const categorySkills = skills.filter(skill => skill.category === category);
            
            return (
              <div
                key={category}
                className="animate-fade-in"
                style={{ animationDelay: `${categoryIndex * 0.2}s` }}
              >
                <div className="flex items-center mb-6">
                  <h3 className={`text-2xl font-bold ${getCategoryColor(category)} mr-4`}>
                    {category}
                  </h3>
                  <div className={`flex-1 h-px bg-gradient-to-r from-current to-transparent opacity-30`} />
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorySkills.map((skill, skillIndex) => {
                    const Icon = getIcon(skill.icon);
                    
                    return (
                      <Card
                        key={skill.id}
                        className="group glass-effect border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-professional animate-fade-in"
                        style={{ animationDelay: `${(categoryIndex * 0.2) + (skillIndex * 0.1)}s` }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {skill.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {skill.years_experience} years experience
                              </p>
                            </div>
                          </div>
                          
                          {/* Proficiency Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Proficiency</span>
                              <Badge variant="secondary" className="text-xs">
                                {skill.proficiency}/5
                              </Badge>
                            </div>
                            <Progress 
                              value={skill.proficiency * 20} 
                              className="h-2"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Beginner</span>
                              <span>Expert</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}