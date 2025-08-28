import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  StarOff, 
  ExternalLink,
  Github,
  Search,
  Save,
  X,
  FolderOpen,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string;
  live_url: string;
  featured: boolean;
  image_url: string;
  display_order: number;
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

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech_stack: [] as string[],
    github_url: '',
    live_url: '',
    featured: false,
    image_url: '',
    display_order: 0
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm]);

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
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tech_stack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProjects(filtered);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      tech_stack: [],
      github_url: '',
      live_url: '',
      featured: false,
      image_url: '',
      display_order: 0
    });
    setEditingProject(null);
  };

  const handleSave = async () => {
    try {
      const projectData = {
        ...formData,
        display_order: formData.display_order || projects.length + 1
      };

      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Project created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchProjects();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save project",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      tech_stack: project.tech_stack,
      github_url: project.github_url,
      live_url: project.live_url,
      featured: project.featured,
      image_url: project.image_url,
      display_order: project.display_order
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });

      fetchProjects();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const toggleFeatured = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ featured: !project.featured })
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Project ${!project.featured ? 'featured' : 'unfeatured'} successfully`,
      });

      fetchProjects();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Project Management</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </DialogTitle>
              <DialogDescription>
                {editingProject ? 'Update your project details' : 'Add a new project to your portfolio'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Project title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Project description"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
                <Input
                  id="tech_stack"
                  value={formData.tech_stack.join(', ')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    tech_stack: e.target.value.split(',').map(tech => tech.trim()).filter(Boolean)
                  })}
                  placeholder="React, Node.js, PostgreSQL, AWS"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input
                    id="github_url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="live_url">Live URL</Label>
                  <Input
                    id="live_url"
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    placeholder="https://project-demo.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/project-image.jpg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Featured Project</Label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingProject ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <div className="text-sm text-muted-foreground ml-auto">
              {filteredProjects.length} of {projects.length} projects
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="group hover:shadow-elevated transition-all duration-300 overflow-hidden">
            <div className="relative">
              {project.featured && (
                <div className="absolute top-3 left-3 z-10">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}
              
              <div className="aspect-video bg-gradient-tech">
                {project.image_url ? (
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-white/50" />
                  </div>
                )}
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {project.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {project.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {project.tech_stack.slice(0, 3).map((tech) => (
                    <Badge 
                      key={tech} 
                      variant="secondary"
                      className={`text-xs ${techColors[tech] || 'bg-secondary text-secondary-foreground'}`}
                    >
                      {tech}
                    </Badge>
                  ))}
                  {project.tech_stack.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.tech_stack.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {project.github_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {project.live_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
                
                <div className="flex justify-between pt-3 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toggleFeatured(project)}
                    >
                      {project.featured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card className="p-12 text-center">
          <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm 
              ? 'Try adjusting your search criteria.'
              : 'Get started by adding your first project.'
            }
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Project
          </Button>
        </Card>
      )}
    </div>
  );
}