import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Star, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string;
  live_url: string;
  image_url: string;
  featured: boolean;
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (data) {
      setProjects(data);
    }
  };

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my technical expertise through innovative solutions and scalable applications
          </p>
          <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full mt-6" />
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="mb-16">
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredProjects.map((project, index) => (
                <Card
                  key={project.id}
                  className="group bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-elevated animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-0">
                    {/* Project Image */}
                    <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center border-b border-border/50 overflow-hidden">
                      {project.image_url ? (
                        <img 
                          src={project.image_url} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <Star className="w-12 h-12 text-primary mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Featured Project</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {project.description}
                      </p>
                      
                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech_stack.map((tech, techIndex) => (
                          <Badge
                            key={techIndex}
                            variant="secondary"
                            className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Project Links */}
                      <div className="flex space-x-3">
                        {project.github_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4 mr-2" />
                              Code
                            </a>
                          </Button>
                        )}
                        {project.live_url && (
                          <Button size="sm" asChild>
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Live Demo
                            </a>
                          </Button>
                        )}
                        {!project.github_url && !project.live_url && (
                          <Button variant="outline" size="sm" disabled>
                            <Shield className="w-4 h-4 mr-2" />
                            Confidential Project
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
              Other Notable Projects
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {otherProjects.map((project, index) => (
                <Card
                  key={project.id}
                  className="group bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow animate-fade-in"
                  style={{ animationDelay: `${(featuredProjects.length + index) * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    {/* Project Image for Other Projects */}
                    {project.image_url && (
                      <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                        <img 
                          src={project.image_url} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <h4 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {project.title}
                    </h4>
                    
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      {project.description}
                    </p>
                    
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tech_stack.slice(0, 3).map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className="text-xs bg-primary/10 text-primary"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.tech_stack.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.tech_stack.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    {/* Project Links */}
                    <div className="flex space-x-2">
                      {project.github_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <Github className="w-3 h-3 mr-1" />
                            Code
                          </a>
                        </Button>
                      )}
                      {project.live_url && (
                        <Button size="sm" asChild>
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Demo
                          </a>
                        </Button>
                      )}
                      {!project.github_url && !project.live_url && (
                        <Button variant="outline" size="sm" disabled>
                          <Shield className="w-3 h-3 mr-1" />
                          Confidential
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
