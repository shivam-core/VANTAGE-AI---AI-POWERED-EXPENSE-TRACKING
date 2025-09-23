import React, { useState } from 'react';
import { User, LogOut, Settings, Globe, Edit3, Check, X } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import { useOnboarding } from '../contexts/OnboardingContext';
import { formatCurrency } from '../lib/currency';

export default function UserProfile() {
  const { user, logout } = useOnboarding();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');

  if (!user) return null;

  const handleSaveName = () => {
    if (editName.trim()) {
      const updatedUser = { ...user, name: editName.trim() };
      localStorage.setItem('vantageUser', JSON.stringify(updatedUser));
      setIsEditing(false);
      // Force a page refresh to update the user context
      window.location.reload();
    }
  };

  const handleCancelEdit = () => {
    setEditName(user.name);
    setIsEditing(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 bg-white border-2 border-black rounded-lg px-4 py-2 hover:bg-[#E5E4E2] transition-colors"
      >
        <ReactCountryFlag 
          countryCode={user.countryCode} 
          svg 
          style={{ width: '1.5em', height: '1.2em' }}
        />
        <div className="text-left">
          <p className="font-medium text-sm">{user.name}</p>
          <p className="text-xs text-gray-600">{user.currency}</p>
        </div>
        <User className="w-4 h-4" />
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white border-2 border-black rounded-lg shadow-[5px_5px_0_0_rgba(0,0,0,1)] z-20">
            <div className="p-4 border-b-2 border-black">
              <div className="flex items-center gap-3 mb-3">
                <ReactCountryFlag 
                  countryCode={user.countryCode} 
                  svg 
                  style={{ width: '2em', height: '1.5em' }}
                />
                <div className="flex-1">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveName}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{user.name}</h3>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-gray-500 hover:text-black"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Age</p>
                  <p className="font-medium">{user.age} years</p>
                </div>
                <div>
                  <p className="text-gray-600">Country</p>
                  <p className="font-medium">{user.country}</p>
                </div>
                <div>
                  <p className="text-gray-600">Currency</p>
                  <p className="font-medium">{user.currency}</p>
                </div>
                <div>
                  <p className="text-gray-600">Member Since</p>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  // Add settings functionality here
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#E5E4E2] rounded transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to log out? This will clear all your data.')) {
                    logout();
                  }
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-red-50 text-red-600 rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}