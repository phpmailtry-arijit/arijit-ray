
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/navigation/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { AchievementsSection } from '@/components/sections/AchievementsSection';
import { ContactSection } from '@/components/sections/ContactSection';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle navigation to specific sections
    if (location.pathname === '/skills') {
      const skillsSection = document.getElementById('skills');
      if (skillsSection) {
        skillsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (location.pathname === '/achievements') {
      const achievementsSection = document.getElementById('achievements');
      if (achievementsSection) {
        achievementsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <AchievementsSection />
      <ContactSection />
    </div>
  );
};

export default Index;
