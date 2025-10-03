import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import '../styles/SmartAlert.css';

const SmartAlert = ({ type, message, amount, category, onDismiss, autoDismiss = true }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss]);

  const handleClose = () => {
    setIsVisible(false);
    if (onDismiss) {
      setTimeout(onDismiss, 300); // Wait for animation to complete
    }
  };

  const getAlertIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'success':
        return <TrendingDown size={20} />;
      case 'info':
        return <TrendingUp size={20} />;
      default:
        return <AlertTriangle size={20} />;
    }
  };

  const getAlertMessage = () => {
    if (message) return message;
    
    switch (type) {
      case 'warning':
        return `Your ${category} spending is catching up with rent 🍕💸`;
      case 'success':
        return `Great job! You're under budget for ${category} this week 🎉`;
      case 'info':
        return `You've spent $${amount} on ${category} this week`;
      default:
        return message || 'Notification';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`smart-alert ${type}`}
          initial={{ opacity: 0, y: -50, scale: 0.3 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            x: [0, 5, -5, 5, 0] // Witty shake animation for warnings
          }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            x: type === 'warning' ? { duration: 0.5, repeat: 2 } : { duration: 0 }
          }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="alert-content">
            <div className="alert-icon">
              {getAlertIcon()}
            </div>
            <div className="alert-message">
              {getAlertMessage()}
            </div>
            <button className="dismiss-button" onClick={handleClose}>
              <X size={16} />
            </button>
          </div>
          
          {amount && (
            <div className="alert-amount">
              ${amount}
            </div>
          )}
          
          <div className="alert-chart">
            <div className="chart-bar" style={{ 
              width: `${Math.min((amount / 200) * 100, 100)}%`,
              backgroundColor: type === 'warning' ? '#FF6B6B' : type === 'success' ? '#4ECDC4' : '#45B7D1'
            }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SmartAlert;