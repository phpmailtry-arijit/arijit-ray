import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Calendar, Clock, Sparkles, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function BlogGenerationSettings() {
  const [generating, setGenerating] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const { toast } = useToast();

  const triggerBlogGeneration = async () => {
    setGenerating(true);
    setLastError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-daily-blog', {
        body: { manual: true }
      });

      if (error) {
        console.error('Supabase function error:', error);
        setLastError(error.message);
        throw error;
      }

      if (data?.error) {
        console.error('Function returned error:', data.error);
        setLastError(data.error);
        throw new Error(data.error);
      }

      toast({
        title: "Success!",
        description: `Blog post "${data.blog?.title}" generated successfully!`,
      });
    } catch (error) {
      console.error('Error generating blog:', error);
      const errorMessage = error.message || 'Failed to generate blog post';
      setLastError(errorMessage);
      
      toast({
        title: "Error",
        description: "Failed to generate blog post. Check the details below.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Blog Generation</h1>
        <p className="text-muted-foreground">Automated daily blog generation based on your skills</p>
      </div>

      <div className="grid gap-6">
        {/* Schedule Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Automated Schedule
            </CardTitle>
            <CardDescription>
              AI blog generation runs automatically every day at 9:00 AM UTC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Active</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Daily at 9:00 AM UTC</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {lastError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Last Error:</strong> {lastError}
              {lastError.includes('429') && (
                <div className="mt-2 text-sm">
                  <p><strong>Rate Limit Error (429):</strong> This means you've exceeded OpenAI's API limits.</p>
                  <p><strong>Solutions:</strong></p>
                  <ul className="list-disc ml-4 mt-1">
                    <li>Check your OpenAI billing and ensure you have credits</li>
                    <li>Wait a few minutes before trying again</li>
                    <li>Verify your API key is valid and has proper permissions</li>
                    <li>Check your OpenAI usage dashboard for current limits</li>
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Manual Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Manual Generation
            </CardTitle>
            <CardDescription>
              Generate a blog post immediately based on your current skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={triggerBlogGeneration} 
              disabled={generating}
              className="w-full sm:w-auto"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Blog Post Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* How it Works */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">1</div>
                <div>
                  <h4 className="font-medium">Skill Analysis</h4>
                  <p className="text-sm text-muted-foreground">System fetches your current skills from the database</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">2</div>
                <div>
                  <h4 className="font-medium">Topic Selection</h4>
                  <p className="text-sm text-muted-foreground">AI randomly selects a skill to write about for variety</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">3</div>
                <div>
                  <h4 className="font-medium">Content Generation</h4>
                  <p className="text-sm text-muted-foreground">GPT-4 creates comprehensive, SEO-optimized blog content</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">4</div>
                <div>
                  <h4 className="font-medium">Auto-Publishing</h4>
                  <p className="text-sm text-muted-foreground">Posts are automatically saved and published to your blog</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generated Content Features */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Content Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Content Quality</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 800-1200 words per post</li>
                  <li>• Professional yet accessible tone</li>
                  <li>• Practical examples included</li>
                  <li>• Current trends and best practices</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">SEO Optimization</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• SEO-friendly titles</li>
                  <li>• Relevant tags and categories</li>
                  <li>• Structured content format</li>
                  <li>• Actionable insights for readers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}