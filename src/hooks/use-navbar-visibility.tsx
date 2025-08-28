import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useNavbarVisibility() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const location = useLocation();
  
  const isHomePage = location.pathname === '/';
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Always hide navbar on admin pages
    if (isAdminPage) {
      setIsVisible(false);
      return;
    }

    // Show navbar by default on non-home pages
    if (!isHomePage) {
      setIsVisible(true);
      return;
    }

    // Handle scroll behavior for home page
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight * 0.8; // Approximate hero section height
      
      setHasScrolled(scrollPosition > 50);
      setIsVisible(scrollPosition > heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage, isAdminPage]);

  return {
    isVisible: isAdminPage ? false : isVisible,
    hasScrolled,
    isHomePage,
    isAdminPage
  };
}