import React, { useEffect, useState } from 'react';
import { CheckCircle, DollarSign, Tag } from 'lucide-react';

interface ExpenseNotification {
  amount: number;
  category: string;
  merchant: string;
  confidence: number;
}

export default function ExpenseFeedback() {
  const [notification, setNotification] = useState<ExpenseNotification | null>(null);

  useEffect(() => {
    const handleExpenseAdded = (event: CustomEvent) => {
      const expense = event.detail;
      setNotification({
        amount: expense.amount,
        category: expense.category,
        merchant: expense.merchant,
        confidence: expense.confidence
      });
      
      // Auto-hide after 4 seconds
      setTimeout(() => setNotification(null), 4000);
    };

    document.addEventListener('expense-added', handleExpenseAdded as EventListener);
    return () => document.removeEventListener('expense-added', handleExpenseAdded as EventListener);
  }, []);

  if (!notification) return null;

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="fixed bottom-6 right-6 bg-black text-white p-6 border-2 border-white shadow-[8px_8px_0_0_rgba(229,228,226,1)] animate-slide-up z-50 max-w-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-2xl font-bold">${notification.amount.toFixed(2)}</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Tag className="w-4 h-4" />
              <span className="text-white">{notification.category}</span>
            </div>
            
            <p className="text-sm text-gray-400">
              at <span className="font-medium">{notification.merchant}</span>
            </p>
            
            <div className="flex items-center gap-2 text-xs mt-2">
              <div className="w-2 h-2 bg-white"></div>
              <span className="text-white">
                {getConfidenceText(notification.confidence)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}