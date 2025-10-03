import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus } from 'lucide-react';
import '../styles/AIGoalRecommendations.css';

const AIGoalRecommendations = ({ onAddGoal, existingGoals }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Generate AI recommendations based on spending patterns
  const generateRecommendations = () => {
    setIsLoading(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      // Simple recommendations that should always show
      const simpleRecommendations = [
        {
          id: 'emergency-fund-' + Date.now(),
          title: 'Build Emergency Fund',
          description: 'Save 3-6 months of expenses for unexpected events',
          target: 5000,
          category: 'savings',
          deadline: new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
          priority: 'high',
          reason: 'Financial experts recommend having 3-6 months of expenses saved'
        },
        {
          id: 'vacation-' + Date.now(),
          title: 'Plan Dream Vacation',
          description: 'Save for a special trip or experience',
          target: 3000,
          category: 'travel',
          deadline: new Date(Date.now() + 180*24*60*60*1000).toISOString().split('T')[0],
          priority: 'medium',
          reason: 'Reward yourself while building financial discipline'
        }
      ];
      
      setRecommendations(simpleRecommendations);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    // Generate initial recommendations when component mounts
    generateRecommendations();
  }, []);

  const handleAddRecommendation = (recommendation) => {
    // Convert recommendation to goal format with all required properties
    const newGoal = {
      id: Date.now(),
      title: recommendation.title,
      target: recommendation.target,
      current: 0,
      category: recommendation.category,
      deadline: recommendation.deadline,
      streak: 0
    };
    
    onAddGoal(newGoal);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffd166';
      case 'low': return '#4ecdc4';
      default: return '#667eea';
    }
  };

  return (
    <div className="ai-goal-recommendations">
      <div className="ai-header">
        <Sparkles size={24} />
        <h3>AI Goal Recommendations</h3>
        <motion.button
          className="refresh-btn"
          onClick={generateRecommendations}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Refresh'}
        </motion.button>
      </div>
      
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Analyzing your financial patterns...</p>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="recommendations-list">
          {recommendations.map((recommendation) => (
            <motion.div
              key={recommendation.id}
              className="recommendation-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div className="recommendation-header">
                <div className="priority-indicator" style={{ 
                  backgroundColor: getPriorityColor(recommendation.priority) 
                }}>
                  {recommendation.priority}
                </div>
                <h4>{recommendation.title}</h4>
              </div>
              
              <p className="recommendation-description">{recommendation.description}</p>
              <p className="recommendation-reason">{recommendation.reason}</p>
              
              <div className="recommendation-details">
                <div className="detail-item">
                  <span className="detail-label">Target:</span>
                  <span className="detail-value">${recommendation.target.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Deadline:</span>
                  <span className="detail-value">
                    {new Date(recommendation.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{recommendation.category}</span>
                </div>
              </div>
              
              <motion.button
                className="add-goal-btn"
                onClick={() => handleAddRecommendation(recommendation)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={16} />
                Add to Goals
              </motion.button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="no-recommendations">
          <p>No recommendations available at the moment.</p>
          <button onClick={generateRecommendations}>Refresh Recommendations</button>
        </div>
      )}
    </div>
  );
};

export default AIGoalRecommendations;