import { useState } from 'react';
import { Mail, MapPin, Phone, Send, Github, Linkedin, Twitter, ExternalLink, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/navigation/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/arijitray',
    icon: Github,
    description: 'Check out my open source projects'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/arijitray',
    icon: Linkedin,
    description: 'Connect with me professionally'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/arijitray',
    icon: Twitter,
    description: 'Follow me for tech updates'
  }
];

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    content: 'hello@arijitray.dev',
    description: 'Drop me a line anytime'
  },
  {
    icon: MapPin,
    title: 'Location',
    content: 'Kolkata, India',
    description: 'Available for remote work'
  },
  {
    icon: Phone,
    title: 'Response Time',
    content: '24-48 hours',
    description: 'I usually respond quickly'
  }
];

export default function Contact() {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: form.name,
            email: form.email,
            subject: form.subject,
            message: form.message
          }
        ]);

      if (error) throw error;

      setIsSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = form.name && form.email && form.message;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Header */}
      <section className="py-16 px-4 pt-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6 animate-fade-in">
            Get In Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Have a project in mind? Want to collaborate? Or just want to say hello? I'd love to hear from you.
          </p>
        </div>
      </section>

      <div className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="animate-slide-in-left">
              <CardHeader>
                <CardTitle className="text-2xl">Send me a message</CardTitle>
                <CardDescription>
                  Fill out the form below and I'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8 animate-fade-in-scale">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thank you for reaching out. I'll get back to you within 24-48 hours.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsSubmitted(false)}
                      className="mt-4"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={form.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                          className="transition-all duration-200 focus:shadow-glow"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          required
                          className="transition-all duration-200 focus:shadow-glow"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleInputChange}
                        placeholder="What's this about?"
                        className="transition-all duration-200 focus:shadow-glow"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={form.message}
                        onChange={handleInputChange}
                        placeholder="Tell me about your project or just say hello..."
                        rows={6}
                        required
                        className="transition-all duration-200 focus:shadow-glow resize-none"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full group"
                      disabled={!isFormValid || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Info & Social Links */}
            <div className="space-y-8 animate-slide-in-right">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Contact Information</CardTitle>
                  <CardDescription>
                    Other ways to reach me and some quick details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {contactInfo.map((item, index) => (
                      <div 
                        key={item.title} 
                        className="flex items-start gap-4 group animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{item.title}</h3>
                          <p className="text-foreground font-medium">{item.content}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Connect with me</CardTitle>
                  <CardDescription>
                    Follow me on social media for updates and insights.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 group animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <social.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {social.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{social.description}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Response Card */}
              <Card className="bg-gradient-primary text-primary-foreground">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Quick Response Guaranteed</h3>
                    <p className="text-primary-foreground/80">
                      I typically respond to all inquiries within 24-48 hours. 
                      For urgent matters, feel free to mention it in your message.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}