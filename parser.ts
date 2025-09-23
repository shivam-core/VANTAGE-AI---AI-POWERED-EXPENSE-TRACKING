export interface ParsedExpense {
  amount: number;
  merchant: string;
  date: string;
  category: string;
}

export function parseExpenseInput(input: string): ParsedExpense | null {
  if (!input.trim()) return null;

  // Extract amount (always the first number found)
  const amountMatch = input.match(/(\d+\.?\d*)/);
  if (!amountMatch) return null;
  
  const amount = parseFloat(amountMatch[1]);
  if (amount <= 0 || amount > 10000) return null; // Reasonable bounds

  // Extract time if specified (HH:MM format with optional AM/PM)
  const timeMatch = input.match(/(\d{1,2}:\d{2}\s*(am|pm)?)/i);
  const specifiedTime = timeMatch ? timeMatch[0] : null;

  // Extract merchant - remove amount, time, and clean "at" prefixes
  let merchant = input
    .replace(amountMatch[0], '') // Remove amount
    .replace(timeMatch ? timeMatch[0] : '', '') // Remove time
    .replace(/dollars?/gi, '') // Remove "dollar(s)"
    .replace(/bucks?/gi, '') // Remove "buck(s)"
    .replace(/^\s*at\s+/i, '') // Remove starting "at"
    .replace(/\s+at\s*$/i, '') // Remove trailing "at"
    .trim();

  // If merchant still contains "at", extract what comes after it
  const atMatch = merchant.match(/\bat\s+([^,\s]+(?:\s+[^,\s]+)*)/i);
  if (atMatch) {
    merchant = atMatch[1].trim();
  }

  // Create date object
  const dateObj = new Date();

  // Apply custom time if specified
  if (specifiedTime) {
    const timeStr = specifiedTime.toLowerCase();
    let [hours, minutes] = timeStr.split(':');
    let hourNum = parseInt(hours);
    const minuteNum = parseInt(minutes);

    // Handle PM time
    if (timeStr.includes('pm')) {
      if (hourNum < 12) hourNum += 12;
    } 
    // Handle AM time
    else if (timeStr.includes('am')) {
      if (hourNum === 12) hourNum = 0;
    }
    // If no AM/PM specified, assume current period or reasonable default
    else {
      const currentHour = dateObj.getHours();
      // If specified hour is much different from current, assume opposite period
      if (Math.abs(currentHour - hourNum) > 6) {
        if (currentHour >= 12 && hourNum < 12) {
          hourNum += 12; // Assume PM
        }
      }
    }

    dateObj.setHours(hourNum);
    dateObj.setMinutes(minuteNum);
    dateObj.setSeconds(0);
    dateObj.setMilliseconds(0);
  }

  // Basic categorization
  const category = categorizeExpense(input.toLowerCase());

  return {
    amount,
    merchant: merchant || 'Unknown',
    date: dateObj.toISOString(),
    category
  };
}

function categorizeExpense(text: string): string {
  const categories = {
    'Food': [
      'coffee', 'lunch', 'dinner', 'breakfast', 'food', 'restaurant', 'cafe',
      'starbucks', 'mcdonalds', 'pizza', 'burger', 'sandwich', 'meal', 'eat',
      'grocery', 'supermarket', 'whole foods', 'trader joes', 'zara', 'h&m'
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
}

// Example usage and test cases
export const testCases = [
  {
    input: "20 at HNM at 10:30",
    expected: { amount: 20, merchant: "HNM", time: "10:30" }
  },
  {
    input: "I spent 28 at Zara",
    expected: { amount: 28, merchant: "Zara" }
  },
  {
    input: "58 at McDonald's",
    expected: { amount: 58, merchant: "McDonald's" }
  },
  {
    input: "20 dollars at H&M",
    expected: { amount: 20, merchant: "H&M" }
  },
  {
    input: "Coffee $5.50 at Starbucks",
    expected: { amount: 5.50, merchant: "Starbucks" }
  },
  {
    input: "15.75 lunch at 12:30 pm",
    expected: { amount: 15.75, merchant: "lunch", time: "12:30 pm" }
  }
];