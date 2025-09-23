import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import countries from 'world-countries';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  country: string;
  currency: string;
  countryCode: string;
  createdAt: Date;
}

interface OnboardingContextType {
  user: User | null;
  step: number;
  authMethod: 'google' | 'email' | null;
  detectedCurrency: string;
  detectedCountry: string;
  setStep: (step: number) => void;
  setAuthMethod: (method: 'google' | 'email' | null) => void;
  completeOnboarding: (userData: Partial<User>) => void;
  logout: () => void;
  isLoading: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState(0);
  const [authMethod, setAuthMethod] = useState<'google' | 'email' | null>(null);
  const [detectedCurrency, setDetectedCurrency] = useState('USD');
  const [detectedCountry, setDetectedCountry] = useState('United States');
  const [isLoading, setIsLoading] = useState(true);

  // Create country-currency mapping
  const countryCurrencies = countries.reduce((map, country) => {
    map[country.name.common] = country.currencies ? Object.keys(country.currencies)[0] : 'USD';
    return map;
  }, {} as Record<string, string>);

  const countryCodeMap = countries.reduce((map, country) => {
    map[country.name.common] = country.cca2.toLowerCase();
    return map;
  }, {} as Record<string, string>);

  useEffect(() => {
    // Check for existing user
    const savedUser = localStorage.getItem('vantageUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser({
          ...parsedUser,
          createdAt: new Date(parsedUser.createdAt)
        });
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('vantageUser');
      }
    }

    // Auto-detect location and currency
    detectLocationAndCurrency();
    setIsLoading(false);
  }, []);

  const detectLocationAndCurrency = async () => {
    try {
      // Try multiple IP geolocation services
      const services = [
        'https://ipapi.co/json/',
        'https://api.ipify.org?format=json', // Fallback
      ];

      for (const service of services) {
        try {
          const response = await fetch(service);
          const data = await response.json();
          
          if (data.currency && data.country_name) {
            setDetectedCurrency(data.currency);
            setDetectedCountry(data.country_name);
            break;
          }
        } catch (error) {
          console.warn(`Failed to fetch from ${service}:`, error);
          continue;
        }
      }
    } catch (error) {
      console.error('Failed to detect location:', error);
      // Keep defaults
    }
  };

  const completeOnboarding = (userData: Partial<User>) => {
    const selectedCountry = userData.country || detectedCountry;
    const currency = countryCurrencies[selectedCountry] || detectedCurrency;
    const countryCode = countryCodeMap[selectedCountry] || 'us';
    
    const newUser: User = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: userData.name || '',
      email: userData.email || '',
      age: userData.age || 0,
      country: selectedCountry,
      currency,
      countryCode,
      createdAt: new Date()
    };
    
    setUser(newUser);
    localStorage.setItem('vantageUser', JSON.stringify(newUser));
    
    // Track onboarding completion
    console.log('User onboarding completed:', newUser);
  };

  const logout = () => {
    setUser(null);
    setStep(0);
    setAuthMethod(null);
    localStorage.removeItem('vantageUser');
    localStorage.removeItem('vantage-expenses');
    localStorage.removeItem('vantage-budgets');
  };

  return (
    <OnboardingContext.Provider value={{
      user,
      step,
      authMethod,
      detectedCurrency,
      detectedCountry,
      setStep,
      setAuthMethod,
      completeOnboarding,
      logout,
      isLoading
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}