import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Target } from 'lucide-react';
import '../styles/AchievementBadge.css';

const AchievementBadge = ({ 
  id, 
  title, 
  description, 
  icon = 'trophy', 
  unlocked = false, 
  onUnlock,
  showConfetti = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenUnlocked, setHasBeenUnlocked] = useState(unlocked);

  // Show badge when unlocked
  useEffect(() => {
    if (unlocked && !hasBeenUnlocked) {
      setHasBeenUnlocked(true);
      setIsVisible(true);
      
      // Auto hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      
      // Trigger unlock callback
      if (onUnlock) {
        onUnlock(id);
      }
      
      // Trigger confetti if enabled
      if (showConfetti && window.confetti) {
        window.confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      return () => clearTimeout(timer);
    }
  }, [unlocked, hasBeenUnlocked, id, onUnlock, showConfetti]);

  const getIcon = () => {
    switch (icon) {
      case 'star':
        return <Star size={24} />;
      case 'zap':
        return <Zap size={24} />;
      case 'target':
        return <Target size={24} />;
      default:
        return <Trophy size={24} />;
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="achievement-badge"
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: 50 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="badge-content">
        <div className="badge-icon">
          {getIcon()}
        </div>
        <div className="badge-info">
          <h3 className="badge-title">{title}</h3>
          <p className="badge-description">{description}</p>
        </div>
      </div>
      <div className="badge-shine" />
    </motion.div>
  );
};

export default AchievementBadge;