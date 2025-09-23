import React, { useEffect, useState } from 'react';
import { AlertTriangle, TrendingUp, X } from 'lucide-react';

interface BudgetAlert {
  id: string;
  category: string;
  message: string;
  type: 'warning' | 'danger';
  amount: number;
  budget: number;
}

export default function BudgetAlerts() {
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);

  useEffect(() => {
    const handleBudgetAlert = (event: CustomEvent) => {
      const alert = event.detail;
      setAlerts(prev => [...prev, { ...alert, id: Date.now().toString() }]);
      
      // Auto-remove after 8 seconds
      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a.id !== alert.id));
      }, 8000);
    };

    document.addEventListener('budget-alert', handleBudgetAlert as EventListener);
    return () => document.removeEventListener('budget-alert', handleBudgetAlert as EventListener);
  }, []);

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 space-y-3 z-50 max-w-sm">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-xl border-2 shadow-lg animate-slide-up ${
            alert.type === 'danger' 
              ? 'bg-red-50 border-red-300 text-red-800' 
              : 'bg-yellow-50 border-yellow-300 text-yellow-800'
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className={`w-6 h-6 flex-shrink-0 ${
              alert.type === 'danger' ? 'text-red-600' : 'text-yellow-600'
            }`} />
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="font-bold text-sm">Budget Alert</span>
              </div>
              
              <p className="text-sm mb-2">{alert.message}</p>
              
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Spent:</span>
                  <span className="font-medium">${alert.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Budget:</span>
                  <span className="font-medium">${alert.budget.toFixed(2)}</span>
                </div>
                <div className="w-full bg-white h-2 rounded-full border">
                  <div 
                    className={`h-full rounded-full ${
                      alert.type === 'danger' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min((alert.amount / alert.budget) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
            
            <button
              onClick={() => dismissAlert(alert.id)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}