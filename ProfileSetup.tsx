import React, { useState, useEffect } from 'react';
import { User, ArrowLeft, CheckCircle, Globe } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import countries from 'world-countries';
import { useOnboarding } from '../../contexts/OnboardingContext';

export default function ProfileSetup() {
  const { completeOnboarding, detectedCurrency, detectedCountry, setStep } = useOnboarding();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(detectedCountry);
  const [email, setEmail] = useState('');

  const sortedCountries = countries
    .map(country => ({
      name: country.name.common,
      code: country.cca2.toLowerCase(),
      currency: country.currencies ? Object.keys(country.currencies)[0] : 'USD'
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const selectedCountryData = sortedCountries.find(c => c.name === selectedCountry);
  const displayCurrency = selectedCountryData?.currency || detectedCurrency;

  useEffect(() => {
    const tempEmail = localStorage.getItem('tempEmail');
    if (tempEmail) {
      setEmail(tempEmail);
      localStorage.removeItem('tempEmail');
    }
  }, []);

  const handleComplete = () => {
    if (name && selectedCountry && age) {
      completeOnboarding({
        name,
        email,
        age: parseInt(age),
        country: selectedCountry
      });
    }
  };

  const isValid = name.trim() && selectedCountry && age && parseInt(age) >= 13;

  return (
    <div>
      <button
        onClick={() => setStep(1)}
        className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      
      <div className="flex items-center gap-2 mb-6">
        <User className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Complete Your Profile</h1>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-2 border-black p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="John Doe"
            autoComplete="name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border-2 border-black p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="25"
            min="13"
            max="120"
          />
          {age && parseInt(age) < 13 && (
            <p className="text-red-600 text-sm mt-1">You must be at least 13 years old</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Country</label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full border-2 border-black p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select your country</option>
            {sortedCountries.map(country => (
              <option key={country.name} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        
        {selectedCountry && (
          <div className="bg-[#E5E4E2] p-4 rounded-lg border-2 border-black">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5" />
              <p className="font-bold">Currency & Location</p>
            </div>
            <div className="flex items-center gap-3">
              <ReactCountryFlag 
                countryCode={selectedCountryData?.code || 'us'} 
                svg 
                style={{ width: '2em', height: '1.5em' }}
              />
              <div>
                <p className="font-medium">{selectedCountry}</p>
                <p className="text-sm text-gray-600">
                  Currency: <span className="font-medium">{displayCurrency}</span>
                </p>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={handleComplete}
          disabled={!isValid}
          className="w-full bg-black text-white py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium hover:bg-gray-800 transition-colors mt-6"
        >
          <CheckCircle className="w-5 h-5" />
          Start Tracking Expenses
        </button>
      </div>
      
      <div className="mt-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
        <p className="text-sm text-green-800 font-medium">🎉 You're almost ready!</p>
        <p className="text-xs text-green-700 mt-1">
          Your currency will be automatically set to {displayCurrency} based on your location. 
          You can change this later in settings.
        </p>
      </div>
    </div>
  );
}