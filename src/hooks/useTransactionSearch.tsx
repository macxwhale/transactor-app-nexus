
import { useState, useMemo } from 'react';
import { Transaction } from '@/lib/api';

export function useTransactionSearch(transactions: Transaction[]) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTransactions = useMemo(() => {
    if (!searchTerm.trim()) {
      return transactions;
    }
    
    const lowerSearch = searchTerm.toLowerCase();
    return transactions.filter(tx => 
      (tx.mpesa_receipt_number && tx.mpesa_receipt_number.toLowerCase().includes(lowerSearch)) || 
      (tx.phone_number && tx.phone_number.toLowerCase().includes(lowerSearch)) ||
      (tx.account_reference && tx.account_reference.toLowerCase().includes(lowerSearch)) ||
      (tx.application_name && tx.application_name.toLowerCase().includes(lowerSearch))
    );
  }, [transactions, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredTransactions
  };
}
