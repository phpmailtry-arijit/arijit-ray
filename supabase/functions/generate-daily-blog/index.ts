import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting daily blog generation...');

    // Initialize Supabase client with service role for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch skills from database to generate relevant topics
    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select('name, category')
      .limit(10);

    if (skillsError) {
      console.error('Error fetching skills:', skillsError);
      throw new Error('Failed to fetch skills');
    }

    if (!skills || skills.length === 0) {
      console.log('No skills found in database');
      return new Response(JSON.stringify({ message: 'No skills found to generate blog about' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Found skills:', skills.map(s => s.name).join(', '));

    // Select a random skill for today's blog
    const randomSkill = skills[Math.floor(Math.random() * skills.length)];
    console.log('Selected skill for blog:', randomSkill.name);

    // Generate blog content using OpenAI
    const blogPrompt = `Write a comprehensive, engaging blog post about ${randomSkill.name} in the context of ${randomSkill.category} development. 

The blog should:
- Be 800-1200 words long
- Include practical examples and use cases
- Discuss current trends and best practices
- Be written in a professional but accessible tone
- Include actionable insights for developers
- Have a clear structure with introduction, main content, and conclusion

Title the blog post appropriately and make it SEO-friendly.

Format the response as JSON with the following structure:
{
  "title": "Blog post title",
  "content": "Full blog post content in markdown format",
  "excerpt": "Brief 150-character excerpt for preview"
}`;

    console.log('Generating blog content with OpenAI...');

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { 
            role: 'system', 
            content: 'You are a technical blog writer who creates high-quality, informative content about web development and programming topics. Always respond with valid JSON.' 
          },
          { role: 'user', content: blogPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    console.log('OpenAI response received');

    let blogData;
    try {
      blogData = JSON.parse(openAIData.choices[0].message.content);
    } catch (parseError) {
      console.error('Error parsing OpenAI response as JSON:', parseError);
      // Fallback: create structured data from the raw content
      const content = openAIData.choices[0].message.content;
      const lines = content.split('\n');
      const title = lines.find(line => line.includes('#') || line.length > 30)?.replace(/^#+\s*/, '') || `Understanding ${randomSkill.name}`;
      
      blogData = {
        title: title,
        content: content,
        excerpt: `Explore the power of ${randomSkill.name} in modern ${randomSkill.category} development.`
      };
    }

    // Create slug from title
    const slug = blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if a blog with this slug already exists
    const { data: existingBlog } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single();

    let finalSlug = slug;
    if (existingBlog) {
      // Add timestamp to make slug unique
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      finalSlug = `${slug}-${timestamp}`;
    }

    // Save blog post to database
    const { data: newBlog, error: insertError } = await supabase
      .from('blog_posts')
      .insert([
        {
          title: blogData.title,
          slug: finalSlug,
          content: blogData.content,
          excerpt: blogData.excerpt,
          published: true,
          ai_generated: true,
          tags: [randomSkill.name, randomSkill.category, 'development', 'tutorial']
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error saving blog post:', insertError);
      throw new Error('Failed to save blog post');
    }

    console.log('Blog post created successfully:', newBlog.id);

    return new Response(JSON.stringify({ 
      message: 'Blog post generated successfully',
      blog: {
        id: newBlog.id,
        title: newBlog.title,
        slug: newBlog.slug,
        skill: randomSkill.name
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-daily-blog function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Check function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});