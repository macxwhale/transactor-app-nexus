import { useState, useEffect, useMemo } from "react";
import { fetchB2CTransactions, B2CTransaction } from "@/services/b2cTransactionService";
import { toast } from "sonner";

export function useB2CTransactions() {
  const [transactions, setTransactions] = useState<B2CTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchB2CTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching B2C transactions:", error);
      toast.error("Failed to fetch B2C transactions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = !searchTerm || 
        tx.party_b?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.originator_conversation_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.conversation_id?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  return {
    transactions: paginatedTransactions,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems: filteredTransactions.length,
    fetchData
  };
}
