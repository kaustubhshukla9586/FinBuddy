import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import '../styles/ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const themes = [
    { id: 'minimal', name: 'Minimal', icon: '⚪', color: '#667eea', description: 'Clean and professional' },
    { id: 'dark', name: 'Dark', icon: '⚫', color: '#bb86fc', description: 'Sophisticated and modern' },
    { id: 'vibrant', name: 'Vibrant', icon: '🔴', color: '#ff6b6b', description: 'Energetic and bold' },
    { id: 'neon', name: 'Neon', icon: '🟢', color: '#00ffcc', description: 'Futuristic and cyberpunk' },
    { id: 'ocean', name: 'Ocean', icon: '🔵', color: '#1890ff', description: 'Calming and professional' },
    { id: 'sunset', name: 'Sunset', icon: '🟠', color: '#fa8c16', description: 'Warm and inviting' }
  ];

  const currentTheme = themes.find(t => t.id === theme) || themes[0];

  const handleThemeChange = (newTheme) => {
    if (newTheme !== theme) {
      toggleTheme(newTheme);
      setIsOpen(false);
      
      // Trigger confetti for special themes
      if (newTheme === 'vibrant' || newTheme === 'neon') {
        setShowConfetti(true);
        triggerConfetti(newTheme);
      }
    } else {
      setIsOpen(false);
    }
  };

  const triggerConfetti = (themeType) => {
    const colors = themeType === 'vibrant' 
      ? ['#ff6b6b', '#ffd166', '#06d6a0', '#118ab2', '#073b4c']
      : ['#00ffcc', '#ff00ff', '#00ffff', '#ff00aa'];
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
      zIndex: 2000
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const toggleElement = document.querySelector('.theme-toggle');
      if (toggleElement && !toggleElement.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="theme-toggle">
      <motion.button
        className="theme-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          backgroundColor: currentTheme.color,
          boxShadow: isTransitioning 
            ? [`0 0 0px ${currentTheme.color}00`, `0 0 30px ${currentTheme.color}80`, `0 0 0px ${currentTheme.color}00`]
            : `0 0 20px ${currentTheme.color}40`
        }}
        transition={{ 
          duration: 0.5,
          backgroundColor: { duration: 0.3 },
          boxShadow: { 
            duration: 0.8,
            repeat: isTransitioning ? Infinity : 0,
            repeatType: "loop"
          }
        }}
      >
        <motion.span 
          className="theme-icon"
          animate={isTransitioning ? { rotate: 360 } : {}}
          transition={{ duration: 0.5 }}
        >
          {currentTheme.icon}
        </motion.span>
        <span className="theme-name">{currentTheme.name}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="theme-dropdown"
            initial={{ opacity: 0, y: -20, scale: 0.8, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.8, rotateX: -15 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="theme-dropdown-header">
              <h3>Choose Theme</h3>
              <p>Select your preferred visual style</p>
            </div>
            
            {themes.map((t) => (
              <motion.button
                key={t.id}
                className={`theme-option ${theme === t.id ? 'active' : ''}`}
                onClick={() => handleThemeChange(t.id)}
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: `var(--hover-color)`,
                  x: theme === t.id ? 0 : 5
                }}
                whileTap={{ scale: 0.98 }}
                title={t.name}
              >
                <motion.span 
                  className="theme-icon"
                  animate={theme === t.id ? { scale: 1.2 } : {}}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {t.icon}
                </motion.span>
                <div className="theme-info">
                  <span className="theme-label">{t.name}</span>
                  <span className="theme-description">{t.description}</span>
                </div>
                {theme === t.id && (
                  <motion.span 
                    className="checkmark"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    ✓
                  </motion.span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;