import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, Award, Code, FileText, MessageCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'About', href: '/about', icon: User },
  { name: 'Achievements', href: '/achievements', icon: Award },
  { name: 'Projects', href: '/projects', icon: Code },
  { name: 'Skills', href: '/skills', icon: FileText },
  { name: 'Blog', href: '/blog', icon: FileText },
  { name: 'Contact', href: '/contact', icon: MessageCircle },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled 
        ? "bg-background/80 backdrop-blur-md border-b border-border shadow-lg" 
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group animate-magnetic">
            <div className="w-10 h-10 bg-gradient-electric rounded-xl flex items-center justify-center group-hover:shadow-neon transition-all duration-500 animate-glow-pulse">
              <span className="text-white font-bold text-xl gradient-text">AR</span>
            </div>
            <span className="text-xl font-bold text-foreground group-hover:gradient-text transition-all duration-300">Arijit Ray</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group animate-magnetic glass-effect",
                    isActive(item.href)
                      ? "bg-gradient-electric text-white shadow-neon"
                      : "hover:bg-gradient-sunset hover:text-white hover:shadow-glow"
                  )}
                >
                  <Icon className="w-4 h-4 group-hover:animate-bounce" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <ThemeToggle />
            <Link to="/admin">
              <Button variant="outline" size="sm" className="ml-2 animate-magnetic glass-effect hover:bg-gradient-ocean hover:text-white hover:border-transparent">
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <Settings className="w-5 h-5" />
                <span>Admin Panel</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}