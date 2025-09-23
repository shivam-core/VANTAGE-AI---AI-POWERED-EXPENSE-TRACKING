interface CurrencySymbols {
  [key: string]: string;
}

const currencySymbols: CurrencySymbols = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'JPY': '¥',
  'CAD': 'C$',
  'AUD': 'A$',
  'CHF': 'CHF',
  'CNY': '¥',
  'INR': '₹',
  'KRW': '₩',
  'BRL': 'R$',
  'MXN': '$',
  'RUB': '₽',
  'ZAR': 'R',
  'SGD': 'S$',
  'HKD': 'HK$',
  'NOK': 'kr',
  'SEK': 'kr',
  'DKK': 'kr',
  'PLN': 'zł',
  'CZK': 'Kč',
  'HUF': 'Ft',
  'ILS': '₪',
  'AED': 'د.إ',
  'SAR': '﷼',
  'THB': '฿',
  'MYR': 'RM',
  'PHP': '₱',
  'IDR': 'Rp',
  'VND': '₫',
  'TRY': '₺',
  'EGP': '£',
  'NGN': '₦',
  'KES': 'KSh',
  'GHS': '₵',
  'MAD': 'د.م.',
  'TND': 'د.ت',
  'DZD': 'د.ج',
  'LBP': 'ل.ل',
  'JOD': 'د.ا',
  'KWD': 'د.ك',
  'QAR': 'ر.ق',
  'OMR': 'ر.ع.',
  'BHD': 'د.ب',
  'PKR': '₨',
  'BDT': '৳',
  'LKR': '₨',
  'NPR': '₨',
  'MMK': 'K',
  'KHR': '៛',
  'LAK': '₭',
  'UZS': 'лв',
  'KZT': '₸',
  'KGS': 'лв',
  'TJS': 'SM',
  'TMT': 'T',
  'AFN': '؋',
  'IRR': '﷼',
  'IQD': 'ع.د',
  'SYP': '£',
  'YER': '﷼',
  'AMD': '֏',
  'AZN': '₼',
  'GEL': '₾',
  'MDL': 'L',
  'RON': 'lei',
  'BGN': 'лв',
  'HRK': 'kn',
  'RSD': 'дин.',
  'BAM': 'KM',
  'MKD': 'ден',
  'ALL': 'L',
  'EUR': '€'
};

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  try {
    // Use Intl.NumberFormat for proper localization
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback to manual formatting if currency is not supported
    const symbol = currencySymbols[currency] || currency;
    return `${symbol}${amount.toFixed(2)}`;
  }
}

export function getCurrencySymbol(currency: string): string {
  return currencySymbols[currency] || currency;
}

export function parseCurrencyAmount(input: string, currency: string = 'USD'): number {
  // Remove currency symbols and non-numeric characters except decimal point
  const symbol = getCurrencySymbol(currency);
  const cleanInput = input
    .replace(new RegExp(`\\${symbol}`, 'g'), '')
    .replace(/[^\d.-]/g, '');
  
  const amount = parseFloat(cleanInput);
  return isNaN(amount) ? 0 : amount;
}

// Exchange rate functionality (placeholder for future implementation)
export async function convertCurrency(
  amount: number, 
  fromCurrency: string, 
  toCurrency: string
): Promise<number> {
  // This would integrate with a real exchange rate API in production
  // For now, return the original amount
  console.log(`Converting ${amount} from ${fromCurrency} to ${toCurrency}`);
  return amount;
}

export function getSupportedCurrencies(): string[] {
  return Object.keys(currencySymbols);
}