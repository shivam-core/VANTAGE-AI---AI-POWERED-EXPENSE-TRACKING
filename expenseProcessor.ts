interface ProcessedExpense {
  amount: number;
  category: string;
  merchant: string;
  description?: string;
}

export function processExpenseText(input: string): ProcessedExpense {
  // This is a mock implementation. In production, this would integrate with Dappier AI
  const text = input.toLowerCase();
  
  // Extract amount using regex
  const amountMatch = text.match(/\$?(\d+(?:\.\d{2})?)/);
  const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
  
  // Extract merchant/location
  let merchant = 'Unknown';
  const atMatch = text.match(/at\s+([^,\s]+(?:\s+[^,\s]+)*)/i);
  const fromMatch = text.match(/from\s+([^,\s]+(?:\s+[^,\s]+)*)/i);
  
  if (atMatch) {
    merchant = atMatch[1].trim();
  } else if (fromMatch) {
    merchant = fromMatch[1].trim();
  } else {
    // Try to extract common merchant names
    const merchants = ['starbucks', 'mcdonalds', 'walmart', 'target', 'amazon', 'uber', 'lyft', 'shell', 'exxon'];
    for (const m of merchants) {
      if (text.includes(m)) {
        merchant = m.charAt(0).toUpperCase() + m.slice(1);
        break;
      }
    }
  }
  
  // Categorize based on keywords
  let category = 'Other';
  
  if (text.includes('coffee') || text.includes('lunch') || text.includes('dinner') || 
      text.includes('food') || text.includes('restaurant') || text.includes('starbucks') || 
      text.includes('mcdonalds')) {
    category = 'Food';
  } else if (text.includes('gas') || text.includes('fuel') || text.includes('uber') || 
             text.includes('lyft') || text.includes('taxi') || text.includes('transport')) {
    category = 'Transportation';
  } else if (text.includes('shopping') || text.includes('clothes') || text.includes('amazon') || 
             text.includes('target') || text.includes('walmart')) {
    category = 'Shopping';
  } else if (text.includes('movie') || text.includes('entertainment') || text.includes('game')) {
    category = 'Entertainment';
  } else if (text.includes('electric') || text.includes('water') || text.includes('internet') || 
             text.includes('phone') || text.includes('utility')) {
    category = 'Utilities';
  } else if (text.includes('doctor') || text.includes('hospital') || text.includes('pharmacy') || 
             text.includes('medical') || text.includes('health')) {
    category = 'Healthcare';
  }
  
  return {
    amount,
    category,
    merchant,
    description: input
  };
}

export function calculateTotals(expenses: Array<{ amount: number; timestamp: Date }>) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const todayTotal = expenses
    .filter(e => e.timestamp >= today)
    .reduce((sum, e) => sum + e.amount, 0);
  
  const weekTotal = expenses
    .filter(e => e.timestamp >= weekStart)
    .reduce((sum, e) => sum + e.amount, 0);
  
  const monthTotal = expenses
    .filter(e => e.timestamp >= monthStart)
    .reduce((sum, e) => sum + e.amount, 0);
  
  return {
    today: todayTotal,
    week: weekTotal,
    month: monthTotal
  };
}