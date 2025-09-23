import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Type, Zap } from 'lucide-react';
import CyberCard from './CyberCard';

interface SpeechInputProps {
  onDetect: (text: string) => void;
}

export default function SpeechInput({ onDetect }: SpeechInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          onDetect(finalTranscript);
          setIsListening(false);
          // Clear transcript after a delay
          setTimeout(() => setTranscript(''), 3000);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onDetect]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      onDetect(manualInput.trim());
      setManualInput('');
      setShowManualInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleManualSubmit();
    }
  };

  return (
    <div className="space-y-6">
      {/* Voice Input Button */}
      {isSupported && (
        <button 
          onClick={isListening ? stopListening : startListening}
          className={`w-full relative group overflow-hidden border-2 transition-all duration-300 ${
            isListening 
              ? 'border-white bg-white text-black' 
              : 'border-white bg-black text-white hover:bg-white hover:text-black'
          }`}
        >
          <div className="relative flex items-center justify-center gap-4 py-6 px-8">
            {isListening ? (
              <>
                <div className="relative flex items-center">
                  <div className="pulse-dot w-6 h-6 bg-black rounded-full"></div>
                </div>
                <span className="text-xl font-mono text-black">LISTENING... TAP TO STOP</span>
              </>
            ) : (
              <>
                <Mic className="w-8 h-8 text-white" />
                <span className="text-xl font-mono text-white">VOICE INPUT</span>
                <Zap className="w-6 h-6 text-white" />
              </>
            )}
          </div>
        </button>
      )}

      {/* Manual Input Toggle */}
      <button
        onClick={() => setShowManualInput(!showManualInput)}
        className="cyber-btn w-full justify-center"
      >
        <Type className="w-4 h-4" />
        <span>{showManualInput ? 'HIDE' : 'SHOW'} MANUAL INPUT</span>
      </button>

      {/* Manual Input Field */}
      {showManualInput && (
        <CyberCard variant="terminal">
          <div className="terminal-header">
            <div className="terminal-dot red"></div>
            <div className="terminal-dot yellow"></div>
            <div className="terminal-dot green"></div>
            <span className="text-black font-mono text-sm ml-2">MANUAL_INPUT.EXE</span>
          </div>
          <div className="p-4">
            <div className="flex gap-3">
              <span className="text-white font-mono">$</span>
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Coffee $5.50 at Starbucks"
                className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder-gray-500"
              />
              <button
                onClick={handleManualSubmit}
                disabled={!manualInput.trim()}
                className="cyber-btn px-4 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                EXECUTE
              </button>
            </div>
          </div>
        </CyberCard>
      )}

      {/* Transcript Display */}
      {transcript && (
        <CyberCard className="border-white">
          <div className="flex items-start gap-3">
            <Volume2 className="w-5 h-5 mt-1 text-white" />
            <div>
              <p className="text-sm text-gray-400 mb-2 font-mono">PROCESSING:</p>
              <p className="font-medium text-white font-mono">{transcript}</p>
            </div>
          </div>
        </CyberCard>
      )}

      {/* Usage Examples */}
      <CyberCard variant="terminal">
        <div className="terminal-header">
          <div className="terminal-dot red"></div>
          <div className="terminal-dot yellow"></div>
          <div className="terminal-dot green"></div>
          <span className="text-black font-mono text-sm ml-2">VOICE_EXAMPLES.LOG</span>
        </div>
        <div className="p-4 space-y-2">
          <p className="text-white font-mono text-sm mb-3">// TRAINING SAMPLES:</p>
          <div className="space-y-1 text-xs font-mono text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-white">{'>'}</span>
              <span>"I spent $12.50 at Starbucks for coffee"</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">{'>'}</span>
              <span>"Lunch at McDonald's was $8.99"</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">{'>'}</span>
              <span>"Gas station $45 for fuel"</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">{'>'}</span>
              <span>"Amazon purchase $29.99 for books"</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">{'>'}</span>
              <span>"Movie tickets $24 at AMC"</span>
            </div>
          </div>
        </div>
      </CyberCard>

      {/* Browser Support Warning */}
      {!isSupported && (
        <CyberCard className="border-white bg-black">
          <div className="flex items-center gap-3 text-white">
            <MicOff className="w-6 h-6" />
            <div>
              <p className="font-bold font-mono">VOICE INTERFACE UNAVAILABLE</p>
              <p className="text-sm text-gray-400 font-mono">
                Voice recognition not supported. Use manual input or upgrade to Chrome/Edge.
              </p>
            </div>
          </div>
        </CyberCard>
      )}
    </div>
  );
}