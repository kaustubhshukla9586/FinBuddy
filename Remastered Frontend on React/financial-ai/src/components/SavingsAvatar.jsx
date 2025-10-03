import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EasterEgg from './EasterEgg';
import '../styles/SavingsAvatar.css';

const SavingsAvatar = ({ savingsAmount, savingsGoal }) => {
  const [level, setLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [particles, setParticles] = useState([]);
  const [isDancing, setIsDancing] = useState(false);

  // Calculate progress percentage
  const progress = Math.min((savingsAmount / savingsGoal) * 100, 100);
  
  // Calculate level based on savings
  useEffect(() => {
    const newLevel = Math.floor(savingsAmount / (savingsGoal / 5)) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      setShowLevelUp(true);
      generateParticles();
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  }, [savingsAmount, savingsGoal, level]);

  // Trigger dance animation when under budget
  useEffect(() => {
    if (savingsAmount > 0 && savingsAmount < savingsGoal * 0.5) {
      setIsDancing(true);
      const timer = setTimeout(() => setIsDancing(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [savingsAmount, savingsGoal]);

  // Generate particles for level up effect
  const generateParticles = () => {
    const newParticles = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 10 + 5,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 5)]
      });
    }
    setParticles(newParticles);
  };

  // Get avatar appearance based on level
  const getAvatarAppearance = () => {
    if (level >= 5) return '👑'; // Crown for max level
    if (level >= 4) return '🦊'; // Fox for level 4
    if (level >= 3) return '🐱'; // Cat for level 3
    if (level >= 2) return '🐰'; // Rabbit for level 2
    return '🐹'; // Hamster for level 1
  };

  return (
    <div className="savings-avatar">
      <EasterEgg />
      
      <div className="avatar-container">
        {/* Progress ring */}
        <div className="progress-ring">
          <svg width="120" height="120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="8"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#4ECDC4"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress / 100)}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - progress / 100) }}
              transition={{ duration: 1 }}
              transform="rotate(-90 60 60)"
            />
          </svg>
          
          {/* Avatar */}
          <motion.div 
            className="avatar"
            animate={{ 
              scale: showLevelUp || isDancing ? [1, 1.2, 1] : 1,
              rotate: showLevelUp ? [0, 10, -10, 0] : (isDancing ? [0, -10, 10, 0] : 0),
              y: isDancing ? [0, -10, 0] : 0
            }}
            transition={{ 
              duration: showLevelUp ? 0.5 : (isDancing ? 0.3 : 0.3),
              repeat: showLevelUp ? 2 : (isDancing ? Infinity : 0),
              repeatType: "reverse"
            }}
          >
            {getAvatarAppearance()}
          </motion.div>
        </div>
        
        {/* Level indicator */}
        <div className="level-indicator">
          Level {level}
        </div>
        
        {/* Savings info */}
        <div className="savings-info">
          <div className="amount">${savingsAmount.toFixed(2)}</div>
          <div className="goal">of ${savingsGoal.toFixed(2)} goal</div>
        </div>
      </div>
      
      {/* Level up animation */}
      {showLevelUp && (
        <motion.div 
          className="level-up"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <div className="level-up-text">Level Up! 🎉</div>
        </motion.div>
      )}
      
      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color
          }}
          initial={{ opacity: 1, y: 0, x: 0 }}
          animate={{ 
            opacity: 0, 
            y: Math.random() > 0.5 ? -100 : 100, 
            x: (Math.random() - 0.5) * 100 
          }}
          transition={{ duration: 1.5 }}
        />
      ))}
    </div>
  );
};

export default SavingsAvatar;