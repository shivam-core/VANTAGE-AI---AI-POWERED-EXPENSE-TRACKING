interface Budget {
  category: string;
  amount: number;
  period: 'weekly' | 'monthly';
}

interface Expense {
  id: string;
  amount: number;
  category: string;
  merchant: string;
  timestamp: Date;
}

const BUDGETS_KEY = 'vantage-budgets';

export const saveBudget = (budget: Budget): Budget[] => {
  const budgets = getBudgets();
  const existingIndex = budgets.findIndex(b => b.category === budget.category && b.period === budget.period);
  
  if (existingIndex >= 0) {
    budgets[existingIndex] = budget;
  } else {
    budgets.push(budget);
  }
  
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  return budgets;
};

export const getBudgets = (): Budget[] => {
  try {
    const stored = localStorage.getItem(BUDGETS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading budgets:', error);
    return [];
  }
};

export const deleteBudget = (category: string, period: 'weekly' | 'monthly'): Budget[] => {
  const budgets = getBudgets();
  const filtered = budgets.filter(b => !(b.category === category && b.period === period));
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(filtered));
  return filtered;
};

export const checkBudgetAlert = (expense: Expense, expenses: Expense[]) => {
  const budgets = getBudgets();
  const categoryBudgets = budgets.filter(b => b.category === expense.category);
  
  for (const budget of categoryBudgets) {
    const periodExpenses = getPeriodExpenses(expenses, budget.period).filter(
      e => e.category === expense.category
    );
    
    const total = periodExpenses.reduce((sum, e) => sum + e.amount, 0);
    const percentage = total / budget.amount;
    
    if (percentage >= 1.0) {
      return {
        category: expense.category,
        message: `You've exceeded your ${budget.period} ${expense.category} budget!`,
        type: 'danger' as const,
        amount: total,
        budget: budget.amount
      };
    } else if (percentage >= 0.8) {
      return {
        category: expense.category,
        message: `You're approaching your ${budget.period} ${expense.category} budget limit (${Math.round(percentage * 100)}% used)`,
        type: 'warning' as const,
        amount: total,
        budget: budget.amount
      };
    }
  }
  
  return null;
};

const getPeriodExpenses = (expenses: Expense[], period: 'weekly' | 'monthly'): Expense[] => {
  const now = new Date();
  
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.timestamp);
    
    if (period === 'weekly') {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      return expenseDate >= weekStart;
    } else {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return expenseDate >= monthStart;
    }
  });
};

export const getBudgetStatus = (expenses: Expense[]) => {
  const budgets = getBudgets();
  
  return budgets.map(budget => {
    const periodExpenses = getPeriodExpenses(expenses, budget.period).filter(
      e => e.category === budget.category
    );
    
    const spent = periodExpenses.reduce((sum, e) => sum + e.amount, 0);
    const percentage = spent / budget.amount;
    
    return {
      ...budget,
      spent,
      remaining: Math.max(0, budget.amount - spent),
      percentage: Math.min(percentage, 1),
      status: percentage >= 1 ? 'exceeded' : percentage >= 0.8 ? 'warning' : 'good'
    };
  });
};