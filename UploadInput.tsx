import React, { useState, useRef } from 'react';
import { Upload, File, X, Image, FileText } from 'lucide-react';

interface UploadInputProps {
  onProcess: (expense: any) => void;
}

export default function UploadInput({ onProcess }: UploadInputProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const processFile = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate AI processing with progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    clearInterval(progressInterval);
    setProgress(100);
    
    // Mock expense extraction based on file type
    const mockExpenses = [
      { amount: 42.50, merchant: "Starbucks", category: "Food" },
      { amount: 89.99, merchant: "Amazon", category: "Shopping" },
      { amount: 15.75, merchant: "McDonald's", category: "Food" },
      { amount: 67.20, merchant: "Shell", category: "Transportation" },
      { amount: 125.00, merchant: "Target", category: "Shopping" }
    ];
    
    const randomExpense = mockExpenses[Math.floor(Math.random() * mockExpenses.length)];
    
    setTimeout(() => {
      onProcess({
        ...randomExpense,
        date: new Date().toISOString()
      });
      
      // Reset state
      setSelectedFile(null);
      setIsProcessing(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 500);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-5 w-5 text-cyan-400" />;
    } else if (file.type.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-400" />;
    } else {
      return <File className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="py-4">
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,.pdf,.doc,.docx"
        className="hidden"
      />
      
      <div className="flex flex-col items-center">
        {!selectedFile ? (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 rounded-full bg-black border-2 border-white flex items-center justify-center mx-auto transition-all duration-300 hover:bg-white hover:text-black hover:scale-105"
            >
              <Upload className="h-16 w-16" />
            </button>
            <p className="mt-6 text-gray-400 font-mono text-sm uppercase tracking-wider">
              Upload Receipt or Invoice
            </p>
            <div className="mt-4 text-xs text-gray-500 font-mono text-center space-y-1">
              <p>Supports JPG, PNG, PDF, DOC</p>
              <p>Max file size: 10MB</p>
            </div>
          </>
        ) : (
          <div className="w-full max-w-sm">
            <div className="flex items-center justify-between bg-black border-2 border-white p-4 rounded-none mb-4">
              <div className="flex items-center flex-1 min-w-0">
                {getFileIcon(selectedFile)}
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-white font-mono text-sm truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-gray-400 font-mono text-xs">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="ml-3 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {isProcessing && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm font-mono mb-2">
                  <span className="text-gray-400">Processing with AI...</span>
                  <span className="text-white">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-black border-2 border-white h-3 rounded-none">
                  <div 
                    className="bg-white h-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            
            <button
              onClick={processFile}
              disabled={isProcessing}
              className={`w-full py-3 rounded-none flex items-center justify-center font-mono uppercase tracking-wider transition-colors border-2 ${
                isProcessing 
                  ? 'bg-black border-gray-600 text-gray-600 cursor-not-allowed' 
                  : 'bg-black border-white text-white hover:bg-white hover:text-black'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-white mr-2"></div>
                  Processing...
                </>
              ) : (
                'Extract Expense'
              )}
            </button>
          </div>
        )}
      </div>
      
      {/* AI Processing Info */}
      <div className="mt-6 p-4 bg-black border border-white rounded-none">
        <div className="text-xs font-mono text-gray-400 space-y-2">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-white mr-3"></div>
            <span>AI extracts amount, merchant, and category</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-white mr-3"></div>
            <span>Supports receipts, invoices, and bills</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-white mr-3"></div>
            <span>OCR technology for text recognition</span>
          </div>
        </div>
      </div>
    </div>
  );
}