import React, { useState } from 'react';
import VoiceInput from './VoiceInput';
import EmailInput from './EmailInput';
import UploadInput from './UploadInput';
import { parseExpenseInput } from '../lib/parser';

interface Expense {
  amount: number;
  merchant: string;
  category: string;
  date?: string;
}

interface InputPanelProps {
  activeTab: 'voice' | 'text' | 'email' | 'upload';
  setActiveTab: (tab: 'voice' | 'text' | 'email' | 'upload') => void;
  onAddExpense: (expense: Expense) => void;
  currencySymbol: string;
}

export default function InputPanel({ activeTab, setActiveTab, onAddExpense, currencySymbol }: InputPanelProps) {
  const [textInput, setTextInput] = useState('');
  const [feedback, setFeedback] = useState<string>('');

  const handleSubmit = () => {
    if (!textInput.trim()) return;

    const expense = parseExpenseInput(textInput);
    if (expense) {
      onAddExpense({
        amount: expense.amount,
        merchant: expense.merchant,
        category: expense.category,
        date: expense.date
      });
      setTextInput('');
      setFeedback(`Added: ${currencySymbol}${expense.amount.toFixed(2)} at ${expense.merchant}`);
      setTimeout(() => setFeedback(''), 3000);
    } else {
      setFeedback('Could not parse expense. Try: "20 at Starbucks" or "15.50 lunch"');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleVoiceResult = (result: string) => {
    const expense = parseExpenseInput(result);
    if (expense) {
      onAddExpense({
        amount: expense.amount,
        merchant: expense.merchant,
        category: expense.category,
        date: expense.date
      });
      setFeedback(`Voice: Added ${currencySymbol}${expense.amount.toFixed(2)} at ${expense.merchant}`);
      setTimeout(() => setFeedback(''), 3000);
    } else {
      setFeedback(`Could not parse: "${result}"`);
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const handleUploadResult = (expense: Expense) => {
    onAddExpense(expense);
    setFeedback(`Upload: Added ${currencySymbol}${expense.amount.toFixed(2)} at ${expense.merchant}`);
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div>
      {/* INPUT heading moved outside and positioned on the left */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-mono tracking-wide text-white uppercase">Input</h2>
        </div>
      </div>

      <div className="bg-black border-2 border-white rounded-none p-6">
        {/* Tab Selector - Updated to include upload */}
        <div className="flex mb-6 border-b-2 border-white">
          {(['voice', 'text', 'email', 'upload'] as const).map(method => (
            <button
              key={method}
              className={`px-4 py-3 flex-1 text-center font-mono text-sm uppercase tracking-wider transition-colors ${
                activeTab === method 
                  ? 'bg-white text-black border-b-2 border-black' 
                  : 'bg-black text-white hover:bg-gray-900'
              }`}
              onClick={() => setActiveTab(method)}
            >
              {method}
            </button>
          ))}
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className="mb-4 p-3 bg-black border border-white text-white font-mono text-sm">
            {feedback}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'voice' && (
          <VoiceInput onResult={handleVoiceResult} currencySymbol={currencySymbol} />
        )}

        {activeTab === 'text' && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Amount and description (e.g. 12.50 coffee at starbucks)`}
                className="bg-black border-2 border-white rounded-none px-4 py-3 flex-1 text-white placeholder-gray-500 focus:outline-none focus:border-gray-300 font-mono"
              />
              <button 
                onClick={handleSubmit}
                disabled={!textInput.trim()}
                className={`px-6 rounded-none font-mono uppercase tracking-wider transition-colors border-2 ${
                  textInput.trim() 
                    ? 'bg-black border-white text-white hover:bg-white hover:text-black' 
                    : 'bg-black border-gray-600 text-gray-600 cursor-not-allowed'
                }`}
              >
                Add
              </button>
            </div>
            
            {/* Enhanced Examples */}
            <div className="text-xs text-gray-500 font-mono space-y-1">
              <p className="text-gray-400 mb-2">Examples with time parsing:</p>
              <p>"20 at HNM at 10:30" → {currencySymbol}20.00 at HNM (10:30 AM)</p>
              <p>"15.75 lunch at 12:30 pm" → {currencySymbol}15.75 at lunch (12:30 PM)</p>
              <p>"58 at McDonald's" → {currencySymbol}58.00 at McDonald's (current time)</p>
            </div>
          </div>
        )}

        {activeTab === 'email' && <EmailInput />}

        {activeTab === 'upload' && <UploadInput onProcess={handleUploadResult} />}
      </div>
    </div>
  );
}