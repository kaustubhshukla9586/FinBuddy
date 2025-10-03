import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ThemeToggle from '../components/ThemeToggle';
import SavingsAvatar from '../components/SavingsAvatar';
import AchievementBadge from '../components/AchievementBadge';
import AIGoalRecommendations from '../components/AIGoalRecommendations';
import '../styles/GoalTracker.css';

const GoalTracker = () => {
  const animatedElements = useScrollAnimation(0.1);
  const [activeTab, setActiveTab] = useState('active');
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Emergency Fund',
      target: 5000,
      current: 2500,
      category: 'savings',
      deadline: '2024-12-31',
      streak: 15
    },
    {
      id: 2,
      title: 'Vacation to Hawaii',
      target: 3000,
      current: 1200,
      category: 'travel',
      deadline: '2024-08-15',
      streak: 7
    },
    {
      id: 3,
      title: 'New Laptop',
      target: 1500,
      current: 1500,
      category: 'technology',
      deadline: '2024-06-30',
      streak: 30
    }
  ]);
  
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    category: 'savings',
    deadline: ''
  });
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState(new Set(['first-goal']));

  const spendingTrends = [
    { month: 'Jan', amount: 1200 },
    { month: 'Feb', amount: 1900 },
    { month: 'Mar', amount: 1500 },
    { month: 'Apr', amount: 1800 },
    { month: 'May', amount: 2200 },
    { month: 'Jun', amount: 1700 }
  ];

  useEffect(() => {
    // Check for completed goals
    const completedGoals = goals.filter(goal => goal.current >= goal.target);
    if (completedGoals.length > 0 && !unlockedAchievements.has('milestone')) {
      setUnlockedAchievements(prev => new Set([...prev, 'milestone']));
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [goals, unlockedAchievements]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({
      ...newGoal,
      [name]: value
    });
  };

  const handleAddGoal = (goal) => {
    // If goal is passed directly (from AI recommendations), use it
    if (goal && goal.title) {
      // Ensure the goal has all required properties
      const completeGoal = {
        id: goal.id || Date.now(),
        title: goal.title,
        target: goal.target || 0,
        current: goal.current !== undefined ? goal.current : 0,
        category: goal.category || 'savings',
        deadline: goal.deadline || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0], // Default to 30 days from now
        streak: goal.streak !== undefined ? goal.streak : 0
      };
      
      setGoals([...goals, completeGoal]);
      
      // Unlock achievement if this is the first goal
      if (goals.length === 0 && !unlockedAchievements.has('first-goal')) {
        setUnlockedAchievements(prev => new Set([...prev, 'first-goal']));
      }
      
      // Switch to active goals tab to show the new goal
      setActiveTab('active');
      return;
    }
    
    // Otherwise, create from form data
    if (newGoal.title && newGoal.target && newGoal.deadline) {
      const goal = {
        id: Date.now(),
        ...newGoal,
        target: parseFloat(newGoal.target),
        current: 0,
        streak: 0
      };
      
      setGoals([...goals, goal]);
      setNewGoal({
        title: '',
        target: '',
        category: 'savings',
        deadline: ''
      });
      
      // Unlock achievement if this is the first goal
      if (goals.length === 0 && !unlockedAchievements.has('first-goal')) {
        setUnlockedAchievements(prev => new Set([...prev, 'first-goal']));
      }
    }
  };

  const handleContribute = (id, amount) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        const newCurrent = Math.min(goal.current + amount, goal.target);
        const newStreak = goal.streak + 1;
        
        // Check for streak achievement
        if (newStreak >= 7 && !unlockedAchievements.has('saving-streak')) {
          setUnlockedAchievements(prev => new Set([...prev, 'saving-streak']));
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
        
        return {
          ...goal,
          current: newCurrent,
          streak: newStreak
        };
      }
      return goal;
    }));
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
      }).format(amount);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
        duration: 1.0,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing for smoother animation
      }
    }
  };

  // Calculate total savings for avatar
  const totalSavings = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalGoal = goals.reduce((sum, goal) => sum + goal.target, 0);

  return (
    <div className="goal-tracker">
      <ThemeToggle />
      
      {/* Achievement Badges */}
      <AchievementBadge
        id="first-goal"
        title="First Goal Created"
        description="You've created your first financial goal!"
        icon="target"
        unlocked={unlockedAchievements.has('first-goal')}
      />
      
      <AchievementBadge
        id="saving-streak"
        title="Saving Streak"
        description="Maintained a 7-day saving streak!"
        icon="zap"
        unlocked={unlockedAchievements.has('saving-streak')}
      />
      
      <AchievementBadge
        id="milestone"
        title="Milestone Reached"
        description="You're halfway to your first goal!"
        icon="star"
        unlocked={unlockedAchievements.has('milestone')}
      />
      
      {showConfetti && (
        <div className="confetti-overlay">
          <motion.div
            className="confetti-message"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h2>🎉 Goal Achieved! 🎉</h2>
            <p>Congratulations on reaching your financial milestone!</p>
          </motion.div>
        </div>
      )}

      <motion.div 
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        data-scroll-id="goal-header"
      >
        <h1>Goal Tracker</h1>
        <p>Set, track, and achieve your financial goals</p>
      </motion.div>

      {/* Savings Avatar */}
      <div className="savings-avatar-section" data-scroll-id="savings-avatar">
        <SavingsAvatar savingsAmount={totalSavings} savingsGoal={totalGoal} />
      </div>

      {/* Goal tabs */}
      <motion.div 
        className="goal-tabs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        data-scroll-id="goal-tabs"
      >
        <button 
          className={activeTab === 'active' ? 'active' : ''}
          onClick={() => setActiveTab('active')}
        >
          Active Goals
        </button>
        <button 
          className={activeTab === 'completed' ? 'active' : ''}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
        <button 
          className={activeTab === 'create' ? 'active' : ''}
          onClick={() => setActiveTab('create')}
        >
          Create Goal
        </button>
        <button 
          className={activeTab === 'recommendations' ? 'active' : ''}
          onClick={() => setActiveTab('recommendations')}
        >
          AI Recommendations
        </button>
      </motion.div>

      {/* Create new goal form */}
      {activeTab === 'create' && (
        <motion.div 
          className="create-goal-form"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          data-scroll-id="create-goal-form"
        >
          <h2>Create New Goal</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleAddGoal();
          }}>
            <div className="form-group">
              <label>Goal Title</label>
              <input
                type="text"
                name="title"
                placeholder="What are you saving for?"
                value={newGoal.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Target Amount ($)</label>
                <input
                  type="number"
                  name="target"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={newGoal.target}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={newGoal.category}
                  onChange={handleInputChange}
                >
                  <option value="savings">Savings</option>
                  <option value="travel">Travel</option>
                  <option value="technology">Technology</option>
                  <option value="home">Home</option>
                  <option value="health">Health</option>
                  <option value="education">Education</option>
                  <option value="debt">Debt Reduction</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Deadline</label>
              <input
                type="date"
                name="deadline"
                value={newGoal.deadline}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <motion.button
              type="submit"
              className="submit-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create Goal
            </motion.button>
          </form>
        </motion.div>
      )}

      {/* AI Goal Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="ai-recommendations-section">
          <h2>AI-Powered Goal Recommendations</h2>
          <p>Based on financial best practices and your current situation, here are some goals you might consider:</p>
          
          <AIGoalRecommendations 
            onAddGoal={handleAddGoal} 
            existingGoals={goals} 
          />
        </div>
      )}

      {/* Active goals */}
      {activeTab === 'active' && (
        <motion.div 
          className="goals-section"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          data-scroll-id="active-goals"
        >
          {goals.filter(goal => goal.current < goal.target).length > 0 ? (
            goals.filter(goal => goal.current < goal.target).map((goal) => (
              <motion.div 
                key={goal.id}
                className="goal-card"
                variants={scrollItemVariants}
                initial="hidden"
                animate={animatedElements.has(`goal-${goal.id}`) ? "visible" : "hidden"}
                whileHover={{ y: -5 }}
                data-scroll-id={`goal-${goal.id}`}
              >
                <div className="goal-header">
                  <div className="goal-icon">
                    {goal.category === 'savings' && '💰'}
                    {goal.category === 'travel' && '✈️'}
                    {goal.category === 'technology' && '💻'}
                    {goal.category === 'home' && '🏠'}
                    {goal.category === 'health' && '❤️'}
                    {goal.category === 'education' && '📚'}
                    {goal.category === 'debt' && '💳'}
                    {goal.category === 'other' && '🎯'}
                  </div>
                  <div className="goal-info">
                    <h3>{goal.title}</h3>
                    <p className="goal-deadline">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="goal-progress">
                  <div className="progress-info">
                    <span className="current-amount">{formatCurrency(goal.current)}</span>
                    <span className="target-amount">of {formatCurrency(goal.target)}</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div 
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgressPercentage(goal.current, goal.target)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      style={{ 
                        backgroundColor: getProgressPercentage(goal.current, goal.target) >= 100 ? '#4ECDC4' : '#667eea'
                      }}
                    />
                  </div>
                  <div className="progress-percentage">
                    {getProgressPercentage(goal.current, goal.target).toFixed(1)}% complete
                  </div>
                </div>
                
                {/* Streak indicator */}
                <div className="streak-indicator">
                  <div className="streak-icon">🔥</div>
                  <div className="streak-text">{goal.streak} day streak!</div>
                </div>
                
                {/* Contribution buttons */}
                <div className="contribution-section">
                  <p>Quick contribute:</p>
                  <div className="contribution-buttons">
                    <button onClick={() => handleContribute(goal.id, 10)}>$10</button>
                    <button onClick={() => handleContribute(goal.id, 25)}>$25</button>
                    <button onClick={() => handleContribute(goal.id, 50)}>$50</button>
                    <button onClick={() => handleContribute(goal.id, 100)}>$100</button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="no-goals">
              <div className="empty-icon">🎯</div>
              <h3>No active goals</h3>
              <p>Create your first financial goal to get started!</p>
              <motion.button
                className="create-goal-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('create')}
              >
                Create Goal
              </motion.button>
            </div>
          )}
        </motion.div>
      )}

      {/* Completed goals */}
      {activeTab === 'completed' && (
        <motion.div 
          className="completed-goals"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          data-scroll-id="completed-goals"
        >
          {goals.filter(goal => goal.current >= goal.target).length > 0 ? (
            goals.filter(goal => goal.current >= goal.target).map((goal) => (
              <motion.div 
                key={goal.id}
                className="completed-goal-card"
                variants={scrollItemVariants}
                initial="hidden"
                animate={animatedElements.has(`completed-goal-${goal.id}`) ? "visible" : "hidden"}
                whileHover={{ scale: 1.02 }}
                data-scroll-id={`completed-goal-${goal.id}`}
              >
                <div className="completed-goal-header">
                  <div className="goal-icon completed">
                    {goal.category === 'savings' && '💰'}
                    {goal.category === 'travel' && '✈️'}
                    {goal.category === 'technology' && '💻'}
                    {goal.category === 'home' && '🏠'}
                    {goal.category === 'health' && '❤️'}
                    {goal.category === 'education' && '📚'}
                    {goal.category === 'debt' && '💳'}
                    {goal.category === 'other' && '🎯'}
                  </div>
                  <div className="goal-info">
                    <h3>{goal.title}</h3>
                    <p className="completion-date">Achieved on {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="completed-amount">
                  {formatCurrency(goal.current)} saved
                </div>
                
                <div className="streak-indicator completed">
                  <div className="streak-icon">🔥</div>
                  <div className="streak-text">{goal.streak} day streak maintained!</div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="no-goals">
              <div className="empty-icon">🏆</div>
              <h3>No completed goals yet</h3>
              <p>Keep working towards your financial goals!</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Spending trends chart */}
      <motion.div 
        className="trends-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        data-scroll-id="trends-section"
      >
        <h2>Spending Trends</h2>
        <div className="chart-container" style={{ minHeight: '450px' }} data-scroll-id="trends-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={spendingTrends}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Amount']}
                labelFormatter={(month) => `Month: ${month}`}
                contentStyle={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-color)',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Bar dataKey="amount" fill="#667eea" name="Amount">
                {spendingTrends.map((entry, index) => (
                  <motion.rect
                    key={`bar-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: '100%', opacity: 1 }}
                    transition={{ 
                      duration: 0.8,
                      delay: index * 0.1,
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default GoalTracker;