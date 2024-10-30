export const formatCurrency = (amount: number): string => {
  const isNegative = amount < 0;
  const formattedAmount = Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return `${isNegative ? '- ' : ''}₹${formattedAmount}`;
};
