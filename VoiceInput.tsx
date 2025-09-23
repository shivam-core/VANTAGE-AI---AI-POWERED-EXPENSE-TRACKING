import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputProps {
  onResult: (result: string) => void;
  currencySymbol: string;
}

export default function VoiceInput({ onResult, currencySymbol }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [statusText, setStatusText] = useState('TAP AND SPEAK EXPENSE');
  const [lastTranscript, setLastTranscript] = useState('');

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setLastTranscript(transcript);
        setStatusText(`Processing: "${transcript}"`);
        
        // Add a small delay to show the transcript
        setTimeout(() => {
          onResult(transcript);
          setIsListening(false);
          setStatusText('Expense processed!');
          
          // Reset to default after showing success
          setTimeout(() => {
            setStatusText('TAP AND SPEAK EXPENSE');
            setLastTranscript('');
          }, 2000);
        }, 500);
      };
      
      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setStatusText('Error - try again');
        setTimeout(() => setStatusText('TAP AND SPEAK EXPENSE'), 2000);
      };
      
      rec.onend = () => {
        if (isListening) {
          setIsListening(false);
          if (!lastTranscript) {
            setStatusText('No speech detected - try again');
            setTimeout(() => setStatusText('TAP AND SPEAK EXPENSE'), 2000);
          }
        }
      };
      
      setRecognition(rec);
    }
  }, [onResult, isListening, lastTranscript]);

  const toggleListening = () => {
    if (!recognition) {
      setStatusText('Voice not supported in this browser');
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setStatusText('TAP AND SPEAK EXPENSE');
    } else {
      setLastTranscript('');
      recognition.start();
      setIsListening(true);
      setStatusText('Listening... speak now');
    }
  };

  if (!isSupported) {
    return (
      <div className="text-center py-12">
        <div className="w-32 h-32 rounded-full bg-black border-2 border-gray-600 flex items-center justify-center mx-auto mb-4">
          <MicOff className="h-16 w-16 text-gray-600" />
        </div>
        <p className="text-gray-400 font-mono text-sm uppercase tracking-wider">
          Voice input not supported
        </p>
        <p className="text-gray-600 font-mono text-xs mt-2">
          Try Chrome, Edge, or Safari
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <button
        onClick={toggleListening}
        className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto transition-all duration-300 border-2 ${
          isListening 
            ? 'bg-white text-black animate-pulse border-white scale-110' 
            : 'bg-black border-white text-white hover:bg-white hover:text-black hover:scale-105'
        }`}
      >
        <Mic className="h-16 w-16" />
      </button>
      
      <p className="mt-6 text-gray-400 font-mono text-sm uppercase tracking-wider">
        {statusText}
      </p>
      
      {lastTranscript && (
        <div className="mt-4 p-3 bg-black border border-white text-white font-mono text-sm">
          "{lastTranscript}"
        </div>
      )}
      
      {/* Enhanced usage examples with time parsing */}
      <div className="mt-8 text-xs text-gray-500 font-mono space-y-1">
        <p className="text-gray-400 mb-2">Voice examples:</p>
        <p>"20 at HNM at 10:30"</p>
        <p>"50 coffee at Starbucks"</p>
        <p>"90 lunch at McDonald's"</p>
        <p>"15.75 dinner at 7:30 pm"</p>
      </div>
    </div>
  );
}