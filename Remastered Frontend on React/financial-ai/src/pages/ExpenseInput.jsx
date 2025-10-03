import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ThemeToggle from '../components/ThemeToggle';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/ExpenseInput.css';

const ExpenseInput = () => {
  const animatedElements = useScrollAnimation(0.1);
  const [activeTab, setActiveTab] = useState('manual');
  const [manualEntry, setManualEntry] = useState({
    date: '',
    merchant: '',
    category: 'food',
    amount: '',
    type: 'expense' // 'expense' or 'income'
  });
  const [transactions, setTransactions] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Expense categories
  const expenseCategories = [
    { value: 'food', label: 'Food & Dining', icon: '🍽️' },
    { value: 'rent', label: 'Rent & Housing', icon: '🏠' },
    { value: 'transport', label: 'Transportation', icon: '🚗' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { value: 'utilities', label: 'Utilities', icon: '💡' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'health', label: 'Healthcare', icon: '⚕️' },
    { value: 'cash', label: 'Cash Withdrawal', icon: '💵' },
    { value: 'other', label: 'Other Expense', icon: '📦' }
  ];

  // Income categories
  const incomeCategories = [
    { value: 'salary', label: 'Salary', icon: '💼' },
    { value: 'freelance', label: 'Freelance', icon: '💻' },
    { value: 'investment', label: 'Investment', icon: '📈' },
    { value: 'gift', label: 'Gift', icon: '🎁' },
    { value: 'refund', label: 'Refund', icon: '💰' },
    { value: 'online', label: 'Online Deposit', icon: '💳' },
    { value: 'other', label: 'Other Income', icon: '📦' }
  ];

  const expenseData = [
    { name: 'Food', amount: 250 },
    { name: 'Rent', amount: 800 },
    { name: 'Transport', amount: 120 },
    { name: 'Entertainment', amount: 180 },
    { name: 'Utilities', amount: 150 },
    { name: 'Shopping', amount: 90 },
    { name: 'Health', amount: 75 },
    { name: 'Cash', amount: 200 },
    { name: 'Other', amount: 50 },
  ];
  
  const incomeData = [
    { name: 'Salary', amount: 3000 },
    { name: 'Freelance', amount: 800 },
    { name: 'Investment', amount: 200 },
    { name: 'Gift', amount: 100 },
    { name: 'Refund', amount: 75 },
    { name: 'Online', amount: 350 },
    { name: 'Other', amount: 150 },
  ];

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualEntry({
      ...manualEntry,
      [name]: value
    });
    
    // Update categories when type changes
    if (name === 'type') {
      setManualEntry(prev => ({
        ...prev,
        category: value === 'expense' ? 'food' : 'salary'
      }));
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualEntry.date && manualEntry.merchant && manualEntry.amount) {
      const newTransaction = {
        id: Date.now(),
        ...manualEntry,
        amount: parseFloat(manualEntry.amount)
      };
      
      setTransactions([newTransaction, ...transactions]);
      setManualEntry({
        date: '',
        merchant: '',
        category: manualEntry.type === 'expense' ? 'food' : 'salary',
        amount: '',
        type: manualEntry.type
      });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      
      // Simulate file processing
      setTimeout(() => {
        // Generate mock transactions from CSV
        const mockTransactions = [];
        for (let i = 0; i < 15; i++) {
          // Randomly decide if it's an expense or income (70% expenses, 30% income)
          const isExpense = Math.random() > 0.3;
          let category, merchant;
          
          if (isExpense) {
            const expenseCategories = ['food', 'rent', 'transport', 'entertainment', 'utilities', 'shopping', 'health', 'cash'];
            const expenseMerchants = ['Starbucks', 'Amazon', 'Uber', 'Netflix', 'Walmart', 'McDonalds', 'Shell', 'ATM Withdrawal'];
            category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
            merchant = expenseMerchants[Math.floor(Math.random() * expenseMerchants.length)];
          } else {
            const incomeCategories = ['salary', 'freelance', 'investment', 'gift', 'refund', 'online'];
            const incomeMerchants = ['Company Salary', 'Freelance Project', 'Stock Dividends', 'Birthday Gift', 'Tax Refund', 'Online Transfer'];
            category = incomeCategories[Math.floor(Math.random() * incomeCategories.length)];
            merchant = incomeMerchants[Math.floor(Math.random() * incomeMerchants.length)];
          }
          
          mockTransactions.push({
            id: Date.now() + i,
            date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            merchant: merchant,
            category: category,
            amount: parseFloat((Math.random() * 100).toFixed(2)),
            type: isExpense ? 'expense' : 'income'
          });
        }
        
        setTransactions([...mockTransactions, ...transactions]);
        setIsUploading(false);
      }, 2000);
    }
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

  return (
    <div className="expense-input">
      <ThemeToggle />
      
      <motion.div 
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        data-scroll-id="expense-header"
      >
        <h1>Track Your Transactions</h1>
        <p>Add, import, or manage your expenses and deposits</p>
      </motion.div>

      {/* Entry tabs */}
      <motion.div 
        className="entry-tabs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        data-scroll-id="expense-tabs"
      >
        <button 
          className={activeTab === 'manual' ? 'active' : ''}
          onClick={() => setActiveTab('manual')}
        >
          Manual Entry
        </button>
        <button 
          className={activeTab === 'csv' ? 'active' : ''}
          onClick={() => setActiveTab('csv')}
        >
          Upload CSV
        </button>
        <button 
          className={activeTab === 'bank' ? 'active' : ''}
          onClick={() => setActiveTab('bank')}
        >
          Bank Integration
        </button>
      </motion.div>

      {/* Entry forms */}
      <motion.div 
        className="entry-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        data-scroll-id="entry-content"
      >
        {activeTab === 'manual' && (
          <motion.div 
            className="manual-entry"
            variants={itemVariants}
            data-scroll-id="manual-entry"
          >
            <h2>Add New Transaction</h2>
            <form onSubmit={handleManualSubmit} className="entry-form">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={manualEntry.date}
                  onChange={handleManualChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Transaction Type</label>
                <div className="type-selector">
                  <button
                    type="button"
                    className={`type-option ${manualEntry.type === 'expense' ? 'selected' : ''}`}
                    onClick={() => setManualEntry({...manualEntry, type: 'expense', category: 'food'})}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    className={`type-option ${manualEntry.type === 'income' ? 'selected' : ''}`}
                    onClick={() => setManualEntry({...manualEntry, type: 'income', category: 'salary'})}
                  >
                    Income
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>Merchant / Description</label>
                <input
                  type="text"
                  name="merchant"
                  placeholder="Where did you spend? (e.g. Starbucks, ATM Withdrawal, Online Transfer)"
                  value={manualEntry.merchant}
                  onChange={handleManualChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <div className="category-selector">
                  {(manualEntry.type === 'expense' ? expenseCategories : incomeCategories).map((category) => (
                    <button
                      key={category.value}
                      type="button"
                      className={`category-option ${manualEntry.category === category.value ? 'selected' : ''}`}
                      onClick={() => setManualEntry({...manualEntry, category: category.value})}
                      data-category={category.value}
                    >
                      <span className="category-icon">{category.icon}</span>
                      <span className="category-label">{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Amount ($)</label>
                <input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={manualEntry.amount}
                  onChange={handleManualChange}
                  required
                />
              </div>
              
              <motion.button
                type="submit"
                className="submit-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add Transaction
              </motion.button>
            </form>
          </motion.div>
        )}

        {activeTab === 'csv' && (
          <motion.div 
            className="csv-upload"
            variants={itemVariants}
            data-scroll-id="csv-upload"
          >
            <h2>Upload CSV File</h2>
            <p>Import your transactions from a CSV file</p>
            
            <div className="upload-area">
              <div className="upload-icon">📁</div>
              <p>Drag & drop your CSV file here</p>
              <p className="upload-subtext">or</p>
              
              <label className="upload-btn">
                Browse Files
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }} 
                />
              </label>
              
              {isUploading && (
                <motion.div 
                  className="upload-progress"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <LoadingSpinner message="Processing your file..." />
                </motion.div>
              )}
            </div>
            
            <div className="csv-template">
              <h3>CSV Format</h3>
              <p>Your CSV should include these columns:</p>
              <div className="template-columns">
                <span className="column">Date</span>
                <span className="column">Merchant</span>
                <span className="column">Category</span>
                <span className="column">Amount</span>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'bank' && (
          <motion.div 
            className="bank-integration"
            variants={itemVariants}
            data-scroll-id="bank-integration"
          >
            <h2>Connect Your Bank</h2>
            <p>Securely connect your bank account to automatically import transactions</p>
            
            <div className="bank-list">
              <motion.div 
                className="bank-card"
                whileHover={{ y: -5 }}
                data-scroll-id="bank-card-1"
              >
                <div className="bank-icon">🏦</div>
                <h3>Chase Bank</h3>
                <button className="connect-btn">Connect</button>
              </motion.div>
              
              <motion.div 
                className="bank-card"
                whileHover={{ y: -5 }}
                data-scroll-id="bank-card-2"
              >
                <div className="bank-icon">🏦</div>
                <h3>Bank of America</h3>
                <button className="connect-btn">Connect</button>
              </motion.div>
              
              <motion.div 
                className="bank-card"
                whileHover={{ y: -5 }}
                data-scroll-id="bank-card-3"
              >
                <div className="bank-icon">🏦</div>
                <h3>Wells Fargo</h3>
                <button className="connect-btn">Connect</button>
              </motion.div>
              
              <motion.div 
                className="bank-card"
                whileHover={{ y: -5 }}
                data-scroll-id="bank-card-4"
              >
                <div className="bank-icon">🏦</div>
                <h3>Citi Bank</h3>
                <button className="connect-btn">Connect</button>
              </motion.div>
            </div>
            
            <div className="security-note">
              <div className="lock-icon">🔒</div>
              <p>We use bank-level encryption to protect your data. Your credentials are never stored.</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Animated data visualization */}
      <motion.div 
        className="data-visualization"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        data-scroll-id="data-visualization"
      >
        <h2>Financial Overview</h2>
        <div className="chart-tabs">
          <button 
            className="chart-tab active"
            onClick={() => console.log('Show expenses')}
          >
            Expenses
          </button>
          <button 
            className="chart-tab"
            onClick={() => console.log('Show income')}
          >
            Income
          </button>
        </div>
        <div className="chart-container" style={{ minHeight: '450px' }} data-scroll-id="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={expenseData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Amount']}
                labelFormatter={(name) => `Category: ${name}`}
                contentStyle={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-color)',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Bar dataKey="amount" fill="#FF6B6B" name="Amount">
                {expenseData.map((entry, index) => (
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

      {/* Recent transactions */}
      <motion.div 
        className="recent-transactions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        data-scroll-id="recent-transactions"
      >
        <h2>Recent Transactions</h2>
        {transactions.length > 0 ? (
          <div className="transactions-list">
            {transactions.map((transaction) => {
              const categories = transaction.type === 'expense' ? expenseCategories : incomeCategories;
              const category = categories.find(c => c.value === transaction.category);
              
              // Define colors for income categories
              const incomeColors = {
                salary: '#52c41a',
                freelance: '#722ed1',
                investment: '#fa8c16',
                gift: '#eb2f96',
                refund: '#1890ff',
                online: '#5C6BC0',
                other: '#667eea'
              };
              
              return (
                <motion.div 
                  key={transaction.id}
                  className="transaction-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ x: 10 }}
                  data-scroll-id={`transaction-${transaction.id}`}
                >
                  <div className="transaction-icon">
                    {category?.icon || '📦'}
                  </div>
                  <div className="transaction-details">
                    <div className="merchant">{transaction.merchant}</div>
                    <div className="date-category">
                      <div className="date">{transaction.date}</div>
                      <div 
                        className="category"
                        style={{ 
                          backgroundColor: transaction.type === 'expense' ? 
                            (category?.value === 'food' ? '#FF6B6B' : 
                             category?.value === 'rent' ? '#4ECDC4' : 
                             category?.value === 'transport' ? '#96CEB4' : 
                             category?.value === 'entertainment' ? '#45B7D1' : 
                             category?.value === 'utilities' ? '#FFEAA7' : 
                             category?.value === 'shopping' ? '#FF9F68' : 
                             category?.value === 'health' ? '#FF6B9D' : 
                             category?.value === 'cash' ? '#8D6E63' : 
                             category?.value === 'online' ? '#5C6BC0' : '#667eea') :
                            (incomeColors[category?.value] || '#667eea')
                        }}
                      >
                        {category?.label || 'Other'}
                        <span className="transaction-type-badge">
                          {transaction.type === 'expense' ? ' Expense' : ' Income'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="transaction-amount" style={{ 
                    color: transaction.type === 'expense' ? 'var(--text-color)' : '#52c41a',
                    fontWeight: 'bold'
                  }}>
                    {transaction.type === 'income' ? '+' : ''}${transaction.amount.toFixed(2)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="no-transactions">
            <div className="empty-icon">📋</div>
            <p>No transactions yet. Add your first transaction!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ExpenseInput;