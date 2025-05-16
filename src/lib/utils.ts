
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2,
  }).format(amount);
}

// Format date
export function formatDate(dateInput: string | number | null | undefined): string {
  // Return N/A for null, undefined or empty values
  if (dateInput === null || dateInput === undefined || dateInput === '') {
    return "N/A";
  }
  
  try {
    let date: Date;
    
    // If the input is a number (timestamp), convert appropriately
    if (typeof dateInput === 'number') {
      // Check if it's in seconds (Unix timestamp) and convert to milliseconds if needed
      if (dateInput < 10000000000) {
        date = new Date(dateInput * 1000); // Convert seconds to milliseconds
      } else {
        date = new Date(dateInput); // Already in milliseconds
      }
    } else {
      date = new Date(dateInput);
    }
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "N/A";
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "N/A";
  }
}

// Format phone number (Kenyan format)
export function formatPhoneNumber(phoneNumber: string): string {
  // Handle Kenyan phone numbers
  if (phoneNumber.startsWith('+254')) {
    return phoneNumber;
  }
  
  // If phone number starts with 0, replace with +254
  if (phoneNumber.startsWith('0')) {
    return `+254${phoneNumber.substring(1)}`;
  }
  
  // If it's just the 9 digits, add the prefix
  if (phoneNumber.length === 9 && !phoneNumber.startsWith('+')) {
    return `+254${phoneNumber}`;
  }
  
  return phoneNumber;
}

// Generate mock data for development purposes
export function generateMockApplications(count: number = 10): any[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Test App ${i + 1}`,
    callback_url: `https://example${i + 1}.com/callback`,
    consumer_key: `consumer_key_${i + 1}`,
    consumer_secret: `consumer_secret_${i + 1}`,
    business_short_code: `${174000 + i}`,
    passkey: `passkey_${i + 1}`,
    bearer_token: `token_${i + 1}`,
    party_a: `party_a_${i + 1}`,
    party_b: `party_b_${i + 1}`,
    is_active: i % 3 !== 0, // Every 3rd app is inactive
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
    updated_at: new Date(Date.now() - i * 43200000).toISOString(),
  }));
}

export function generateMockTransactions(count: number = 50, apps: any[] = []): any[] {
  const statuses = ['completed', 'pending', 'failed'];
  
  return Array.from({ length: count }, (_, i) => {
    const appIndex = Math.floor(Math.random() * (apps.length || 10));
    const app = apps[appIndex] || { id: appIndex + 1, name: `Test App ${appIndex + 1}` };
    const randomDays = Math.floor(Math.random() * 30);
    
    return {
      id: i + 1,
      mpesa_receipt_number: `MP${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
      phone_number: `+2547${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      amount: Math.floor(Math.random() * 10000) + 100,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      transaction_date: new Date(Date.now() - randomDays * 86400000).toISOString(),
      application_id: app.id,
      application_name: app.name,
      created_at: new Date(Date.now() - i * 3600000).toISOString(),
      updated_at: new Date(Date.now() - i * 1800000).toISOString(),
    };
  });
}

export function generateMockDashboardStats() {
  const totalTransactions = Math.floor(Math.random() * 5000) + 1000;
  const totalAmount = Math.floor(Math.random() * 10000000) + 500000;
  const pendingTransactions = Math.floor(Math.random() * 200) + 10;
  const completedTransactions = Math.floor(totalTransactions * 0.85);
  const failedTransactions = totalTransactions - completedTransactions - pendingTransactions;
  
  // Daily stats for the last 7 days
  const dailyStats = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const count = Math.floor(Math.random() * 200) + 50;
    const amount = Math.floor(Math.random() * 200000) + 50000;
    
    return {
      date: date.toISOString().split('T')[0],
      count,
      amount
    };
  }).reverse();
  
  // Top 5 applications
  const topApplications = Array.from({ length: 5 }, (_, i) => {
    return {
      name: `App ${i + 1}`,
      transactions: Math.floor(Math.random() * 1000) + 100,
      amount: Math.floor(Math.random() * 1000000) + 50000
    };
  }).sort((a, b) => b.transactions - a.transactions);
  
  // Recent 10 transactions
  const recentTransactions = generateMockTransactions(10);
  
  return {
    totalTransactions,
    totalAmount,
    pendingTransactions,
    completedTransactions,
    failedTransactions,
    dailyStats,
    topApplications,
    recentTransactions
  };
}
