import React, { useState } from 'react';
import { Copy, Check, Mail } from 'lucide-react';

export default function EmailInput() {
  const [copied, setCopied] = useState(false);
  const email = 'expenses@vantageai.finance';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-black border-2 border-white rounded-none p-6">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-6 h-6 text-white" />
        <h3 className="text-lg font-mono text-white uppercase tracking-wider">Magic Inbox</h3>
      </div>
      
      <p className="text-gray-400 mb-6 font-mono text-sm">
        Forward receipts to this email for automatic processing:
      </p>
      
      <div className="flex items-center bg-black border-2 border-white px-4 py-3 rounded-none mb-6">
        <span className="font-mono text-white flex-1">{email}</span>
        <button 
          onClick={copyToClipboard}
          className="ml-4 bg-black border-2 border-white hover:bg-white hover:text-black px-3 py-1 rounded-none transition-colors flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span className="font-mono text-xs uppercase">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="font-mono text-xs uppercase">Copy</span>
            </>
          )}
        </button>
      </div>
      
      <div className="space-y-3 text-sm text-gray-400 font-mono">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-white mr-3"></div>
          <span>We'll process forwarded emails automatically</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-white mr-3"></div>
          <span>Confirmation will appear in your dashboard</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-white mr-3"></div>
          <span>Supports PDF, image, and text receipts</span>
        </div>
      </div>
    </div>
  );
}