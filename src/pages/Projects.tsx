import { useState, useEffect } from 'react';
import { Filter, Github, ExternalLink, Calendar, Star } from 'lucide-react';
import { Navbar } from '@/components/navigation/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  tech_stack: string[];
  github_url: string;
  live_url: string;
  featured: boolean;
  created_at: string;
}

const techColors: Record<string, string> = {
  'React': 'bg-tech-blue text-white',
  'TypeScript': 'bg-tech-blue text-white',
  'Next.js': 'bg-foreground text-background',
  'Node.js': 'bg-tech-green text-white',
  'Python': 'bg-tech-blue text-white',
  'PostgreSQL': 'bg-tech-blue text-white',
  'MongoDB': 'bg-tech-green text-white',
  'AWS': 'bg-tech-orange text-white',
  'Docker': 'bg-tech-blue text-white',
  'Tailwind CSS': 'bg-tech-cyan text-white',
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, selectedTech, selectedYear]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTech !== 'all') {
      filtered = filtered.filter(project =>
        project.tech_stack.includes(selectedTech)
      );
    }

    if (selectedYear !== 'all') {
      filtered = filtered.filter(project =>
        new Date(project.created_at).getFullYear().toString() === selectedYear
      );
    }

    setFilteredProjects(filtered);
  };

  const getAllTech = () => {
    const allTech = projects.flatMap(project => project.tech_stack);
    return [...new Set(allTech)];
  };

  const getAllYears = () => {
    const years = projects.map(project => new Date(project.created_at).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Header */}
      <section className="py-16 px-4 pt-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            My Projects
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A collection of projects I've worked on, showcasing different technologies and problem-solving approaches.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 mb-8">
        <div className="max-w-6xl mx-auto">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Filters:</span>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-xs"
                />
                
                <Select value={selectedTech} onValueChange={setSelectedTech}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue placeholder="Filter by technology" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Technologies</SelectItem>
                    {getAllTech().map(tech => (
                      <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue placeholder="Filter by year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {getAllYears().map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {filteredProjects.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-xl text-muted-foreground">No projects found matching your criteria.</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <Card 
                  key={project.id} 
                  className="group hover:shadow-elevated transition-all duration-300 overflow-hidden animate-fade-in-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden">
                    {project.featured && (
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-primary text-primary-foreground">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    
                    <div className="aspect-video bg-gradient-tech group-hover:scale-110 transition-transform duration-300">
                      {project.image_url ? (
                        <img 
                          src={project.image_url} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-6xl font-bold text-white/50">
                            {project.title.charAt(0)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(project.created_at).getFullYear()}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {project.tech_stack.map((tech) => (
                          <Badge 
                            key={tech} 
                            variant="secondary"
                            className={`${techColors[tech] || 'bg-secondary text-secondary-foreground'} hover:scale-105 transition-transform`}
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        {project.github_url && (
                          <Button variant="outline" size="sm" asChild className="flex-1">
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4 mr-2" />
                              Code
                            </a>
                          </Button>
                        )}
                        {project.live_url && (
                          <Button size="sm" asChild className="flex-1">
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Live Demo
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}