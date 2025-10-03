import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/EasterEgg.css';

const EasterEgg = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Show easter egg after 10 clicks on the savings avatar
  useEffect(() => {
    if (clickCount >= 10) {
      setIsVisible(true);
      setIsActive(true);
      
      // Auto hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsActive(false);
        setClickCount(0);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  const handleAvatarClick = () => {
    setClickCount(prev => prev + 1);
  };

  const danceSequence = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0],
      scale: [1, 1.1, 1]
    },
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse"
    }
  };

  return (
    <>
      {isVisible && (
        <motion.div 
          className="easter-egg-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="easter-egg-content"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="easter-egg-animation">
              <motion.div
                className="dancing-avatar"
                animate={danceSequence.animate}
                transition={danceSequence.transition}
              >
                🕺
              </motion.div>
            </div>
            <h2>🎉 Congratulations! 🎉</h2>
            <p>You've found the secret dance party!</p>
            <p>You're doing great with your savings! 💰</p>
          </motion.div>
        </motion.div>
      )}
      
      {/* Invisible click area for the avatar */}
      <div 
        className="avatar-click-area"
        onClick={handleAvatarClick}
      />
    </>
  );
};

export default EasterEgg;