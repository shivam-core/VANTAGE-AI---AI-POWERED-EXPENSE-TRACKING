import React, { useState } from 'react';
import { Mail, Copy, Check, Forward, Zap, Clock, Terminal } from 'lucide-react';
import CyberCard from './CyberCard';

export default function MagicInbox() {
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
    <CyberCard variant="terminal">
      <div className="terminal-header">
        <div className="terminal-dot red"></div>
        <div className="terminal-dot yellow"></div>
        <div className="terminal-dot green"></div>
        <span className="text-black font-mono text-sm ml-2">MAGIC_INBOX.SYS</span>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Terminal className="w-6 h-6 text-white" />
          <h3 className="text-xl font-bold font-mono text-white">EMAIL INBOX</h3>
          <div className="bg-white text-black px-3 py-1 text-xs font-mono">
            AI-POWERED
          </div>
        </div>
        
        <p className="mb-6 text-gray-400 font-mono text-sm leading-relaxed">
          // Forward receipts to your personal AI processing unit
        </p>
        
        <div className="bg-white p-4 border-2 border-white mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-black font-mono">{'>'}</span>
              <code className="text-lg font-mono font-semibold text-black">{email}</code>
            </div>
            <button 
              onClick={copyToClipboard}
              className="cyber-btn flex items-center gap-2 px-3 py-1 text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  COPIED
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  COPY
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <Forward className="w-5 h-5 mt-1 text-white" />
            <div>
              <p className="font-medium font-mono text-white">EMAIL_RECEIPTS.EXE</p>
              <p className="text-sm text-gray-400 font-mono">
                Forward any receipt email → AI extracts expense data automatically
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <Zap className="w-5 h-5 mt-1 text-white" />
            <div>
              <p className="font-medium font-mono text-white">INSTANT_PROCESSING.EXE</p>
              <p className="text-sm text-gray-400 font-mono">
                Confirmation emails within seconds of receipt forwarding
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <Clock className="w-5 h-5 mt-1 text-white" />
            <div>
              <p className="font-medium font-mono text-white">24/7_AVAILABILITY.SYS</p>
              <p className="text-sm text-gray-400 font-mono">
                AI processes receipts around the clock
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-black border-2 border-white">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-white" />
            <p className="font-bold text-white font-mono">FEATURES.PENDING</p>
          </div>
          <div className="text-sm text-gray-400 font-mono space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-white">+</span>
              <span>Smart categorization with 99.9% accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">+</span>
              <span>Merchant recognition</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">+</span>
              <span>Multi-format receipt support</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">+</span>
              <span>Email provider integration</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-3 bg-white border-2 border-white">
          <p className="text-sm text-black font-mono">
            <span className="text-black font-bold">// PRO_TIP:</span> Configure email forwarding rules 
            in Gmail/Outlook to auto-send receipts to your Email Inbox
          </p>
        </div>
      </div>
    </CyberCard>
  );
}