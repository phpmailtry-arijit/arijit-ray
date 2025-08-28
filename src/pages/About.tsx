import { useState } from 'react';
import { Calendar, MapPin, Code, Award, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const timelineData = [
  {
    year: '2024',
    title: 'Senior Full Stack Developer',
    company: 'Tech Innovation Inc.',
    location: 'Remote',
    description: 'Leading development of enterprise applications using React, Node.js, and AWS.',
    skills: ['React', 'Node.js', 'AWS', 'TypeScript', 'MongoDB']
  },
  {
    year: '2022',
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Bangalore, India',
    description: 'Built scalable web applications and mobile apps for fintech startup.',
    skills: ['React Native', 'Express.js', 'PostgreSQL', 'Docker']
  },
  {
    year: '2020',
    title: 'Frontend Developer',
    company: 'WebSolutions Ltd.',
    location: 'Kolkata, India',
    description: 'Developed responsive web interfaces and improved user experience.',
    skills: ['JavaScript', 'CSS3', 'Vue.js', 'Sass']
  },
  {
    year: '2018',
    title: 'Computer Science Graduate',
    company: 'University of Technology',
    location: 'Kolkata, India',
    description: 'Graduated with honors in Computer Science and Engineering.',
    skills: ['Data Structures', 'Algorithms', 'Database Systems']
  }
];

export default function About() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                About Me
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                I'm a passionate full-stack developer with 6+ years of experience crafting digital solutions that make a difference. I specialize in modern web technologies and love turning complex problems into simple, beautiful designs.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Kolkata, India</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Available for freelance</span>
                </div>
              </div>
              <div className="flex gap-4">
                <Button className="group">
                  <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  Download Resume
                </Button>
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Portfolio
                </Button>
              </div>
            </div>
            
            <div className="relative animate-slide-in-right">
              <div className="relative w-full max-w-md mx-auto">
                <div className="aspect-square rounded-2xl bg-gradient-primary p-1 shadow-glow animate-glow-pulse">
                  <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                    <Code className="w-24 h-24 text-primary" />
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent rounded-full flex items-center justify-center animate-float">
                  <Award className="w-8 h-8 text-accent-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Professional Journey</h2>
          <div className="space-y-8">
            {timelineData.map((item, index) => (
              <Card 
                key={index}
                className={`group transition-all duration-300 cursor-pointer ${
                  hoveredCard === index ? 'shadow-elevated scale-105' : 'hover:shadow-glass'
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-lg font-medium text-primary">
                        {item.company}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-lg px-4 py-1">
                      {item.year}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{item.location}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Overview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Core Skills</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Frontend Development',
                skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
                icon: Code
              },
              {
                title: 'Backend Development',
                skills: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'GraphQL'],
                icon: Award
              },
              {
                title: 'DevOps & Tools',
                skills: ['Docker', 'AWS', 'Git', 'CI/CD', 'Kubernetes'],
                icon: MapPin
              }
            ].map((category, index) => (
              <Card key={index} className="group hover:shadow-elevated transition-all duration-300 animate-fade-in-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <category.icon className="w-12 h-12 text-primary mb-4 group-hover:animate-tech-glow" />
                  <CardTitle>{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}