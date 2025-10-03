import React from 'react';
import { motion } from 'framer-motion';
import useScrollAnimation from '../hooks/useScrollAnimation';
import useFinancialData from '../hooks/useFinancialData';
import ThemeToggle from '../components/ThemeToggle';
import AIFinancialAssistant from '../components/AIFinancialAssistant';
import '../styles/AIAssistant.css';

const AIAssistant = () => {
  const animatedElements = useScrollAnimation(0.1);
  const { goals, expenses, income, savings, loading, error } = useFinancialData();

  if (loading) {
    return (
      <div className="ai-assistant">
        <ThemeToggle />
        <motion.div 
          className="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>AI Financial Assistant</h1>
          <p>Your personal AI-powered financial advisor</p>
        </motion.div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your financial data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ai-assistant">
        <ThemeToggle />
        <motion.div 
          className="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>AI Financial Assistant</h1>
          <p>Your personal AI-powered financial advisor</p>
        </motion.div>
        <div className="error-container">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  // Calculate financial insights
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  const goalProgress = goals.length > 0 
    ? goals.reduce((sum, goal) => sum + (goal.current / goal.target), 0) / goals.length * 100 
    : 0;

  return (
    <div className="ai-assistant">
      <ThemeToggle />
      
      <motion.div 
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        data-scroll-id="ai-header"
      >
        <h1>AI Financial Assistant</h1>
        <p>Your personal AI-powered financial advisor</p>
      </motion.div>

      <div className="assistant-layout">
        <motion.div 
          className="assistant-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          data-scroll-id="assistant-main"
        >
          <AIFinancialAssistant 
            goals={goals}
            expenses={expenses}
            income={income}
            savings={savings}
            onAskRecommendation={(type) => console.log('Recommendation requested:', type)}
            onAskAnalysis={(type) => console.log('Analysis requested:', type)}
          />
        </motion.div>
        
        <motion.div 
          className="insights-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          data-scroll-id="assistant-insights"
        >
          <div className="insights-card">
            <h3>Financial Overview</h3>
            <div className="insight-item">
              <span className="insight-label">Monthly Income</span>
              <span className="insight-value">${totalIncome.toLocaleString()}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Monthly Expenses</span>
              <span className="insight-value">${totalExpenses.toLocaleString()}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Net Savings</span>
              <span className={`insight-value ${netSavings >= 0 ? 'positive' : 'negative'}`}>
                ${netSavings.toLocaleString()}
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Savings Rate</span>
              <span className={`insight-value ${savingsRate >= 20 ? 'positive' : savingsRate >= 10 ? '' : 'negative'}`}>
                {savingsRate.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="insights-card">
            <h3>Goal Progress</h3>
            {goals.slice(0, 3).map((goal) => (
              <div className="goal-progress-item" key={goal.id}>
                <div className="goal-info">
                  <span className="goal-title">{goal.title}</span>
                  <span className="goal-amount">${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</span>
                </div>
                <div className="goal-progress-bar">
                  <div 
                    className="goal-progress-fill" 
                    style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {goals.length === 0 && (
              <p>No goals set yet. Start by creating your first financial goal!</p>
            )}
          </div>
          
          <div className="insights-card">
            <h3>Recent Activity</h3>
            <div className="activity-item">
              <div className="activity-icon savings">💰</div>
              <div className="activity-details">
                <span className="activity-title">Total Savings</span>
                <span className="activity-amount">${savings.toLocaleString()}</span>
                <span className="activity-time">Current balance</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon expense">📊</div>
              <div className="activity-details">
                <span className="activity-title">Goals Tracking</span>
                <span className="activity-amount">{goals.length} goals</span>
                <span className="activity-time">{goals.filter(g => g.current >= g.target).length} completed</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon goal">📈</div>
              <div className="activity-details">
                <span className="activity-title">Financial Health</span>
                <span className="activity-description">
                  {savingsRate >= 20 ? 'Excellent' : savingsRate >= 10 ? 'Good' : 'Needs improvement'}
                </span>
                <span className="activity-time">Savings rate: {savingsRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIAssistant;