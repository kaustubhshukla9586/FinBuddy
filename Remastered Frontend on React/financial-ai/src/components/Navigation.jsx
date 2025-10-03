import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Home, 
  BarChart3, 
  Wallet, 
  Target, 
  Bot,
  Zap,
  Shield
} from 'lucide-react';
import '../styles/Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const [isAdmin, setIsAdmin] = useState(false); // In a real app, this would come from auth context

  // Toggle admin mode for demo purposes
  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
  };

  const navItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/expenses', icon: Wallet, label: 'Expenses' },
    { path: '/goals', icon: Target, label: 'Goals' },
    { path: '/ai-assistant', icon: Bot, label: 'AI Assistant' },
    { path: '/demo', icon: Zap, label: 'Demo' }
  ];

  // Add admin dashboard to nav items if user is admin
  if (isAdmin) {
    navItems.push({ path: '/admin', icon: Shield, label: 'Admin' });
  }

  // Get theme-specific accent color for active state
  const getActiveStyle = () => {
    switch(theme) {
      case 'dark': return { color: '#bb86fc' };
      case 'vibrant': return { color: '#ffd166' };
      case 'neon': return { color: '#00ffcc' };
      case 'ocean': return { color: '#52c41a' };
      case 'sunset': return { color: '#f5222d' };
      default: return { color: '#667eea' };
    }
  };

  return (
    <nav className="navigation">
      <div className="nav-items">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <motion.div
              key={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              whileHover={{ 
                scale: 1.05,
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
              animate={isActive ? { 
                boxShadow: `0 5px 15px ${getActiveStyle().color}40`
              } : {}}
              transition={{ duration: 0.3 }}
            >
              <Link to={item.path}>
                <div className="nav-icon" style={isActive ? getActiveStyle() : {}}>
                  <Icon size={24} />
                </div>
                <span className="nav-label">{item.label}</span>
                {isActive && (
                  <motion.div 
                    className="active-indicator"
                    layoutId="activeNav"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
      
      {/* Admin toggle for demo purposes */}
      <div className="admin-toggle" onClick={toggleAdminMode}>
        <Shield size={20} />
        <span>{isAdmin ? 'Admin Mode: ON' : 'Admin Mode: OFF'}</span>
      </div>
    </nav>
  );
};

export default Navigation;