import React from 'react';
import { Calendar, DollarSign, Tag, Trash2, Zap } from 'lucide-react';
import CyberCard from './CyberCard';
import { formatCurrency } from '../lib/currency';
import { useOnboarding } from '../contexts/OnboardingContext';

interface Expense {
  id: string;
  amount: number;
  category: string;
  merchant: string;
  timestamp: Date;
  description?: string;
  confidence?: number;
}

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export default function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  const { user } = useOnboarding();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (expenses.length === 0) {
    return (
      <CyberCard className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <DollarSign className="w-16 h-16 text-gray-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 font-mono text-gray-400">NO DATA DETECTED</h3>
            <p className="text-gray-500 font-mono text-sm">
              Initialize expense tracking via voice input or email inbox
            </p>
          </div>
        </div>
      </CyberCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="w-6 h-6 text-white" />
        <h2 className="text-2xl font-bold font-mono text-white">EXPENSE FEED</h2>
        <div className="h-px flex-1 bg-white"></div>
      </div>
      
      <div className="space-y-3">
        {expenses.map((expense, index) => (
          <div key={expense.id} className="expense-item group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl font-bold font-mono text-white">
                    {formatCurrency(expense.amount, user?.currency)}
                  </span>
                  <div className="px-3 py-1 border-2 border-white text-xs font-mono bg-black">
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span className="text-white">{expense.category}</span>
                    </div>
                  </div>
                  {expense.confidence && (
                    <div className="flex items-center gap-1 text-xs font-mono text-white">
                      <Zap className="w-3 h-3" />
                      <span>{Math.round(expense.confidence * 100)}%</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-6 text-sm text-gray-400 font-mono">
                  <span className="font-medium text-white">{expense.merchant}</span>
                  <span>{formatDate(expense.timestamp)}</span>
                </div>
                
                {expense.description && (
                  <p className="text-sm text-gray-500 mt-2 font-mono">{expense.description}</p>
                )}
              </div>
              
              <button
                onClick={() => onDeleteExpense(expense.id)}
                className="p-3 text-white hover:bg-white hover:text-black transition-all duration-200 opacity-0 group-hover:opacity-100 border-2 border-transparent hover:border-white"
                title="Delete expense"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}