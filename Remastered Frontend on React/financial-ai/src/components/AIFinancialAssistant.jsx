import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Send, 
  Mic, 
  Volume2, 
  TrendingUp, 
  Wallet, 
  Target, 
  AlertTriangle,
  CheckCircle,
  PieChart,
  Calendar,
  DollarSign
} from 'lucide-react';
import '../styles/AIFinancialAssistant.css';

const AIFinancialAssistant = ({ 
  goals = [], 
  expenses = [], 
  income = [], 
  savings = 0,
  onAskRecommendation,
  onAskAnalysis
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I'm your AI Financial Assistant. I can help you analyze your spending patterns, provide savings recommendations, and help you achieve your financial goals. What would you like to know?",
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Calculate financial insights
  const calculateInsights = () => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    const goalProgress = goals.length > 0 
      ? goals.reduce((sum, goal) => sum + (goal.current / goal.target), 0) / goals.length * 100 
      : 0;

    return {
      totalExpenses,
      totalIncome,
      savingsRate,
      goalProgress,
      netSavings: totalIncome - totalExpenses
    };
  };

  const insights = calculateInsights();

  const quickSuggestions = [
    "Analyze my spending patterns",
    "How can I save more money?",
    "Am I on track with my goals?",
    "Show me my expense breakdown",
    "Recommend a savings strategy"
  ];

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      let response = "";
      
      // Simple intent detection
      const lowerText = inputText.toLowerCase();
      
      if (lowerText.includes('spend') || lowerText.includes('expense') || lowerText.includes('pattern')) {
        response = generateSpendingAnalysis();
      } else if (lowerText.includes('save') || lowerText.includes('saving')) {
        response = generateSavingsRecommendation();
      } else if (lowerText.includes('goal') || lowerText.includes('track')) {
        response = generateGoalAnalysis();
      } else if (lowerText.includes('budget')) {
        response = generateBudgetRecommendation();
      } else if (lowerText.includes('invest')) {
        response = "Based on your current financial situation, I recommend first building an emergency fund of 3-6 months of expenses. Once that's established, consider low-cost index funds for long-term growth. What's your risk tolerance?";
      } else {
        response = generateGeneralResponse();
      }
      
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateSpendingAnalysis = () => {
    if (expenses.length === 0) {
      return "I don't see any expense data yet. Please add some expenses so I can analyze your spending patterns.";
    }
    
    // Categorize expenses
    const categoryTotals = {};
    expenses.forEach(expense => {
      const category = expense.category || 'Other';
      categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
    });
    
    const highestCategory = Object.keys(categoryTotals).reduce((a, b) => 
      categoryTotals[a] > categoryTotals[b] ? a : b
    );
    
    return `I've analyzed your spending patterns:\n\n` +
           `• Total expenses: $${insights.totalExpenses.toFixed(2)}\n` +
           `• Highest spending category: ${highestCategory} ($${categoryTotals[highestCategory].toFixed(2)})\n` +
           `• You're spending ${((categoryTotals[highestCategory] / insights.totalExpenses) * 100).toFixed(1)}% of your total expenses on ${highestCategory}\n\n` +
           `Recommendation: Consider reviewing your ${highestCategory} expenses to identify potential savings opportunities.`;
  };

  const generateSavingsRecommendation = () => {
    const recommendations = [];
    
    if (insights.savingsRate < 10) {
      recommendations.push("Your savings rate is below the recommended 10%. Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.");
    } else if (insights.savingsRate < 20) {
      recommendations.push("Good job! You're saving, but could aim for the recommended 20% savings rate.");
    } else {
      recommendations.push("Excellent! You're saving at a healthy rate. Consider investing some of these savings for long-term growth.");
    }
    
    if (goals.length > 0) {
      recommendations.push(`You have ${goals.length} financial goals. Prioritizing high-interest debt repayment can free up more money for savings.`);
    }
    
    return `Savings Analysis:\n\n` +
           `• Current savings rate: ${insights.savingsRate.toFixed(1)}%\n` +
           `• Monthly net savings: $${insights.netSavings.toFixed(2)}\n\n` +
           `Recommendations:\n` +
           recommendations.map((rec, i) => `• ${rec}`).join('\n');
  };

  const generateGoalAnalysis = () => {
    if (goals.length === 0) {
      return "You don't have any financial goals set yet. I recommend starting with an emergency fund of 3-6 months of expenses. Would you like me to help you create a goal?";
    }
    
    const completedGoals = goals.filter(goal => goal.current >= goal.target);
    const inProgressGoals = goals.filter(goal => goal.current < goal.target);
    
    return `Goal Analysis:\n\n` +
           `• Total goals: ${goals.length}\n` +
           `• Completed goals: ${completedGoals.length}\n` +
           `• In-progress goals: ${inProgressGoals.length}\n` +
           `• Average progress: ${insights.goalProgress.toFixed(1)}%\n\n` +
           `Recommendation: Focus on your highest priority goal. Consider setting up automatic transfers to make consistent progress.`;
  };

  const generateBudgetRecommendation = () => {
    return `Budget Recommendation:\n\n` +
           `• Monthly income: $${insights.totalIncome.toFixed(2)}\n` +
           `• Monthly expenses: $${insights.totalExpenses.toFixed(2)}\n` +
           `• Available for savings: $${insights.netSavings.toFixed(2)}\n\n` +
           `Suggested allocation:\n` +
           `• 50% for needs ($${(insights.totalIncome * 0.5).toFixed(2)})\n` +
           `• 30% for wants ($${(insights.totalIncome * 0.3).toFixed(2)})\n` +
           `• 20% for savings/debt ($${(insights.totalIncome * 0.2).toFixed(2)})\n\n` +
           `Would you like me to help you adjust your budget categories?`;
  };

  const generateGeneralResponse = () => {
    const responses = [
      `Based on your financial data, I recommend reviewing your spending habits. Your current savings rate is ${insights.savingsRate.toFixed(1)}%.`,
      `I've analyzed your financial situation. You have $${insights.netSavings.toFixed(2)} in monthly savings potential. How would you like to allocate this?`,
      `Your financial health looks ${insights.savingsRate > 20 ? 'excellent' : insights.savingsRate > 10 ? 'good' : 'needs improvement'}. Would you like specific recommendations?`,
      `I can help you optimize your finances. What specific area would you like to focus on: spending, saving, or investing?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="ai-financial-assistant">
      <div className="assistant-header">
        <div className="assistant-title">
          <Bot size={24} />
          <h3>AI Financial Assistant</h3>
        </div>
        <div className="assistant-stats">
          <div className="stat-item">
            <DollarSign size={16} />
            <span>${insights.netSavings.toFixed(2)}/mo</span>
          </div>
          <div className="stat-item">
            <TrendingUp size={16} />
            <span>{insights.savingsRate.toFixed(1)}% saved</span>
          </div>
          <div className="stat-item">
            <Target size={16} />
            <span>{insights.goalProgress.toFixed(1)}% goal</span>
          </div>
        </div>
      </div>

      <div className="chat-container">
        <div className="messages">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`message ${message.sender}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="message-content">
                <div className="message-text">
                  {message.text.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              className="message ai"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="message-content">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="suggestions">
          {quickSuggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              className="suggestion-chip"
              onClick={() => handleSuggestionClick(suggestion)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {suggestion}
            </motion.button>
          ))}
        </div>

        <div className="input-area">
          <div className="input-container">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your finances..."
              rows={1}
            />
            <motion.button
              className="voice-btn"
              onClick={() => setIsListening(!isListening)}
              whileTap={{ scale: 0.9 }}
              animate={{ backgroundColor: isListening ? '#ff6b6b' : '#f1f3f4' }}
            >
              <Mic size={24} />
            </motion.button>
            <motion.button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={inputText.trim() === ''}
              whileTap={{ scale: 0.9 }}
            >
              <Send size={24} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFinancialAssistant;