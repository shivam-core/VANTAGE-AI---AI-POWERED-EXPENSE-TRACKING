import React from 'react';
import { Mail, Chrome, TrendingUp } from 'lucide-react';
import { useOnboarding } from '../../contexts/OnboardingContext';

export default function AuthMethod() {
  const { setStep, setAuthMethod } = useOnboarding();

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <TrendingUp className="w-8 h-8" />
        <h1 className="text-3xl font-bold tracking-tight">VANTAGE AI</h1>
      </div>
      <p className="text-gray-600 mb-8">Welcome to the future of expense tracking</p>
      
      <div className="space-y-4">
        <button
          onClick={() => {
            setAuthMethod('google');
            setStep(1);
          }}
          className="w-full bg-black text-white py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors font-medium"
        >
          <Chrome className="w-5 h-5" />
          Continue with Google
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        
        <button
          onClick={() => {
            setAuthMethod('email');
            setStep(1);
          }}
          className="w-full border-2 border-black py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-[#E5E4E2] transition-colors font-medium"
        >
          <Mail className="w-5 h-5" />
          Sign up with Email
        </button>
      </div>
      
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg">
        <p className="text-sm text-blue-800 font-medium">✨ What you'll get:</p>
        <ul className="text-xs text-blue-700 mt-2 space-y-1">
          <li>• Voice-powered expense tracking</li>
          <li>• AI receipt scanning & processing</li>
          <li>• Smart budget alerts & insights</li>
          <li>• Multi-currency support</li>
        </ul>
      </div>
    </div>
  );
}