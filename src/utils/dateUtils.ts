
/**
 * Utility functions for handling various date formats, especially M-Pesa timestamps
 */

/**
 * Converts M-Pesa timestamp format (YYYYMMDDHHMMSS) to a valid Date object
 */
export function parseMpesaTimestamp(timestamp: string | number): Date | null {
  try {
    const timestampStr = timestamp.toString();
    
    // Check if it's an M-Pesa timestamp format (14 digits: YYYYMMDDHHMMSS)
    if (timestampStr.length === 14 && /^\d{14}$/.test(timestampStr)) {
      const year = parseInt(timestampStr.substring(0, 4));
      const month = parseInt(timestampStr.substring(4, 6)) - 1; // JS months are 0-indexed
      const day = parseInt(timestampStr.substring(6, 8));
      const hour = parseInt(timestampStr.substring(8, 10));
      const minute = parseInt(timestampStr.substring(10, 12));
      const second = parseInt(timestampStr.substring(12, 14));
      
      const date = new Date(year, month, day, hour, minute, second);
      
      // Validate the created date
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error parsing M-Pesa timestamp:", error);
    return null;
  }
}

/**
 * Safely converts various date inputs to ISO string
 */
export function safeToISOString(dateInput: string | number | Date | null | undefined): string | undefined {
  if (dateInput === null || dateInput === undefined || dateInput === '') {
    return undefined;
  }
  
  try {
    let date: Date | null = null;
    
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === 'number') {
      // Try M-Pesa timestamp first
      date = parseMpesaTimestamp(dateInput);
      
      // If not M-Pesa format, try as Unix timestamp
      if (!date) {
        if (dateInput < 10000000000) {
          date = new Date(dateInput * 1000); // Convert seconds to milliseconds
        } else {
          date = new Date(dateInput); // Already in milliseconds
        }
      }
    } else if (typeof dateInput === 'string') {
      // Try M-Pesa timestamp first
      date = parseMpesaTimestamp(dateInput);
      
      // If not M-Pesa format, try as regular date string
      if (!date) {
        date = new Date(dateInput);
      }
    }
    
    // Validate the date before calling toISOString
    if (date && !isNaN(date.getTime())) {
      return date.toISOString();
    }
    
    return undefined;
  } catch (error) {
    console.error("Error converting date to ISO string:", dateInput, error);
    return undefined;
  }
}

/**
 * Format date for display with safe error handling
 */
export function formatDateSafely(dateInput: string | number | Date | null | undefined): string {
  if (dateInput === null || dateInput === undefined || dateInput === '') {
    return "N/A";
  }
  
  try {
    let date: Date | null = null;
    
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === 'number') {
      // Try M-Pesa timestamp first
      date = parseMpesaTimestamp(dateInput);
      
      // If not M-Pesa format, try as Unix timestamp
      if (!date) {
        if (dateInput < 10000000000) {
          date = new Date(dateInput * 1000);
        } else {
          date = new Date(dateInput);
        }
      }
    } else if (typeof dateInput === 'string') {
      // Try M-Pesa timestamp first
      date = parseMpesaTimestamp(dateInput);
      
      // If not M-Pesa format, try as regular date string
      if (!date) {
        date = new Date(dateInput);
      }
    }
    
    // Validate the date before formatting
    if (date && !isNaN(date.getTime())) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(date);
    }
    
    return "N/A";
  } catch (error) {
    console.error("Error formatting date:", dateInput, error);
    return "N/A";
  }
}
