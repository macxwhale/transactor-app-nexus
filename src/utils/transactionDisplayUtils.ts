
import { Transaction } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { formatDateSafely } from "./dateUtils";

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
 * Format transaction date using safe date handling
 */
export const formatTransactionDate = (dateValue: any) => {
  return formatDateSafely(dateValue);
};

/**
 * Format currency values with proper handling of null/undefined
 */
export const formatTransactionAmount = (amount: any) => {
  return displayValue(amount, formatCurrency);
};
