
import { Transaction } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";

/**
 * Helper function to display "N/A" for null or undefined values
 */
export const displayValue = (value: any, formatter?: (val: any) => string) => {
  if (value === null || value === undefined || value === '') {
    return "N/A";
  }
  return formatter ? formatter(value) : value;
};

/**
 * Format transaction date properly, handling numeric string conversion
 */
export const formatTransactionDate = (dateValue: any) => {
  // Convert to number if it's a string representation of a number
  const parsedDate = dateValue && !isNaN(Number(dateValue)) 
    ? Number(dateValue) 
    : dateValue;
    
  return displayValue(parsedDate, formatDate);
};

/**
 * Format currency values with proper handling of null/undefined
 */
export const formatTransactionAmount = (amount: any) => {
  return displayValue(amount, formatCurrency);
};

