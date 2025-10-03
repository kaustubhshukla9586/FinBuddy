import { useEffect, useState } from 'react';

// Custom hook for handling scroll-triggered animations
export const useScrollAnimation = (threshold = 0.1) => {
  const [animatedElements, setAnimatedElements] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimatedElements(prev => new Set(prev).add(entry.target));
          }
        });
      },
      { threshold }
    );

    // Observe all elements with the 'scroll-animate' class
    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [threshold]);

  return animatedElements;
};

// Custom hook for handling theme changes
export const useTheme = () => {
  const [theme, setTheme] = useState('minimal');

  useEffect(() => {
    // Check for saved theme or default to 'minimal'
    const savedTheme = localStorage.getItem('theme') || 'minimal';
    setTheme(savedTheme);
    
    // Apply theme to document
    document.body.className = `theme-${savedTheme}`;
  }, []);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = `theme-${newTheme}`;
  };

  return { theme, toggleTheme };
};

// Custom hook for handling confetti effects
export const useConfetti = () => {
  const triggerConfetti = (options = {}) => {
    const defaultOptions = {
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#667eea', '#764ba2', '#FF6B6B', '#4ECDC4', '#45B7D1']
    };
    
    const confetti = window.confetti || (() => {});
    confetti({ ...defaultOptions, ...options });
  };

  return { triggerConfetti };
};