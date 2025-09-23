import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { createWorker } from 'tesseract.js';

interface ReceiptScannerProps {
  onScan: (text: string) => void;
}

export default function ReceiptScanner({ onScan }: ReceiptScannerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setError(null);
        setSuccess(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const processReceipt = async () => {
    if (!image) return;
    
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setSuccess(false);
    
    try {
      const worker = await createWorker('eng');
      
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$.,- ',
      });

      const { data: { text } } = await worker.recognize(image, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });
      
      await worker.terminate();
      
      if (text.trim()) {
        onScan(text);
        setSuccess(true);
        // Clear image after successful processing
        setTimeout(() => {
          setImage(null);
          setSuccess(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }, 2000);
      } else {
        setError('No text found in image. Please try a clearer photo.');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      setError('Failed to process receipt. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const resetScanner = () => {
    setImage(null);
    setError(null);
    setSuccess(false);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white border-2 border-black rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Camera className="w-6 h-6" />
        <h3 className="text-xl font-bold">📷 Receipt Scanner</h3>
      </div>
      
      <p className="text-gray-700 mb-4">
        Upload a photo of your receipt and we'll extract the expense details automatically using AI-powered OCR.
      </p>
      
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />
      
      <div className="space-y-4">
        {!image ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary flex items-center gap-2 w-full justify-center"
          >
            <Upload className="w-5 h-5" />
            Select Receipt Photo
          </button>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={image} 
                alt="Receipt preview" 
                className="max-w-full max-h-64 mx-auto border-2 border-black rounded-lg shadow-lg"
              />
              <button
                onClick={resetScanner}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                title="Remove image"
              >
                ×
              </button>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary flex-1"
              >
                Change Image
              </button>
              
              <button
                onClick={processReceipt}
                disabled={isProcessing}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    Extract Expenses
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Processing receipt...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-[#E5E4E2] h-3 rounded-full border-2 border-black">
              <div 
                className="bg-black h-full rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-300 rounded-lg text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border-2 border-green-300 rounded-lg text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span>Receipt processed successfully! Expense added to your tracker.</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 border-2 border-blue-300 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Tips for better results:</strong>
        </p>
        <ul className="text-xs text-blue-700 mt-1 space-y-1">
          <li>• Ensure good lighting and clear image quality</li>
          <li>• Keep the receipt flat and fully visible</li>
          <li>• Avoid shadows and reflections</li>
          <li>• Works best with printed receipts (not handwritten)</li>
        </ul>
      </div>
    </div>
  );
}