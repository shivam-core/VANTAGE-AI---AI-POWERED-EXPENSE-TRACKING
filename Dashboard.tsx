import React from 'react';

interface Totals {
  today: number;
  week: number;
  month: number;
}

interface DashboardProps {
  totals: Totals;
  currencySymbol: string;
}

interface DashboardCardProps {
  title: string;
  amount: number;
  currencySymbol: string;
  className?: string;
}

function DashboardCard({ title, amount, currencySymbol, className = '' }: DashboardCardProps) {
  return (
    <div className={`bg-black border-2 border-white rounded-none p-8 transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_0_#E5E4E2] ${className}`}>
      <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2 font-mono">{title}</h3>
      <div className="text-5xl font-light tracking-tight text-white">
        {currencySymbol}{amount.toFixed(2)}
      </div>
    </div>
  );
}

export default function Dashboard({ totals, currencySymbol }: DashboardProps) {
  return (
    <div className="w-full px-8 py-12">
      {/* Doubled the heading size from text-2xl to text-4xl */}
      <h2 className="text-4xl font-light text-center mb-10 tracking-wide text-gray-300">
        How much have you spent?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
        <DashboardCard 
          title="TODAY" 
          amount={totals.today} 
          currencySymbol={currencySymbol}
          className="border-white"
        />
        <DashboardCard 
          title="THIS WEEK" 
          amount={totals.week} 
          currencySymbol={currencySymbol}
          className="border-white"
        />
        <DashboardCard 
          title="THIS MONTH" 
          amount={totals.month} 
          currencySymbol={currencySymbol}
          className="border-white"
        />
      </div>
    </div>
  );
}