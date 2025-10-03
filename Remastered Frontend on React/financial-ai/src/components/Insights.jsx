import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/Insights.css';

const Insights = () => {
  const { theme } = useTheme();
  const [insights, setInsights] = useState([]);

  // Generate mock insights
  useEffect(() => {
    const mockInsights = [
      {
        id: 1,
        title: "Food Spending Up",
        description: "You're spending 25% more on food this week compared to last week",
        impact: "negative",
        amount: 45,
        icon: TrendingUp
      },
      {
        id: 2,
        title: "Savings Milestone",
        description: "You've saved $300 this month, 15% more than last month!",
        impact: "positive",
        amount: 300,
        icon: Target
      },
      {
        id: 3,
        title: "Transport Efficiency",
        description: "Your transport costs are 20% below average for your area",
        impact: "positive",
        amount: 20,
        icon: TrendingDown
      },
      {
        id: 4,
        title: "Entertainment Budget",
        description: "You're on track to underspend your entertainment budget by $50",
        impact: "positive",
        amount: 50,
        icon: Zap
      }
    ];
    
    setInsights(mockInsights);
  }, []);

  const getImpactColor = (impact) => {
    // Theme-aware colors
    if (impact === 'positive') {
      switch(theme) {
        case 'dark': return '#03dac6';
        case 'vibrant': return '#06d6a0';
        case 'neon': return '#00ffcc';
        case 'ocean': return '#52c41a';
        case 'sunset': return '#52c41a';
        default: return '#4ECDC4';
      }
    } else {
      switch(theme) {
        case 'dark': return '#cf6679';
        case 'vibrant': return '#ef476f';
        case 'neon': return '#ff00aa';
        case 'ocean': return '#f5222d';
        case 'sunset': return '#f5222d';
        default: return '#FF6B6B';
      }
    }
  };

  return (
    <div className="insights">
      <div className="insights-header">
        <h2>Weekly Insights</h2>
        <p>AI-powered financial patterns and recommendations</p>
      </div>
      
      <div className="insights-grid">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={insight.id}
              className={`insight-card ${insight.impact}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="insight-header">
                <div 
                  className="insight-icon"
                  style={{ backgroundColor: `${getImpactColor(insight.impact)}20` }}
                >
                  <Icon 
                    size={20} 
                    color={getImpactColor(insight.impact)} 
                  />
                </div>
                <h3>{insight.title}</h3>
              </div>
              
              <p className="insight-description">{insight.description}</p>
              
              <div className="insight-amount" style={{ color: getImpactColor(insight.impact) }}>
                {insight.impact === 'positive' ? '+' : ''}{insight.amount}
                {insight.id === 1 ? '%' : insight.id === 2 ? '' : '%'}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Insights;