import React from 'react';
import { motion } from 'framer-motion';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', message = '' }) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  return (
    <div className="loading-spinner-container">
      <motion.div 
        className={`loading-spinner ${sizeClasses[size]}`}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        <div className="spinner-ring">
          <div className="spinner-segment"></div>
          <div className="spinner-segment"></div>
          <div className="spinner-segment"></div>
          <div className="spinner-segment"></div>
        </div>
      </motion.div>
      
      {message && (
        <motion.div 
          className="loading-message"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.div>
      )}
    </div>
  );
};

export default LoadingSpinner;