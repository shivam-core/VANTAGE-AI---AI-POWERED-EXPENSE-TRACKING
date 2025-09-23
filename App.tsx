import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import InputPanel from './components/InputPanel';
import ExpenseLog from './components/ExpenseLog';
import './App.css';

interface Expense {
  id: number;
  amount: number;
  merchant: string;
  category: string;
  date: string;
}

interface Totals {
  today: number;
  week: number;
  month: number;
}

function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('vantageExpenses');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Currency state
  const [selectedCurrency, setSelectedCurrency] = useState<string>(() => {
    const saved = localStorage.getItem('vantageCurrency');
    return saved || 'USD';
  });
  
  // Updated to include upload tab
  const [activeTab, setActiveTab] = useState<'voice' | 'text' | 'email' | 'upload'>('voice');

  // Currency symbols mapping
  const getCurrencySymbol = (currency: string): string => {
    const symbols: { [key: string]: string } = {
      'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CAD': 'C$', 'AUD': 'A$',
      'CHF': 'CHF', 'CNY': '¥', 'INR': '₹', 'KRW': '₩', 'BRL': 'R$', 'MXN': '$',
      'RUB': '₽', 'ZAR': 'R', 'SGD': 'S$', 'HKD': 'HK$', 'NOK': 'kr', 'SEK': 'kr',
      'DKK': 'kr', 'PLN': 'zł'
    };
    return symbols[currency] || currency;
  };

  // Update totals with improved date handling
  const calculateTotals = (): Totals => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      today: expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate >= today;
      }).reduce((sum, e) => sum + e.amount, 0),
      
      week: expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate >= weekStart;
      }).reduce((sum, e) => sum + e.amount, 0),
      
      month: expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate >= monthStart;
      }).reduce((sum, e) => sum + e.amount, 0)
    };
  };

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('vantageExpenses', JSON.stringify(expenses));
  }, [expenses]);

  // Save currency to localStorage
  useEffect(() => {
    localStorage.setItem('vantageCurrency', selectedCurrency);
  }, [selectedCurrency]);

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now() + Math.random(), // Ensure unique ID
      date: expense.date || new Date().toISOString(), // Use provided date or current
      merchant: expense.merchant || 'Unknown'
    };
    
    // Add to beginning for recent-first order
    setExpenses(prev => [newExpense, ...prev]);
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header 
        selectedCurrency={selectedCurrency}
        onCurrencyChange={handleCurrencyChange}
      />
      <Dashboard 
        totals={calculateTotals()} 
        currencySymbol={getCurrencySymbol(selectedCurrency)}
      />
      
      {/* Main Content Container - Single Column Layout */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Input Panel Section */}
        <div className="mb-8">
          <InputPanel 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onAddExpense={handleAddExpense}
            currencySymbol={getCurrencySymbol(selectedCurrency)}
          />
        </div>
        
        {/* Expense Log Section - BELOW Input Panel */}
        <div className="mb-12">
          <ExpenseLog 
            expenses={expenses} 
            currencySymbol={getCurrencySymbol(selectedCurrency)}
            onDeleteExpense={handleDeleteExpense}
          />
        </div>
      </div>
    </div>
  );
}

export default App;