
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HeroData {
  heading: string;
  subheading: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  years_experience: number;
  icon: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date_achieved: string;
  category: string;
  icon: string;
}

export default function AdminProfile() {
  const [heroData, setHeroData] = useState<HeroData>({
    heading: '',
    subheading: '',
    description: ''
  });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load hero data
      const { data: heroContent } = await supabase
        .from('portfolio_content')
        .select('content')
        .eq('section', 'hero')
        .single();

      if (heroContent?.content) {
        setHeroData(heroContent.content as unknown as HeroData);
      }

      // Load skills
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true });

      if (skillsData) {
        setSkills(skillsData);
      }

      // Load achievements
      const { data: achievementsData } = await supabase
        .from('achievements')
        .select('*')
        .order('display_order', { ascending: true });

      if (achievementsData) {
        setAchievements(achievementsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveHeroData = async () => {
    try {
      const { error } = await supabase
        .from('portfolio_content')
        .upsert({
          section: 'hero',
          content: heroData as any,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Hero section updated successfully",
      });
    } catch (error) {
      console.error('Error saving hero data:', error);
      toast({
        title: "Error",
        description: "Failed to update hero section",
        variant: "destructive",
      });
    }
  };

  const saveSkill = async (skill: Omit<Skill, 'id'> & { id?: string }) => {
    try {
      if (skill.id) {
        // Update existing skill
        const { error } = await supabase
          .from('skills')
          .update(skill)
          .eq('id', skill.id);

        if (error) throw error;
      } else {
        // Create new skill
        const { error } = await supabase
          .from('skills')
          .insert(skill);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Skill ${skill.id ? 'updated' : 'created'} successfully`,
      });

      loadData();
      setSkillDialogOpen(false);
      setEditingSkill(null);
    } catch (error) {
      console.error('Error saving skill:', error);
      toast({
        title: "Error",
        description: `Failed to ${skill.id ? 'update' : 'create'} skill`,
        variant: "destructive",
      });
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Skill deleted successfully",
      });

      loadData();
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      });
    }
  };

  const saveAchievement = async (achievement: Omit<Achievement, 'id'> & { id?: string }) => {
    try {
      if (achievement.id) {
        // Update existing achievement
        const { error } = await supabase
          .from('achievements')
          .update(achievement)
          .eq('id', achievement.id);

        if (error) throw error;
      } else {
        // Create new achievement
        const { error } = await supabase
          .from('achievements')
          .insert(achievement);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Achievement ${achievement.id ? 'updated' : 'created'} successfully`,
      });

      loadData();
      setAchievementDialogOpen(false);
      setEditingAchievement(null);
    } catch (error) {
      console.error('Error saving achievement:', error);
      toast({
        title: "Error",
        description: `Failed to ${achievement.id ? 'update' : 'create'} achievement`,
        variant: "destructive",
      });
    }
  };

  const deleteAchievement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Achievement deleted successfully",
      });

      loadData();
    } catch (error) {
      console.error('Error deleting achievement:', error);
      toast({
        title: "Error",
        description: "Failed to delete achievement",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <p className="text-muted-foreground">Manage your portfolio content</p>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Edit your main homepage content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="heading">Heading</Label>
                <Input
                  id="heading"
                  value={heroData.heading}
                  onChange={(e) => setHeroData({ ...heroData, heading: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="subheading">Subheading</Label>
                <Input
                  id="subheading"
                  value={heroData.subheading}
                  onChange={(e) => setHeroData({ ...heroData, subheading: e.target.value })}
                  placeholder="Your title/role"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={heroData.description}
                  onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                  placeholder="Brief description about yourself"
                  rows={3}
                />
              </div>
              <Button onClick={saveHeroData} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Hero Section
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Manage your technical skills</CardDescription>
              </div>
              <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingSkill(null)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </DialogTrigger>
                <SkillDialog
                  skill={editingSkill}
                  onSave={saveSkill}
                  onClose={() => {
                    setSkillDialogOpen(false);
                    setEditingSkill(null);
                  }}
                />
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{skill.name}</h4>
                      <p className="text-sm text-muted-foreground">{skill.category}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">Proficiency: {skill.proficiency}/5</Badge>
                        <Badge variant="outline">{skill.years_experience} years</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingSkill(skill);
                          setSkillDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteSkill(skill.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Manage your achievements and recognition</CardDescription>
              </div>
              <Dialog open={achievementDialogOpen} onOpenChange={setAchievementDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingAchievement(null)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Achievement
                  </Button>
                </DialogTrigger>
                <AchievementDialog
                  achievement={editingAchievement}
                  onSave={saveAchievement}
                  onClose={() => {
                    setAchievementDialogOpen(false);
                    setEditingAchievement(null);
                  }}
                />
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{achievement.category}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(achievement.date_achieved).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingAchievement(achievement);
                          setAchievementDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteAchievement(achievement.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SkillDialog({ 
  skill, 
  onSave, 
  onClose 
}: { 
  skill: Skill | null;
  onSave: (skill: Omit<Skill, 'id'> & { id?: string }) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: skill?.name || '',
    category: skill?.category || '',
    proficiency: skill?.proficiency || 1,
    years_experience: skill?.years_experience || 0,
    icon: skill?.icon || 'Code'
  });

  const handleSubmit = () => {
    onSave({
      ...formData,
      ...(skill?.id && { id: skill.id })
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{skill ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
        <DialogDescription>
          {skill ? 'Update the skill information' : 'Add a new skill to your profile'}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div>
          <Label htmlFor="skill-name">Skill Name</Label>
          <Input
            id="skill-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., React, Python, AWS"
          />
        </div>
        <div>
          <Label htmlFor="skill-category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Programming Languages">Programming Languages</SelectItem>
              <SelectItem value="Frontend Frameworks">Frontend Frameworks</SelectItem>
              <SelectItem value="Backend Technologies">Backend Technologies</SelectItem>
              <SelectItem value="Databases">Databases</SelectItem>
              <SelectItem value="Cloud Platforms">Cloud Platforms</SelectItem>
              <SelectItem value="DevOps">DevOps</SelectItem>
              <SelectItem value="Soft Skills">Soft Skills</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="proficiency">Proficiency (1-5)</Label>
          <Input
            id="proficiency"
            type="number"
            min="1"
            max="5"
            value={formData.proficiency}
            onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) || 1 })}
          />
        </div>
        <div>
          <Label htmlFor="experience">Years of Experience</Label>
          <Input
            id="experience"
            type="number"
            min="0"
            value={formData.years_experience}
            onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {skill ? 'Update' : 'Create'} Skill
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function AchievementDialog({ 
  achievement, 
  onSave, 
  onClose 
}: { 
  achievement: Achievement | null;
  onSave: (achievement: Omit<Achievement, 'id'> & { id?: string }) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    title: achievement?.title || '',
    description: achievement?.description || '',
    date_achieved: achievement?.date_achieved || new Date().toISOString().split('T')[0],
    category: achievement?.category || '',
    icon: achievement?.icon || 'Trophy'
  });

  const handleSubmit = () => {
    onSave({
      ...formData,
      ...(achievement?.id && { id: achievement.id })
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{achievement ? 'Edit Achievement' : 'Add New Achievement'}</DialogTitle>
        <DialogDescription>
          {achievement ? 'Update the achievement information' : 'Add a new achievement to your profile'}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div>
          <Label htmlFor="achievement-title">Title</Label>
          <Input
            id="achievement-title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Achievement title"
          />
        </div>
        <div>
          <Label htmlFor="achievement-description">Description</Label>
          <Textarea
            id="achievement-description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description of the achievement"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="achievement-category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="award">Award</SelectItem>
              <SelectItem value="certification">Certification</SelectItem>
              <SelectItem value="achievement">Achievement</SelectItem>
              <SelectItem value="opensource">Open Source</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="date-achieved">Date Achieved</Label>
          <Input
            id="date-achieved"
            type="date"
            value={formData.date_achieved}
            onChange={(e) => setFormData({ ...formData, date_achieved: e.target.value })}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {achievement ? 'Update' : 'Create'} Achievement
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
