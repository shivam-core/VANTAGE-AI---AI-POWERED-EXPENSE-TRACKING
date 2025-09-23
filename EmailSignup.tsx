import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useOnboarding } from '../../contexts/OnboardingContext';

export default function EmailSignup() {
  const { setStep, authMethod } = useOnboarding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValid, setIsValid] = useState(false);

  React.useEffect(() => {
    const emailValid = email.includes('@') && email.includes('.');
    const passwordValid = password.length >= 6;
    const passwordsMatch = password === confirmPassword;
    
    setIsValid(emailValid && passwordValid && passwordsMatch);
  }, [email, password, confirmPassword]);

  const handleContinue = () => {
    if (isValid) {
      // Store email for profile setup
      localStorage.setItem('tempEmail', email);
      setStep(2);
    }
  };

  return (
    <div>
      <button
        onClick={() => setStep(0)}
        className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      
      <div className="flex items-center gap-2 mb-6">
        <Mail className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Create Your Account</h1>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-black p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="your@email.com"
            autoComplete="email"
          />
        </div>
        
        {authMethod === 'email' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-black p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border-2 border-black p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-red-600 text-sm mt-1">Passwords don't match</p>
              )}
            </div>
          </>
        )}
        
        <button
          onClick={handleContinue}
          disabled={!isValid}
          className="w-full bg-black text-white py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium hover:bg-gray-800 transition-colors"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mt-6 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>🔒 Your data is secure:</strong> We use industry-standard encryption and never share your personal information.
        </p>
      </div>
    </div>
  );
}