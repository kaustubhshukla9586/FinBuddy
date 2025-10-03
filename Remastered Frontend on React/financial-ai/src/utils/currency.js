// Format currency with locale-specific formatting
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Format currency without decimal places for whole numbers
export const formatCurrencyShort = (amount, currency = 'USD', locale = 'en-US') => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter.format(amount);
};

// Format large numbers with K/M/B suffixes
export const formatCompactNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  return value.toFixed(decimals) + '%';
};