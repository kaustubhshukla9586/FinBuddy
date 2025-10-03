# Database Integration Guide for AI Financial Assistant

This guide explains how to integrate your database with the AI Financial Assistant component.

## Current Implementation

The AI Financial Assistant currently uses mock data through the `useFinancialData` hook. When you provide your database, you'll need to update this hook to connect to your actual data sources.

## Database Structure Recommendations

Based on the current implementation, your database should include the following collections/tables:

### 1. Goals Table
```sql
CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    target DECIMAL(10, 2) NOT NULL,
    current DECIMAL(10, 2) DEFAULT 0,
    category VARCHAR(100),
    deadline DATE,
    streak INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Expenses Table
```sql
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Income Table
```sql
CREATE TABLE income (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    source VARCHAR(255),
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Updating the useFinancialData Hook

When you're ready to connect your database, update the `src/hooks/useFinancialData.js` file with your actual database queries:

### 1. Update the fetchFinancialData function:
```javascript
const fetchFinancialData = async () => {
  try {
    // Replace with your actual database queries
    const goals = await fetch('/api/goals').then(res => res.json());
    const expenses = await fetch('/api/expenses').then(res => res.json());
    const income = await fetch('/api/income').then(res => res.json());
    
    const totalSavings = goals.reduce((sum, goal) => sum + goal.current, 0);
    
    setFinancialData({
      goals,
      expenses,
      income,
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
```

### 2. Update the addGoal function:
```javascript
const addGoal = async (goalData) => {
  try {
    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goalData),
    });
    
    const newGoal = await response.json();
    
    setFinancialData(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }));
    
    return { success: true, goal: newGoal };
  } catch (error) {
    return { success: false, error: 'Failed to add goal' };
  }
};
```

### 3. Update the updateGoalProgress function:
```javascript
const updateGoalProgress = async (goalId, amount) => {
  try {
    const response = await fetch(`/api/goals/${goalId}/progress`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });
    
    const updatedGoal = await response.json();
    
    setFinancialData(prev => ({
      ...prev,
      goals: prev.goals.map(goal => 
        goal.id === goalId ? updatedGoal : goal
      )
    }));
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update goal' };
  }
};
```

## API Endpoint Examples

### Get all financial data:
```
GET /api/financial-data
Response:
{
  "goals": [...],
  "expenses": [...],
  "income": [...]
}
```

### Add a new goal:
```
POST /api/goals
Body:
{
  "title": "Emergency Fund",
  "target": 5000,
  "category": "savings",
  "deadline": "2024-12-31"
}
```

### Update goal progress:
```
PATCH /api/goals/1/progress
Body:
{
  "amount": 100
}
```

### Add an expense:
```
POST /api/expenses
Body:
{
  "amount": 45.50,
  "category": "Food",
  "description": "Grocery shopping",
  "date": "2024-01-15"
}
```

### Add income:
```
POST /api/income
Body:
{
  "amount": 2500,
  "source": "Salary",
  "description": "January salary",
  "date": "2024-01-01"
}
```

## AI Optimization

The AI Financial Assistant analyzes the following data points to provide recommendations:

1. **Spending Patterns**: Categorizes expenses and identifies high-spending areas
2. **Savings Rate**: Calculates the percentage of income saved
3. **Goal Progress**: Tracks progress toward financial goals
4. **Income vs Expenses**: Compares monthly income to expenses
5. **Streaks**: Monitors consistent saving behaviors

When integrating your database, ensure these data points are available for the AI to analyze.

## Security Considerations

1. **Authentication**: Implement proper authentication for API endpoints
2. **Data Encryption**: Encrypt sensitive financial data
3. **Access Control**: Ensure users can only access their own data
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Audit Logs**: Log financial transactions for security monitoring

## Performance Optimization

1. **Caching**: Cache frequently accessed data
2. **Pagination**: Implement pagination for large datasets
3. **Indexing**: Create database indexes for frequently queried fields
4. **Connection Pooling**: Use connection pooling for database connections
5. **Data Archiving**: Archive old data to improve query performance

## Next Steps

1. Replace mock data in `useFinancialData.js` with actual database queries
2. Implement API endpoints for your backend
3. Add authentication and authorization
4. Test with sample data
5. Optimize queries for performance