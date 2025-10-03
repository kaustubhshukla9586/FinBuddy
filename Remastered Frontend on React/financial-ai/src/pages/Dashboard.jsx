import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from 'recharts';
import ThemeToggle from '../components/ThemeToggle';
import Insights from '../components/Insights';
import ExportButton from '../components/ExportButton';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { theme } = useTheme();
  const animatedElements = useScrollAnimation(0.1);
  const [timeframe, setTimeframe] = useState('monthly');
  const [activeCategories, setActiveCategories] = useState(['food', 'rent', 'entertainment', 'transport', 'utilities']);
  const [activeCategoryType, setActiveCategoryType] = useState('expense'); // 'expense' or 'income'
  const [transactions, setTransactions] = useState([]);

  // Mock data for expense charts with theme-aware colors
  const expenseData = [
    { name: 'Mon', food: 40, rent: 0, entertainment: 20, transport: 15, utilities: 30, cash: 50, other: 20 },
    { name: 'Tue', food: 30, rent: 0, entertainment: 25, transport: 10, utilities: 30, cash: 40, other: 15 },
    { name: 'Wed', food: 20, rent: 0, entertainment: 15, transport: 20, utilities: 30, cash: 30, other: 25 },
    { name: 'Thu', food: 25, rent: 0, entertainment: 30, transport: 15, utilities: 30, cash: 35, other: 20 },
    { name: 'Fri', food: 45, rent: 0, entertainment: 50, transport: 25, utilities: 30, cash: 60, other: 40 },
    { name: 'Sat', food: 60, rent: 0, entertainment: 80, transport: 20, utilities: 30, cash: 80, other: 60 },
    { name: 'Sun', food: 50, rent: 0, entertainment: 40, transport: 30, utilities: 30, cash: 70, other: 50 },
  ];
  
  // Mock data for income charts
  const incomeData = [
    { name: 'Mon', salary: 200, freelance: 0, investment: 10, gift: 0, refund: 0, online: 50, other: 10 },
    { name: 'Tue', salary: 200, freelance: 50, investment: 0, gift: 0, refund: 0, online: 30, other: 5 },
    { name: 'Wed', salary: 200, freelance: 0, investment: 20, gift: 0, refund: 0, online: 40, other: 15 },
    { name: 'Thu', salary: 200, freelance: 30, investment: 0, gift: 0, refund: 10, online: 35, other: 10 },
    { name: 'Fri', salary: 200, freelance: 0, investment: 15, gift: 0, refund: 0, online: 60, other: 20 },
    { name: 'Sat', salary: 200, freelance: 100, investment: 0, gift: 20, refund: 0, online: 75, other: 25 },
    { name: 'Sun', salary: 200, freelance: 0, investment: 30, gift: 0, refund: 0, online: 55, other: 20 },
  ];

  // Theme-aware category colors for expenses
  const getExpenseColors = () => {
    switch(theme) {
      case 'dark':
        return {
          food: '#bb86fc',
          rent: '#03dac6',
          entertainment: '#cf6679',
          transport: '#667eea',
          utilities: '#ffd166',
          cash: '#8D6E63',
          other: '#667eea'
        };
      case 'vibrant':
        return {
          food: '#ffd166',
          rent: '#06d6a0',
          entertainment: '#118ab2',
          transport: '#073b4c',
          utilities: '#ef476f',
          cash: '#8D6E63',
          other: '#667eea'
        };
      case 'neon':
        return {
          food: '#00ffcc',
          rent: '#ff00ff',
          entertainment: '#00ffff',
          transport: '#ff00aa',
          utilities: '#ffff00',
          cash: '#8D6E63',
          other: '#667eea'
        };
      case 'ocean':
        return {
          food: '#1890ff',
          rent: '#52c41a',
          entertainment: '#fa8c16',
          transport: '#722ed1',
          utilities: '#f5222d',
          cash: '#8D6E63',
          other: '#667eea'
        };
      case 'sunset':
        return {
          food: '#fa8c16',
          rent: '#f5222d',
          entertainment: '#faad14',
          transport: '#1890ff',
          utilities: '#52c41a',
          cash: '#8D6E63',
          other: '#667eea'
        };
      default: // minimal
        return {
          food: '#FF6B6B',
          rent: '#4ECDC4',
          entertainment: '#45B7D1',
          transport: '#96CEB4',
          utilities: '#FFEAA7',
          cash: '#8D6E63',
          other: '#667eea'
        };
    }
  };
  
  // Theme-aware category colors for income
  const getIncomeColors = () => {
    switch(theme) {
      case 'dark':
        return {
          salary: '#03dac6',
          freelance: '#667eea',
          investment: '#ffd166',
          gift: '#cf6679',
          refund: '#bb86fc',
          online: '#5C6BC0',
          other: '#667eea'
        };
      case 'vibrant':
        return {
          salary: '#06d6a0',
          freelance: '#073b4c',
          investment: '#ef476f',
          gift: '#118ab2',
          refund: '#ffd166',
          online: '#5C6BC0',
          other: '#667eea'
        };
      case 'neon':
        return {
          salary: '#00ffcc',
          freelance: '#ff00aa',
          investment: '#ffff00',
          gift: '#00ffff',
          refund: '#ff00ff',
          online: '#5C6BC0',
          other: '#667eea'
        };
      case 'ocean':
        return {
          salary: '#52c41a',
          freelance: '#722ed1',
          investment: '#f5222d',
          gift: '#fa8c16',
          refund: '#1890ff',
          online: '#5C6BC0',
          other: '#667eea'
        };
      case 'sunset':
        return {
          salary: '#52c41a',
          freelance: '#1890ff',
          investment: '#f5222d',
          gift: '#faad14',
          refund: '#fa8c16',
          online: '#5C6BC0',
          other: '#667eea'
        };
      default: // minimal
        return {
          salary: '#52c41a',
          freelance: '#722ed1',
          investment: '#fa8c16',
          gift: '#eb2f96',
          refund: '#1890ff',
          online: '#5C6BC0',
          other: '#667eea'
        };
    }
  };

  const expenseCategoryData = [
    { name: 'Food', value: 250, color: getExpenseColors().food },
    { name: 'Rent', value: 800, color: getExpenseColors().rent },
    { name: 'Entertainment', value: 180, color: getExpenseColors().entertainment },
    { name: 'Transport', value: 120, color: getExpenseColors().transport },
    { name: 'Utilities', value: 150, color: getExpenseColors().utilities },
    { name: 'Cash', value: 200, color: getExpenseColors().cash },
    { name: 'Other', value: 50, color: getExpenseColors().other },
  ];
  
  const incomeCategoryData = [
    { name: 'Salary', value: 3000, color: getIncomeColors().salary },
    { name: 'Freelance', value: 800, color: getIncomeColors().freelance },
    { name: 'Investment', value: 200, color: getIncomeColors().investment },
    { name: 'Gift', value: 100, color: getIncomeColors().gift },
    { name: 'Refund', value: 75, color: getIncomeColors().refund },
    { name: 'Online', value: 350, color: getIncomeColors().online },
    { name: 'Other', value: 150, color: getIncomeColors().other },
  ];

  // Generate heatmap data based on active category type
  const generateHeatmapData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = ['09:00', '12:00', '18:00'];
    const data = [];
    
    days.forEach(day => {
      hours.forEach(hour => {
        // Generate different values for expenses vs income
        const baseValue = activeCategoryType === 'expense' ? 
          20 + Math.floor(Math.random() * 80) : 
          50 + Math.floor(Math.random() * 150);
        data.push({ day, hour, value: baseValue });
      });
    });
    
    return data;
  };
  
  const heatmapData = generateHeatmapData();

  // Generate mock transactions
  useEffect(() => {
    const mockTransactions = [];
    
    // Expense categories and merchants
    const expenseCategories = ['Food', 'Rent', 'Entertainment', 'Transport', 'Utilities', 'Cash', 'Other'];
    const expenseMerchants = ['Starbucks', 'Amazon', 'Uber', 'Netflix', 'Walmart', 'McDonalds', 'Shell', 'ATM Withdrawal'];
    
    // Income categories and merchants
    const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Refund', 'Online', 'Other'];
    const incomeMerchants = ['Company Salary', 'Freelance Project', 'Stock Dividends', 'Birthday Gift', 'Tax Refund', 'Online Transfer', 'Side Income'];
    
    for (let i = 0; i < 20; i++) {
      // Randomly decide if it's an expense or income (70% expenses, 30% income)
      const isExpense = Math.random() > 0.3;
      
      let randomCategory, randomMerchant;
      
      if (isExpense) {
        randomCategory = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
        randomMerchant = expenseMerchants[Math.floor(Math.random() * expenseMerchants.length)];
      } else {
        randomCategory = incomeCategories[Math.floor(Math.random() * incomeCategories.length)];
        randomMerchant = incomeMerchants[Math.floor(Math.random() * incomeMerchants.length)];
      }
      
      const amount = (Math.random() * 100).toFixed(2);
      const date = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
      
      mockTransactions.push({
        id: i + 1,
        date: date.toISOString().split('T')[0],
        merchant: randomMerchant,
        category: randomCategory,
        amount: parseFloat(amount),
        type: isExpense ? 'expense' : 'income'
      });
    }
    
    setTransactions(mockTransactions);
  }, []);

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
        delay: 0.1
      }
    }
  };

  // Special variants for charts to have staggered animations
  const chartVariants = {
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

  const toggleCategory = (category) => {
    if (activeCategories.includes(category)) {
      setActiveCategories(activeCategories.filter(c => c !== category));
    } else {
      setActiveCategories([...activeCategories, category]);
    }
  };
  
  // Reset active categories when switching between expense and income
  useEffect(() => {
    if (activeCategoryType === 'expense') {
      setActiveCategories(['food', 'rent', 'entertainment', 'transport', 'utilities']);
    } else {
      setActiveCategories(['salary', 'freelance', 'investment']);
    }
  }, [activeCategoryType]);

  // Handle export functionality
  const handleExport = (chartType) => {
    const chartTypeWithCategory = `${activeCategoryType === 'expense' ? 'Expense' : 'Income'} ${chartType}`;
    console.log(`Exporting ${chartTypeWithCategory} chart...`);
    // In a real app, this would export the chart as an image or PDF
    alert(`${chartTypeWithCategory} chart exported successfully!`);
  };

  // Handle share functionality
  const handleShare = (chartType) => {
    const chartTypeWithCategory = `${activeCategoryType === 'expense' ? 'Expense' : 'Income'} ${chartType}`;
    console.log(`Sharing ${chartTypeWithCategory} chart...`);
    // In a real app, this would open a share dialog
    alert(`${chartTypeWithCategory} chart shared successfully!`);
  };

  // Get theme-specific gradient for charts
  const getChartGradient = () => {
    switch(theme) {
      case 'dark':
        return 'linear-gradient(135deg, #1e1e1e 0%, #121212 100%)';
      case 'vibrant':
        return 'linear-gradient(135deg, #ff8e8e 0%, #ff6b6b 100%)';
      case 'neon':
        return 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)';
      case 'ocean':
        return 'linear-gradient(135deg, #ffffff 0%, #e6f7ff 100%)';
      case 'sunset':
        return 'linear-gradient(135deg, #ffffff 0%, #fff5e6 100%)';
      default:
        return 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)';
    }
  };

  return (
    <div className="dashboard">
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        data-scroll-id="dashboard-header"
      >
        <h1>Financial Dashboard</h1>
        <p>Track your expenses and income</p>
      </motion.div>

      {/* Insights section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        data-scroll-id="insights"
      >
        <Insights />
      </motion.div>

      {/* Sticky filters */}
      <motion.div 
        className="filters"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        data-scroll-id="filters"
      >
        <div className="timeframe-selector">
          <button 
            className={timeframe === 'weekly' ? 'active' : ''}
            onClick={() => setTimeframe('weekly')}
          >
            Weekly
          </button>
          <button 
            className={timeframe === 'monthly' ? 'active' : ''}
            onClick={() => setTimeframe('monthly')}
          >
            Monthly
          </button>
          <button 
            className={timeframe === 'yearly' ? 'active' : ''}
            onClick={() => setTimeframe('yearly')}
          >
            Yearly
          </button>
        </div>
        
        <div className="category-filter-tabs">
          <button 
            className={`filter-tab ${activeCategoryType === 'expense' ? 'active' : ''}`}
            onClick={() => setActiveCategoryType('expense')}
          >
            Expenses
          </button>
          <button 
            className={`filter-tab ${activeCategoryType === 'income' ? 'active' : ''}`}
            onClick={() => setActiveCategoryType('income')}
          >
            Income
          </button>
        </div>
        
        <div className="category-toggles">
          {(activeCategoryType === 'expense' ? expenseCategoryData : incomeCategoryData).map((category) => (
            <button
              key={category.name}
              className={`category-toggle ${activeCategories.includes(category.name.toLowerCase()) ? 'active' : ''}`}
              onClick={() => toggleCategory(category.name.toLowerCase())}
              style={{ 
                backgroundColor: activeCategories.includes(category.name.toLowerCase()) 
                  ? category.color 
                  : 'transparent',
                borderColor: category.color,
                color: activeCategories.includes(category.name.toLowerCase()) ? 'white' : category.color
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Charts section */}
      <div 
        className="charts-section"
        data-scroll-id="charts-section"
      >
        {/* Spending by category chart */}
        <motion.div 
          className="chart-container"
          variants={chartVariants}
          initial="hidden"
          animate={animatedElements.has('chart-1') ? "visible" : "hidden"}
          data-scroll-id="chart-1"
          data-scroll-delay="0"
        >
          <div className="chart-header">
            <h2>{activeCategoryType === 'expense' ? 'Expenses' : 'Income'} by Category</h2>
            <ExportButton 
              onExport={() => handleExport('Pie Chart')} 
              onShare={() => handleShare('Pie Chart')}
              type="chart"
            />
          </div>
          <div className="chart-wrapper" style={{ minHeight: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activeCategoryType === 'expense' ? expenseCategoryData : incomeCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={'80%'}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(activeCategoryType === 'expense' ? expenseCategoryData : incomeCategoryData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Amount']} 
                  contentStyle={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-color)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Spending over time chart */}
        <motion.div 
          className="chart-container"
          variants={chartVariants}
          initial="hidden"
          animate={animatedElements.has('chart-2') ? "visible" : "hidden"}
          data-scroll-id="chart-2"
          data-scroll-delay="100"
        >
          <div className="chart-header">
            <h2>{activeCategoryType === 'expense' ? 'Expenses' : 'Income'} Over Time</h2>
            <ExportButton 
              onExport={() => handleExport('Bar Chart')} 
              onShare={() => handleShare('Bar Chart')}
              type="chart"
            />
          </div>
          <div className="chart-wrapper" style={{ minHeight: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activeCategoryType === 'expense' ? expenseData : incomeData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-color)" />
                <YAxis stroke="var(--text-color)" />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Amount']} 
                  contentStyle={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-color)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Legend />
                {activeCategoryType === 'expense' ? (
                  <>
                    <Bar dataKey="food" fill={getExpenseColors().food} name="Food" />
                    <Bar dataKey="rent" fill={getExpenseColors().rent} name="Rent" />
                    <Bar dataKey="entertainment" fill={getExpenseColors().entertainment} name="Entertainment" />
                    <Bar dataKey="transport" fill={getExpenseColors().transport} name="Transport" />
                    <Bar dataKey="utilities" fill={getExpenseColors().utilities} name="Utilities" />
                    <Bar dataKey="cash" fill={getExpenseColors().cash} name="Cash" />
                    <Bar dataKey="other" fill={getExpenseColors().other} name="Other" />
                  </>
                ) : (
                  <>
                    <Bar dataKey="salary" fill={getIncomeColors().salary} name="Salary" />
                    <Bar dataKey="freelance" fill={getIncomeColors().freelance} name="Freelance" />
                    <Bar dataKey="investment" fill={getIncomeColors().investment} name="Investment" />
                    <Bar dataKey="gift" fill={getIncomeColors().gift} name="Gift" />
                    <Bar dataKey="refund" fill={getIncomeColors().refund} name="Refund" />
                    <Bar dataKey="online" fill={getIncomeColors().online} name="Online" />
                    <Bar dataKey="other" fill={getIncomeColors().other} name="Other" />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Heatmap */}
        <motion.div 
          className="chart-container"
          variants={chartVariants}
          initial="hidden"
          animate={animatedElements.has('chart-3') ? "visible" : "hidden"}
          data-scroll-id="chart-3"
          data-scroll-delay="200"
        >
          <div className="chart-header">
            <h2>{activeCategoryType === 'expense' ? 'Expenses' : 'Income'} Heatmap</h2>
            <ExportButton 
              onExport={() => handleExport('Heatmap')} 
              onShare={() => handleShare('Heatmap')}
              type="chart"
            />
          </div>
          <div className="heatmap-container" style={{ minHeight: '400px' }}>
            <div className="heatmap-labels">
              <div></div>
              {['09:00', '12:00', '18:00'].map(time => (
                <div key={time} className="time-label">{time}</div>
              ))}
            </div>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="heatmap-row">
                <div className="day-label">{day}</div>
                {generateHeatmapData()
                  .filter(d => d.day === day)
                  .map((d, i) => {
                    // Use appropriate color based on active category type
                    const baseColor = activeCategoryType === 'expense' ? 
                      getExpenseColors().food : 
                      getIncomeColors().salary;
                    
                    return (
                      <motion.div
                        key={i}
                        className="heatmap-cell"
                        style={{ 
                          backgroundColor: `rgba(${parseInt(baseColor.slice(1, 3), 16)}, ${parseInt(baseColor.slice(3, 5), 16)}, ${parseInt(baseColor.slice(5, 7), 16)}, ${d.value / 100})` 
                        }}
                        whileHover={{ scale: 1.05 }}
                        title={`${activeCategoryType === 'expense' ? 'Expense' : 'Income'}: $${d.value} on ${d.day} at ${d.hour}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          duration: 0.3,
                          delay: i * 0.05 // Staggered animation for heatmap cells
                        }}
                      >
                        {d.value > 40 ? `$${d.value}` : ''}
                      </motion.div>
                    );
                  })
                }
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent transactions */}
      <motion.div 
        className="transactions-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        data-scroll-id="transactions"
      >
        <h2>Recent Transactions</h2>
        <div className="transactions-table">
          <div className="table-header">
            <div>Date</div>
            <div>Merchant</div>
            <div>Category</div>
            <div>Amount</div>
          </div>
          {transactions.map((transaction) => {
            // Determine which category data to use based on transaction type
            const currentCategoryData = transaction.type === 'expense' ? expenseCategoryData : incomeCategoryData;
            const currentColors = transaction.type === 'expense' ? getExpenseColors() : getIncomeColors();
            
            return (
              <motion.div 
                key={transaction.id}
                className="transaction-row"
                whileHover={{ backgroundColor: 'var(--hover-color)' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>{transaction.date}</div>
                <div>{transaction.merchant}</div>
                <div>
                  <span className="category-badge" style={{
                    backgroundColor: currentCategoryData.find(c => c.name === transaction.category)?.color || '#ccc'
                  }}>
                    {transaction.category}
                    <span className="transaction-type-indicator">
                      {transaction.type === 'expense' ? ' (E)' : ' (I)'}
                    </span>
                  </span>
                </div>
                <div className="amount" style={{ 
                  color: transaction.type === 'income' ? '#52c41a' : 'var(--text-color)',
                  fontWeight: transaction.type === 'income' ? 'bold' : 'normal'
                }}>
                  {transaction.type === 'income' ? '+' : ''}${transaction.amount}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;