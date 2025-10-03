import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('minimal');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousTheme, setPreviousTheme] = useState(null);

  // Apply theme to document on change with enhanced transition effects
  useEffect(() => {
    if (theme) {
      setIsTransitioning(true);
      setPreviousTheme(document.body.className);
      
      // Add enhanced transition classes
      document.body.classList.add('theme-transition');
      document.body.classList.add('theme-changing');
      
      // Apply theme after a short delay to allow for transition
      const timeout = setTimeout(() => {
        document.body.className = `theme-${theme}`;
        document.body.classList.add('theme-transition');
        document.body.classList.remove('theme-changing');
        setIsTransitioning(false);
      }, 300);
      
      // Clean up
      return () => {
        clearTimeout(timeout);
        document.body.classList.remove('theme-transition', 'theme-changing');
      };
    }
  }, [theme]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'minimal';
    setTheme(savedTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isTransitioning, previousTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};