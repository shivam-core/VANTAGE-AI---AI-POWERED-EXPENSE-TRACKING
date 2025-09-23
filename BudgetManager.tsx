import React, { useState, useEffect } from 'react';
import { Target, Plus, Trash2, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { saveBudget, getBudgets, deleteBudget, getBudgetStatus } from '../lib/budgetManager';

interface Expense {
  id: string;
  amount: number;
  category: string;
  merchant: string;
  timestamp: Date;
}

interface BudgetManagerProps {
  expenses: Expense[];
}

export default function BudgetManager({ expenses }: BudgetManagerProps) {
  const [budgets, setBudgets] = useState(getBudgets());
  const [budgetStatus, setBudgetStatus] = useState(getBudgetStatus(expenses));
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: 'Food',
    amount: 0,
    period: 'monthly' as 'weekly' | 'monthly'
  });

  const categories = ['Food', 'Transportation', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare', 'Other'];

  useEffect(() => {
    setBudgetStatus(getBudgetStatus(expenses));
  }, [expenses, budgets]);

  const handleAddBudget = () => {
    if (newBudget.amount > 0) {
      const updatedBudgets = saveBudget(newBudget);
      setBudgets(updatedBudgets);
      setNewBudget({ category: 'Food', amount: 0, period: 'monthly' });
      setShowAddForm(false);
    }
  };

  const handleDeleteBudget = (category: string, period: 'weekly' | 'monthly') => {
    const updatedBudgets = deleteBudget(category, period);
    setBudgets(updatedBudgets);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exceeded': return 'text-red-600 bg-red-50 border-red-300';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-300';
      default: return 'text-green-600 bg-green-50 border-green-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'exceeded': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <TrendingUp className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white border-2 border-black rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6" />
          <h3 className="text-xl font-bold">💰 Budget Manager</h3>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-secondary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Budget
        </button>
      </div>

      {showAddForm && (
        <div className="bg-[#E5E4E2] border-2 border-black rounded-lg p-4 mb-6">
          <h4 className="font-bold mb-3">Create New Budget</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={newBudget.category}
                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                className="w-full border-2 border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                value={newBudget.amount || ''}
                onChange={(e) => setNewBudget({ ...newBudget, amount: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="w-full border-2 border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Period</label>
              <select
                value={newBudget.period}
                onChange={(e) => setNewBudget({ ...newBudget, period: e.target.value as 'weekly' | 'monthly' })}
                className="w-full border-2 border-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAddBudget}
              disabled={newBudget.amount <= 0}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Budget
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {budgetStatus.length === 0 ? (
        <div className="text-center py-8">
          <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h4 className="text-lg font-semibold mb-2">No budgets set</h4>
          <p className="text-gray-600 mb-4">Create your first budget to track spending limits and get alerts.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Create Your First Budget
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {budgetStatus.map((budget, index) => (
            <div key={index} className={`border-2 rounded-lg p-4 ${getStatusColor(budget.status)}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(budget.status)}
                  <span className="font-bold">{budget.category}</span>
                  <span className="text-sm opacity-75">({budget.period})</span>
                </div>
                <button
                  onClick={() => handleDeleteBudget(budget.category, budget.period)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Delete budget"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Spent: ${budget.spent.toFixed(2)}</span>
                  <span>Budget: ${budget.amount.toFixed(2)}</span>
                </div>
                <div className="w-full bg-white h-3 rounded-full border">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      budget.status === 'exceeded' ? 'bg-red-500' : 
                      budget.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${budget.percentage * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span>{Math.round(budget.percentage * 100)}% used</span>
                  <span>${budget.remaining.toFixed(2)} remaining</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}