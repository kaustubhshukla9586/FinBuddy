import { useState, useEffect } from 'react';

// This hook will be updated when you provide your database
// For now, it uses mock data that simulates database values
const useFinancialData = () => {
  const [financialData, setFinancialData] = useState({
    goals: [],
    expenses: [],
    income: [],
    savings: 0,
    loading: true,
    error: null
  });

  // In a real implementation, this would fetch from your database
  const fetchFinancialData = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data - replace with actual database queries
      const mockGoals = [
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
          current: 300,
          category: 'technology',
          deadline: '2024-06-30',
          streak: 3
        }
      ];
      
      const mockExpenses = [
        { id: 1, amount: 1200, category: 'Rent', date: '2024-01-01' },
        { id: 2, amount: 450, category: 'Food', date: '2024-01-02' },
        { id: 3, amount: 180, category: 'Transport', date: '2024-01-03' },
        { id: 4, amount: 300, category: 'Entertainment', date: '2024-01-04' },
        { id: 5, amount: 150, category: 'Utilities', date: '2024-01-05' },
        { id: 6, amount: 85, category: 'Food', date: '2024-01-06' },
        { id: 7, amount: 200, category: 'Shopping', date: '2024-01-07' }
      ];
      
      const mockIncome = [
        { id: 1, amount: 4000, source: 'Salary', date: '2024-01-01' },
        { id: 2, amount: 200, source: 'Freelance', date: '2024-01-15' }
      ];
      
      const totalSavings = mockGoals.reduce((sum, goal) => sum + goal.current, 0);
      
      setFinancialData({
        goals: mockGoals,
        expenses: mockExpenses,
        income: mockIncome,
        savings: totalSavings,
        loading: false,
        error: null
      });
    } catch (error) {
      setFinancialData({
        goals: [],
        expenses: [],
        income: [],
        savings: 0,
        loading: false,
        error: 'Failed to fetch financial data'
      });
    }
  };

  // Function to add a new goal
  const addGoal = async (goalData) => {
    try {
      // In a real implementation, this would make an API call to your database
      const newGoal = {
        id: Date.now(), // In real implementation, database would generate ID
        ...goalData,
        current: goalData.current || 0,
        streak: goalData.streak || 0
      };
      
      setFinancialData(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal]
      }));
      
      return { success: true, goal: newGoal };
    } catch (error) {
      return { success: false, error: 'Failed to add goal' };
    }
  };

  // Function to update goal progress
  const updateGoalProgress = async (goalId, amount) => {
    try {
      setFinancialData(prev => ({
        ...prev,
        goals: prev.goals.map(goal => {
          if (goal.id === goalId) {
            const newCurrent = Math.min(goal.current + amount, goal.target);
            const newStreak = goal.streak + 1;
            return {
              ...goal,
              current: newCurrent,
              streak: newStreak
            };
          }
          return goal;
        })
      }));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update goal' };
    }
  };

  // Function to add an expense
  const addExpense = async (expenseData) => {
    try {
      const newExpense = {
        id: Date.now(),
        ...expenseData
      };
      
      setFinancialData(prev => ({
        ...prev,
        expenses: [...prev.expenses, newExpense]
      }));
      
      return { success: true, expense: newExpense };
    } catch (error) {
      return { success: false, error: 'Failed to add expense' };
    }
  };

  // Function to add income
  const addIncome = async (incomeData) => {
    try {
      const newIncome = {
        id: Date.now(),
        ...incomeData
      };
      
      setFinancialData(prev => ({
        ...prev,
        income: [...prev.income, newIncome]
      }));
      
      return { success: true, income: newIncome };
    } catch (error) {
      return { success: false, error: 'Failed to add income' };
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  return {
    ...financialData,
    addGoal,
    updateGoalProgress,
    addExpense,
    addIncome,
    refreshData: fetchFinancialData
  };
};

export default useFinancialData;