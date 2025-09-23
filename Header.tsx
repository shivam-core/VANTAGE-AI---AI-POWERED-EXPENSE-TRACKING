import React from 'react';
import CurrencySelector from './CurrencySelector';

interface HeaderProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

export default function Header({ selectedCurrency, onCurrencyChange }: HeaderProps) {
  return (
    <header className="border-b border-gray-800">
      <div className="w-full px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <img 
              src="/VANTAGE AI LOGO(V).png" 
              alt="Vantage AI Logo" 
              className="w-8 h-8"
            />
            <div>
              <h1 className="text-2xl font-light tracking-tight text-white">
                VANTAGE AI
              </h1>
              <p className="text-gray-400 text-sm">
                AI POWERED EXPENSE TRACKING
              </p>
            </div>
          </div>

          {/* Currency Selector */}
          <CurrencySelector 
            selectedCurrency={selectedCurrency}
            onCurrencyChange={onCurrencyChange}
          />
        </div>
      </div>
    </header>
  );
}