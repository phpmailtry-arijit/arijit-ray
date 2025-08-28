import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  Users, 
  TrendingUp,
  Eye,
  Calendar,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  totalProjects: number;
  totalMessages: number;
  unreadMessages: number;
}

interface RecentActivity {
  id: string;
  type: 'blog' | 'project' | 'message';
  title: string;
  date: string;
  status?: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    totalProjects: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch blog posts stats
      const { data: posts, error: postsError } = await supabase
        .from('blog_posts')
        .select('id, published, created_at, title');

      if (postsError) throw postsError;

      // Fetch projects stats
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, created_at, title');

      if (projectsError) throw projectsError;

      // Fetch messages stats
      const { data: messages, error: messagesError } = await supabase
        .from('contact_messages')
        .select('id, read, created_at, name, subject');

      if (messagesError) throw messagesError;

      // Calculate stats
      const totalPosts = posts?.length || 0;
      const publishedPosts = posts?.filter(post => post.published).length || 0;
      const totalProjects = projects?.length || 0;
      const totalMessages = messages?.length || 0;
      const unreadMessages = messages?.filter(msg => !msg.read).length || 0;

      setStats({
        totalPosts,
        publishedPosts,
        totalProjects,
        totalMessages,
        unreadMessages,
      });

      // Prepare recent activity
      const activities: RecentActivity[] = [
        ...(posts?.slice(0, 3).map(post => ({
          id: post.id,
          type: 'blog' as const,
          title: post.title,
          date: post.created_at,
          status: post.published ? 'Published' : 'Draft'
        })) || []),
        ...(projects?.slice(0, 3).map(project => ({
          id: project.id,
          type: 'project' as const,
          title: project.title,
          date: project.created_at,
        })) || []),
        ...(messages?.slice(0, 3).map(message => ({
          id: message.id,
          type: 'message' as const,
          title: `Message from ${message.name}`,
          date: message.created_at,
          status: message.read ? 'Read' : 'Unread'
        })) || []),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

      setRecentActivity(activities);

    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'blog': return FileText;
      case 'project': return FolderOpen;
      case 'message': return MessageSquare;
      default: return Activity;
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
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-elevated transition-all duration-300 animate-fade-in-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedPosts} published
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elevated transition-all duration-300 animate-fade-in-scale" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              Portfolio projects
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elevated transition-all duration-300 animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              {stats.unreadMessages} unread
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elevated transition-all duration-300 animate-fade-in-scale" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Analytics coming soon
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="animate-slide-in-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates across your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div 
                      key={activity.id} 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.title}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            {formatDate(activity.date)}
                          </p>
                          {activity.status && (
                            <Badge 
                              variant={activity.status === 'Published' || activity.status === 'Read' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {activity.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks and management options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button asChild className="h-20 flex-col gap-2">
                <Link to="/admin/blog">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">New Blog Post</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/admin/projects">
                  <FolderOpen className="h-6 w-6" />
                  <span className="text-sm">Add Project</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/admin/analytics">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">View Analytics</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link to="/">
                  <Eye className="h-6 w-6" />
                  <span className="text-sm">View Site</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Overview */}
      {stats.unreadMessages > 0 && (
        <Card className="animate-fade-in bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <MessageSquare className="h-5 w-5" />
              Unread Messages
            </CardTitle>
            <CardDescription>
              You have {stats.unreadMessages} unread message(s) waiting for your attention.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/admin/messages">
                View Messages
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}