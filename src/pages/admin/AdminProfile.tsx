
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
import { Plus, Edit, Trash2, Save, Upload, Download } from 'lucide-react';
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

interface AboutData {
  bio: string;
  skills: string[];
  experience: string;
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
  const [aboutData, setAboutData] = useState<AboutData>({
    bio: '',
    skills: [],
    experience: ''
  });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [hasProfilePicture, setHasProfilePicture] = useState(false);
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

      // Load about data
      const { data: aboutContent } = await supabase
        .from('portfolio_content')
        .select('content')
        .eq('section', 'about')
        .single();

      if (aboutContent?.content) {
        setAboutData(aboutContent.content as unknown as AboutData);
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

      // Check if resume exists
      const { data: resumeFiles } = await supabase.storage
        .from('resumes')
        .list('', { limit: 1 });
      
      setHasResume(resumeFiles && resumeFiles.length > 0);

      // Check if profile picture exists
      const { data: profileFiles } = await supabase.storage
        .from('profiles')
        .list('', { limit: 1 });
      
      setHasProfilePicture(profileFiles && profileFiles.length > 0);
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

  const saveAboutData = async () => {
    try {
      const { error } = await supabase
        .from('portfolio_content')
        .upsert({
          section: 'about',
          content: aboutData as any,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "About section updated successfully",
      });
    } catch (error) {
      console.error('Error saving about data:', error);
      toast({
        title: "Error",
        description: "Failed to update about section",
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

  const handleResumeUpload = async () => {
    if (!resumeFile) return;

    setUploading(true);
    try {
      // Delete existing resume if any
      const { data: existingFiles } = await supabase.storage
        .from('resumes')
        .list('');

      if (existingFiles && existingFiles.length > 0) {
        for (const file of existingFiles) {
          await supabase.storage
            .from('resumes')
            .remove([file.name]);
        }
      }

      // Upload new resume
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `resume.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      setHasResume(true);
      setResumeFile(null);
      toast({
        title: "Success",
        description: "Resume uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast({
        title: "Error",
        description: "Failed to upload resume",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
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
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Error",
        description: "Failed to download resume",
        variant: "destructive",
      });
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profilePicture) return;

    setUploading(true);
    try {
      // Delete existing profile picture if any
      const { data: existingFiles } = await supabase.storage
        .from('profiles')
        .list('');

      if (existingFiles && existingFiles.length > 0) {
        for (const file of existingFiles) {
          await supabase.storage
            .from('profiles')
            .remove([file.name]);
        }
      }

      // Upload new profile picture
      const fileExt = profilePicture.name.split('.').pop();
      const fileName = `profile.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('profiles')
        .upload(fileName, profilePicture, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      setHasProfilePicture(true);
      setProfilePicture(null);
      toast({
        title: "Success",
        description: "Profile picture uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="about">About Me</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
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

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Me Section</CardTitle>
              <CardDescription>Edit your about me content and profile picture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Profile Picture</h3>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
                      AR
                    </div>
                    <h4 className="text-md font-medium mb-2">Upload Profile Picture</h4>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Choose an image file for your profile picture
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                      className="hidden"
                      id="profile-picture-upload"
                    />
                    <label
                      htmlFor="profile-picture-upload"
                      className="inline-flex items-center px-4 py-2 border border-muted rounded-md shadow-sm text-sm font-medium cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      Choose Image File
                    </label>
                  </div>
                </div>

                {profilePicture && (
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/25">
                    <div>
                      <p className="font-medium">{profilePicture.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(profilePicture.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button onClick={handleProfilePictureUpload} disabled={uploading}>
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Picture
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {hasProfilePicture && (
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <Upload className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">Profile Picture Available</p>
                        <p className="text-sm text-green-600">
                          Profile picture is displayed on your website
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* About Content */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={aboutData.bio}
                    onChange={(e) => setAboutData({ ...aboutData, bio: e.target.value })}
                    placeholder="Write a brief bio about yourself"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    value={aboutData.experience}
                    onChange={(e) => setAboutData({ ...aboutData, experience: e.target.value })}
                    placeholder="e.g., 6+ years"
                  />
                </div>
                <div>
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Textarea
                    id="skills"
                    value={aboutData.skills?.join(', ') || ''}
                    onChange={(e) => setAboutData({ 
                      ...aboutData, 
                      skills: e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill) 
                    })}
                    placeholder="React, Node.js, TypeScript, Python"
                    rows={3}
                  />
                </div>
                <Button onClick={saveAboutData} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save About Section
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resume">
          <Card>
            <CardHeader>
              <CardTitle>Resume Management</CardTitle>
              <CardDescription>Upload and manage your resume PDF</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload Resume</h3>
                  <p className="text-muted-foreground mb-4">
                    Choose a PDF file to upload. Only the latest uploaded resume will be available for download.
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-flex items-center px-4 py-2 border border-muted rounded-md shadow-sm text-sm font-medium cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    Choose PDF File
                  </label>
                </div>
              </div>

              {resumeFile && (
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/25">
                  <div>
                    <p className="font-medium">{resumeFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button onClick={handleResumeUpload} disabled={uploading}>
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Resume
                      </>
                    )}
                  </Button>
                </div>
              )}

              {hasResume && (
                <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <Download className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">Resume Available</p>
                      <p className="text-sm text-green-600">
                        Resume is ready for download from your website
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleDownloadResume}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
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
