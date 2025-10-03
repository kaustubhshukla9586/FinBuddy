import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import InteractiveTutorial from '../components/InteractiveTutorial';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const animatedElements = useScrollAnimation(0.1);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Check if user has been here before
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowOnboarding(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTutorialComplete = () => {
    console.log('Tutorial completed!');
    // In a real app, you might want to store this in localStorage
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const coinVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const scrollItemVariants = {
    hidden: { 
      opacity: 0, 
      y: 60, 
      scale: 0.95,
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing for smoother animation
      }
    }
  };

  // Get theme-specific gradient for buttons
  const getButtonGradient = () => {
    switch(theme) {
      case 'dark':
        return 'linear-gradient(45deg, #bb86fc, #03dac6)';
      case 'vibrant':
        return 'linear-gradient(45deg, #ff6b6b, #ffd166)';
      case 'neon':
        return 'linear-gradient(45deg, #00ffcc, #ff00ff)';
      case 'ocean':
        return 'linear-gradient(45deg, #1890ff, #52c41a)';
      case 'sunset':
        return 'linear-gradient(45deg, #fa8c16, #f5222d)';
      default:
        return 'linear-gradient(45deg, #667eea, #764ba2)';
    }
  };

  return (
    <div className="landing-page">
      {/* Interactive Tutorial */}
      <InteractiveTutorial 
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={handleTutorialComplete}
      />
      
      {/* Animated splash screen */}
      <motion.div 
        className="splash-screen"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, display: "none" }}
        transition={{ duration: 2, delay: 3 }}
      >
        <motion.div
          className="coin-animation"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="coin"
              variants={coinVariants}
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            >
              💰
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Main landing content */}
      <motion.div 
        className="landing-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
      >
        <div className="header">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 3.5 }}
            data-scroll-id="landing-title"
          >
            Take Control of Your Finances
          </motion.h1>
          <motion.p
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 3.7 }}
            data-scroll-id="landing-subtitle"
          >
            Smart money management with AI-powered insights
          </motion.p>
        </div>

        <motion.div 
          className="avatar-section"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            delay: 4
          }}
          data-scroll-id="avatar-section"
        >
          <label className="avatar-upload">
            {avatar ? (
              <motion.img 
                src={avatar} 
                alt="Profile" 
                className="profile-avatar"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ 
                  boxShadow: `0 0 20px ${getButtonGradient().split(',')[0].split('(')[1]}40`
                }}
                data-scroll-id="profile-avatar"
              />
            ) : (
              <motion.div 
                className="avatar-placeholder"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ 
                  background: getButtonGradient(),
                  boxShadow: `0 0 20px ${getButtonGradient().split(',')[0].split('(')[1]}40`
                }}
                data-scroll-id="avatar-placeholder"
              >
                <span>👤</span>
                <p>Upload Avatar</p>
              </motion.div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
            />
          </label>
        </motion.div>

        <motion.div 
          className="action-buttons"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 4.2 }}
          data-scroll-id="action-buttons"
        >
          <motion.button
            className="primary-btn"
            variants={scrollItemVariants}
            initial="hidden"
            animate={animatedElements.has('sign-in-btn') ? "visible" : "hidden"}
            whileHover={{ 
              scale: 1.05,
              boxShadow: `0 10px 20px ${getButtonGradient().split(',')[0].split('(')[1]}40`
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            style={{ background: getButtonGradient() }}
            data-scroll-id="sign-in-btn"
            data-scroll-delay="0"
          >
            Sign In
          </motion.button>
          
          <motion.button
            className="secondary-btn"
            variants={scrollItemVariants}
            initial="hidden"
            animate={animatedElements.has('sign-up-btn') ? "visible" : "hidden"}
            transition={{ delay: 0.1 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: `0 10px 20px ${getButtonGradient().split(',')[0].split('(')[1]}40`
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            style={{ background: getButtonGradient() }}
            data-scroll-id="sign-up-btn"
            data-scroll-delay="100"
          >
            Sign Up
          </motion.button>
          
          <motion.button
            className="ghost-btn"
            variants={scrollItemVariants}
            initial="hidden"
            animate={animatedElements.has('guest-btn') ? "visible" : "hidden"}
            transition={{ delay: 0.2 }}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'var(--hover-color)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            data-scroll-id="guest-btn"
            data-scroll-delay="200"
          >
            Continue as Guest
          </motion.button>
          
          <motion.button
            className="tutorial-btn"
            variants={scrollItemVariants}
            initial="hidden"
            animate={animatedElements.has('tutorial-btn') ? "visible" : "hidden"}
            transition={{ delay: 0.3 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: `0 10px 20px ${getButtonGradient().split(',')[0].split('(')[1]}40`
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTutorial(true)}
            style={{ background: getButtonGradient() }}
            data-scroll-id="tutorial-btn"
            data-scroll-delay="300"
          >
            Show Tutorial
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Onboarding tutorial */}
      {showOnboarding && (
        <motion.div 
          className="onboarding-tutorial"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ background: 'var(--card-gradient)' }}
          data-scroll-id="onboarding-tutorial"
        >
          <div className="tutorial-content">
            <motion.h2
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Welcome!
            </motion.h2>
            <div className="tutorial-steps">
              <motion.div 
                className="step"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                data-scroll-id="tutorial-step-1"
              >
                <div className="step-icon" style={{ background: getButtonGradient() }}>📊</div>
                <h3>Dashboard</h3>
                <p>Visualize your spending with interactive charts</p>
              </motion.div>
              
              <motion.div 
                className="step"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                data-scroll-id="tutorial-step-2"
              >
                <div className="step-icon" style={{ background: getButtonGradient() }}>🤖</div>
                <h3>AI Assistant</h3>
                <p>Get personalized financial advice</p>
              </motion.div>
              
              <motion.div 
                className="step"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                data-scroll-id="tutorial-step-3"
              >
                <div className="step-icon" style={{ background: getButtonGradient() }}>🎯</div>
                <h3>Goal Tracker</h3>
                <p>Set and achieve your financial goals</p>
              </motion.div>
            </div>
            
            <motion.button
              className="close-tutorial"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowOnboarding(false)}
              style={{ background: getButtonGradient() }}
            >
              Get Started
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LandingPage;