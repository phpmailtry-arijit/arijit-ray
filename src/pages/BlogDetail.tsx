import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Tag, Share2, ArrowLeft, Copy, Twitter, Facebook, Linkedin } from 'lucide-react';
import { Navbar } from '@/components/navigation/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  tags: string[];
  featured_image: string;
  created_at: string;
  ai_generated: boolean;
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateReadTime = (content: string) => {
    const words = content.split(' ').length;
    const readTime = Math.ceil(words / 200);
    return readTime;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  const shareOnTwitter = () => {
    const text = `Check out this blog post: ${post?.title}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Navigation */}
      <div className="px-4 py-6 pt-20">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" asChild className="hover:bg-secondary">
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      {post.featured_image && (
        <div className="px-4 mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video rounded-xl overflow-hidden shadow-elevated">
              <img 
                src={post.featured_image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Article Header */}
      <article className="px-4">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.created_at)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {calculateReadTime(post.content)} min read
              </div>
              {post.ai_generated && (
                <Badge variant="secondary">AI Generated</Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 animate-fade-in">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-muted-foreground leading-relaxed mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {post.excerpt}
            </p>

            {/* Tags and Share */}
            <div className="flex flex-wrap items-center justify-between gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="relative">
                <Button 
                  variant="outline" 
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="relative"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>

                {showShareMenu && (
                  <Card className="absolute right-0 top-12 z-10 p-2 min-w-48 animate-fade-in-scale">
                    <div className="space-y-1">
                      <Button variant="ghost" size="sm" onClick={copyToClipboard} className="w-full justify-start">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </Button>
                      <Button variant="ghost" size="sm" onClick={shareOnTwitter} className="w-full justify-start">
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </Button>
                      <Button variant="ghost" size="sm" onClick={shareOnFacebook} className="w-full justify-start">
                        <Facebook className="w-4 h-4 mr-2" />
                        Facebook
                      </Button>
                      <Button variant="ghost" size="sm" onClick={shareOnLinkedIn} className="w-full justify-start">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </header>

          <Separator className="mb-8" />

          {/* Content */}
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div 
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="leading-relaxed"
            />
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-muted-foreground">
                  Thanks for reading! Share this post if you found it helpful.
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={shareOnTwitter}>
                  <Twitter className="w-4 h-4 mr-2" />
                  Tweet
                </Button>
                <Button variant="outline" onClick={shareOnLinkedIn}>
                  <Linkedin className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </footer>
        </div>
      </article>

      <div className="h-16"></div> {/* Spacer */}
    </div>
  );
}