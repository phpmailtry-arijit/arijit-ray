import { useState, useEffect } from 'react';
import { BarChart3, Users, TrendingUp, Eye, Activity, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Analytics() {
  const [stats, setStats] = useState({
    totalViews: 0,
    uniqueVisitors: 0,
    pageViews: 0,
    averageSessionDuration: '0:00',
    bounceRate: '0%'
  });

  const [topPages, setTopPages] = useState([
    { page: '/blog/react-hooks', views: 150, title: 'Getting Started with React Hooks' },
    { page: '/projects', views: 120, title: 'Projects Portfolio' },
    { page: '/', views: 100, title: 'Home Page' },
    { page: '/about', views: 85, title: 'About Me' },
    { page: '/contact', views: 65, title: 'Contact' }
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { action: 'Page View', page: '/blog/react-hooks', timestamp: '2 minutes ago', ip: '192.168.1.1' },
    { action: 'Contact Form', page: '/contact', timestamp: '5 minutes ago', ip: '192.168.1.2' },
    { action: 'Page View', page: '/projects', timestamp: '8 minutes ago', ip: '192.168.1.3' },
    { action: 'Page View', page: '/', timestamp: '12 minutes ago', ip: '192.168.1.4' },
    { action: 'Page View', page: '/about', timestamp: '15 minutes ago', ip: '192.168.1.5' }
  ]);

  useEffect(() => {
    // Simulate fetching analytics data
    setStats({
      totalViews: 1250,
      uniqueVisitors: 890,
      pageViews: 2100,
      averageSessionDuration: '2:34',
      bounceRate: '35%'
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Track your website performance and visitor insights.
        </p>
      </div>

      {/* Notice Card */}
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="pt-6">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Analytics Integration Coming Soon</h3>
            <p className="text-muted-foreground">
              This is a demo analytics dashboard. To get real analytics data, integrate with services like:
            </p>
            <div className="flex justify-center gap-2 mt-3">
              <Badge variant="outline">Google Analytics</Badge>
              <Badge variant="outline">Plausible</Badge>
              <Badge variant="outline">Umami</Badge>
              <Badge variant="outline">Vercel Analytics</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="hover:shadow-elevated transition-all duration-300 animate-fade-in-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elevated transition-all duration-300 animate-fade-in-scale" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elevated transition-all duration-300 animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elevated transition-all duration-300 animate-fade-in-scale" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageSessionDuration}</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elevated transition-all duration-300 animate-fade-in-scale" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bounceRate}</div>
            <p className="text-xs text-muted-foreground">
              -3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card className="animate-slide-in-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Pages
            </CardTitle>
            <CardDescription>
              Most visited pages this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div 
                  key={page.page} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{page.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{page.page}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{page.views}</p>
                    <p className="text-sm text-muted-foreground">views</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="animate-slide-in-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest visitor activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {activity.action === 'Page View' ? (
                      <Eye className="h-4 w-4 text-primary" />
                    ) : (
                      <Users className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.page}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Placeholder */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Traffic Overview
          </CardTitle>
          <CardDescription>
            Visitor traffic over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Chart integration coming soon</p>
              <p className="text-sm text-muted-foreground">
                Connect with analytics service to see real-time charts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}