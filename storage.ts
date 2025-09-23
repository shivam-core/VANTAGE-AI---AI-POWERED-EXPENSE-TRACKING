interface Expense {
  id: string;
  amount: number;
  category: string;
  merchant: string;
  timestamp: Date;
  rawInput: string;
  confidence: number;
  description?: string;
}

const STORAGE_KEY = 'vantage-expenses';

export const saveExpense = (expense: Omit<Expense, 'id'>): Expense[] => {
  const expenses = getExpenses();
  const newExpense: Expense = {
    ...expense,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
  };
  
  expenses.unshift(newExpense); // Add to beginning for recent-first order
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  
  return expenses;
};

export const getExpenses = (): Expense[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((expense: any) => ({
      ...expense,
      timestamp: new Date(expense.timestamp)
    }));
  } catch (error) {
    console.error('Error loading expenses:', error);
    return [];
  }
};

export const deleteExpense = (id: string): Expense[] => {
  const expenses = getExpenses();
  const filtered = expenses.filter(expense => expense.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
};

export const getTimeframeExpenses = (timeframe: 'today' | 'week' | 'month', expenses?: Expense[]): Expense[] => {
  const allExpenses = expenses || getExpenses();
  const now = new Date();
  
  return allExpenses.filter(expense => {
    const expenseDate = new Date(expense.timestamp);
    
    switch (timeframe) {
      case 'today':
        return expenseDate.toDateString() === now.toDateString();
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
        weekStart.setHours(0, 0, 0, 0);
        return expenseDate >= weekStart;
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return expenseDate >= monthStart;
      default:
        return true;
    }
  });
};

export const calculateTotals = (expenses: Expense[]) => {
  return {
    today: calculateTotal(getTimeframeExpenses('today', expenses)),
    week: calculateTotal(getTimeframeExpenses('week', expenses)),
    month: calculateTotal(getTimeframeExpenses('month', expenses))
  };
};

const calculateTotal = (expenses: Expense[]): number => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

export const getExpenseStats = (expenses: Expense[]) => {
  const categories = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const merchants = expenses.reduce((acc, expense) => {
    acc[expense.merchant] = (acc[expense.merchant] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
  
  return { categories, merchants };
};