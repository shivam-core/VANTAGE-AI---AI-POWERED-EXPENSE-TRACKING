import React from 'react';
import { Receipt, Clock } from 'lucide-react';

interface Expense {
  id: number;
  amount: number;
  merchant: string;
  category: string;
  date: string;
}

interface ExpenseLogProps {
  expenses: Expense[];
  currencySymbol: string;
  onDeleteExpense?: (id: number) => void;
}

interface ExpenseRowProps {
  expense: Expense;
  currencySymbol: string;
}

function ExpenseRow({ expense, currencySymbol }: ExpenseRowProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="grid grid-cols-12 px-4 py-3 hover:bg-gray-850 transition-colors">
      <div className="col-span-3 font-medium flex items-center">
        <span className="text-white mr-1">{currencySymbol}</span>
        <span className="text-white">{expense.amount.toFixed(2)}</span>
      </div>
      
      <div className="col-span-4 text-sm text-gray-400 font-mono">
        {formatDateTime(expense.date)}
      </div>
      
      <div className="col-span-5">
        <div className="flex items-center">
          <span className="truncate text-white">{expense.merchant}</span>
        </div>
      </div>
    </div>
  );
}

export default function ExpenseLog({ expenses, currencySymbol }: ExpenseLogProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Receipt className="w-6 h-6 text-white" />
          <h2 className="text-xl font-mono tracking-wide text-white uppercase">Expense Log</h2>
        </div>
        {expenses.length > 0 && (
          <div className="text-gray-400 font-mono text-sm">
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      
      {/* Main Expense Table */}
      <div className="bg-black border-2 border-white rounded-none overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-black px-4 py-3 border-b-2 border-white">
          <div className="col-span-3 text-gray-400 text-sm font-mono uppercase tracking-wider">Amount</div>
          <div className="col-span-4 text-gray-400 text-sm font-mono uppercase tracking-wider">Date / Time</div>
          <div className="col-span-5 text-gray-400 text-sm font-mono uppercase tracking-wider">Merchant/Particulars</div>
        </div>
        
        {/* Table Body */}
        <div className="bg-black max-h-[400px] overflow-y-auto divide-y divide-gray-800">
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <ExpenseRow 
                key={expense.id} 
                expense={expense} 
                currencySymbol={currencySymbol}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-2 border-gray-600 rounded-none flex items-center justify-center mx-auto mb-4">
                <Receipt className="h-8 w-8 text-gray-600" />
              </div>
              <p className="text-gray-400 font-mono text-sm uppercase tracking-wider">
                No expenses recorded yet
              </p>
              <p className="text-gray-600 font-mono text-xs mt-2">
                Add your first expense using voice, text, email, or upload
              </p>
            </div>
          )}
        </div>
        
        {/* Simple Footer */}
        {expenses.length > 0 && (
          <div className="bg-black px-4 py-2 text-xs text-gray-500 border-t-2 border-white font-mono">
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}