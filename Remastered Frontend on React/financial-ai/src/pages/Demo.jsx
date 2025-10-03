import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  BarChart3, 
  Wallet, 
  Target, 
  Bot,
  Sun,
  Moon,
  Zap,
  Trophy,
  Gift
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import SavingsAvatar from '../components/SavingsAvatar';
import SmartAlert from '../components/SmartAlert';
import '../styles/Demo.css';

const Demo = () => {
  const [alerts, setAlerts] = useState([]);
  const [savingsAmount, setSavingsAmount] = useState(1200);
  const [savingsGoal] = useState(5000);

  // Add demo alerts
  useEffect(() => {
    const demoAlerts = [
      {
        id: 1,
        type: 'warning',
        message: "Your food spending is catching up with rent 🍕💸",
        amount: 180,
        category: 'food'
      },
      {
        id: 2,
        type: 'success',
        message: "Great job! You're under budget for entertainment this week 🎉",
        amount: 45,
        category: 'entertainment'
      },
      {
        id: 3,
        type: 'info',
        message: "You've spent $120 on transport this week",
        amount: 120,
        category: 'transport'
      }
    ];
    
    setAlerts(demoAlerts);
  }, []);

  const handleDismissAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const features = [
    {
      icon: Home,
      title: "Landing Page",
      description: "Animated splash screen with theme switching",
      path: "/"
    },
    {
      icon: BarChart3,
      title: "Dashboard",
      description: "Interactive charts and heatmaps",
      path: "/dashboard"
    },
    {
      icon: Wallet,
      title: "Expense Tracking",
      description: "CSV upload and bank integration",
      path: "/expenses"
    },
    {
      icon: Target,
      title: "Goal Tracker",
      description: "Progress tracking with confetti",
      path: "/goals"
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description: "Chat-based financial advice",
      path: "/ai-assistant"
    }
  ];

  const gamificationFeatures = [
    {
      icon: Trophy,
      title: "Achievements",
      description: "Unlock badges as you reach milestones"
    },
    {
      icon: Gift,
      title: "Rewards",
      description: "Earn rewards for consistent saving habits"
    },
    {
      icon: Zap,
      title: "Streaks",
      description: "Maintain saving streaks for bonuses"
    }
  ];

  return (
    <div className="demo">
      <ThemeToggle />
      
      {/* Alerts */}
      {alerts.map((alert, index) => (
        <div 
          key={alert.id} 
          style={{ 
            top: `${1 + index * 6}rem`,
            zIndex: 1000 - index
          }}
        >
          <SmartAlert
            type={alert.type}
            message={alert.message}
            amount={alert.amount}
            category={alert.category}
            onDismiss={() => handleDismissAlert(alert.id)}
          />
        </div>
      ))}
      
      <div className="demo-container">
        <motion.div 
          className="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>FinWise AI Demo</h1>
          <p>Experience all the features of our smart financial management tool</p>
        </motion.div>

        {/* Hero section with avatar */}
        <motion.div 
          className="hero-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="hero-content">
            <div className="avatar-demo">
              <SavingsAvatar savingsAmount={savingsAmount} savingsGoal={savingsGoal} />
            </div>
            <div className="hero-text">
              <h2>Smart Financial Management</h2>
              <p>
                FinWise AI combines beautiful design with powerful financial tools 
                to help you take control of your money.
              </p>
              <div className="savings-controls">
                <button 
                  className="control-btn"
                  onClick={() => setSavingsAmount(Math.max(0, savingsAmount - 100))}
                >
                  - $100
                </button>
                <span className="savings-display">
                  Savings: ${savingsAmount}
                </span>
                <button 
                  className="control-btn"
                  onClick={() => setSavingsAmount(Math.min(savingsGoal, savingsAmount + 100))}
                >
                  + $100
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main features */}
        <motion.div 
          className="features-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2>Main Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="feature-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <div className="feature-icon">
                    <Icon size={32} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Gamification features */}
        <motion.div 
          className="gamification-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2>Gamification</h2>
          <div className="features-grid">
            {gamificationFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="feature-card gamification"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <div className="feature-icon">
                    <Icon size={32} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Tech stack */}
        <motion.div 
          className="tech-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2>Built with Modern Tech</h2>
          <div className="tech-stack">
            <div className="tech-item">React</div>
            <div className="tech-item">Vite</div>
            <div className="tech-item">Framer Motion</div>
            <div className="tech-item">Recharts</div>
            <div className="tech-item">CSS Modules</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Demo;