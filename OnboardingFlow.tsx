import React from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import AuthMethod from './AuthMethod';
import EmailSignup from './EmailSignup';
import ProfileSetup from './ProfileSetup';

export default function OnboardingFlow() {
  const { step } = useOnboarding();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E5E4E2] to-white flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl border-2 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] max-w-md w-full">
        {step === 0 && <AuthMethod />}
        {step === 1 && <EmailSignup />}
        {step === 2 && <ProfileSetup />}
      </div>
      
      {/* Progress Indicator */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-2 bg-white border-2 border-black rounded-full px-4 py-2 shadow-lg">
          {[0, 1, 2].map((stepIndex) => (
            <div
              key={stepIndex}
              className={`w-3 h-3 rounded-full transition-colors ${
                stepIndex <= step ? 'bg-black' : 'bg-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-sm font-medium">
            Step {step + 1} of 3
          </span>
        </div>
      </div>
    </div>
  );
}