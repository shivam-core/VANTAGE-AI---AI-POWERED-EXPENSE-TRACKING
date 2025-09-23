import axios from 'axios';

interface DappierResponse {
  amount?: number;
  category?: string;
  merchant?: string;
  confidence?: number;
}

interface ProcessedExpense {
  amount: number;
  category: string;
  merchant: string;
  rawInput: string;
  timestamp: Date;
  confidence: number;
}

const DAPPIER_API_KEY = import.meta.env.VITE_DAPPIER_API_KEY;

export const processExpenseWithDappier = async (input: string): Promise<ProcessedExpense> => {
  // If Dappier API key is available, use real API
  if (DAPPIER_API_KEY) {
    try {
      const response = await axios.post<DappierResponse>(
        'https://api.dappier.com/classify',
        {
          text: input,
          categories: ["food", "transport", "entertainment", "shopping", "bills", "utilities", "healthcare", "other"],
          extract_amount: true,
          extract_merchant: true,
          extract_location: true
        },
        {
          headers: {
            'Authorization': `Bearer ${DAPPIER_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return {
        amount: response.data.amount || extractAmountFallback(input),
        category: capitalizeCategory(response.data.category || categorizeFallback(input)),
        merchant: response.data.merchant || extractMerchantFallback(input),
        rawInput: input,
        timestamp: new Date(),
        confidence: response.data.confidence || 0.8
      };
    } catch (error) {
      console.error("Dappier API error:", error);
      // Fall back to local processing
    }
  }
  
  // Enhanced fallback processing with better regex and NLP
  return processExpenseLocally(input);
};

const processExpenseLocally = (input: string): ProcessedExpense => {
  const text = input.toLowerCase();
  
  return {
    amount: extractAmountFallback(input),
    category: capitalizeCategory(categorizeFallback(text)),
    merchant: extractMerchantFallback(input),
    rawInput: input,
    timestamp: new Date(),
    confidence: 0.6
  };
};

const extractAmountFallback = (input: string): number => {
  // Enhanced amount extraction with multiple patterns
  const patterns = [
    /\$(\d+(?:\.\d{1,2})?)/,           // $12.50
    /(\d+(?:\.\d{1,2})?)\s*dollars?/i, // 12.50 dollars
    /(\d+(?:\.\d{1,2})?)\s*bucks?/i,   // 12 bucks
    /(\d+(?:\.\d{1,2})?)(?=\s|$)/      // standalone number
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      const amount = parseFloat(match[1]);
      if (amount > 0 && amount < 10000) { // Reasonable bounds
        return amount;
      }
    }
  }
  
  return 0;
};

const extractMerchantFallback = (input: string): string => {
  const text = input.toLowerCase();
  
  // Look for "at [merchant]" or "from [merchant]"
  const atMatch = text.match(/(?:at|from)\s+([a-zA-Z0-9\s&'-]+?)(?:\s+(?:for|on|in|$))/i);
  if (atMatch) {
    return formatMerchantName(atMatch[1].trim());
  }
  
  // Common merchant names
  const merchants = [
    'starbucks', 'mcdonalds', 'walmart', 'target', 'amazon', 'uber', 'lyft', 
    'shell', 'exxon', 'chevron', 'costco', 'whole foods', 'trader joes',
    'home depot', 'lowes', 'best buy', 'apple store', 'netflix', 'spotify'
  ];
  
  for (const merchant of merchants) {
    if (text.includes(merchant)) {
      return formatMerchantName(merchant);
    }
  }
  
  // Extract potential merchant from context
  const words = text.split(' ');
  for (let i = 0; i < words.length - 1; i++) {
    if (['at', 'from'].includes(words[i])) {
      const nextWord = words[i + 1];
      if (nextWord && nextWord.length > 2) {
        return formatMerchantName(nextWord);
      }
    }
  }
  
  return 'Unknown Merchant';
};

const categorizeFallback = (text: string): string => {
  const categories = {
    'Food': [
      'coffee', 'lunch', 'dinner', 'breakfast', 'food', 'restaurant', 'cafe',
      'starbucks', 'mcdonalds', 'pizza', 'burger', 'sandwich', 'meal', 'eat',
      'grocery', 'supermarket', 'whole foods', 'trader joes'
    ],
    'Transportation': [
      'gas', 'fuel', 'uber', 'lyft', 'taxi', 'transport', 'bus', 'train',
      'parking', 'toll', 'car', 'vehicle', 'shell', 'exxon', 'chevron'
    ],
    'Shopping': [
      'shopping', 'clothes', 'amazon', 'target', 'walmart', 'store', 'buy',
      'purchase', 'retail', 'mall', 'clothing', 'shoes', 'electronics'
    ],
    'Entertainment': [
      'movie', 'entertainment', 'game', 'concert', 'show', 'theater',
      'netflix', 'spotify', 'music', 'streaming', 'fun', 'leisure'
    ],
    'Utilities': [
      'electric', 'electricity', 'water', 'internet', 'phone', 'utility',
      'bill', 'cable', 'wifi', 'cellular', 'power', 'heating'
    ],
    'Healthcare': [
      'doctor', 'hospital', 'pharmacy', 'medical', 'health', 'medicine',
      'prescription', 'clinic', 'dentist', 'insurance'
    ]
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }
  
  return 'Other';
};

const formatMerchantName = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const capitalizeCategory = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
};