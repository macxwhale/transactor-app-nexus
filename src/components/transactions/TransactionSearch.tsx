
import React from "react";
import SearchInput from "@/components/ui/search-input";

interface TransactionSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

const TransactionSearch = (props: TransactionSearchProps) => {
  return <SearchInput {...props} placeholder={props.placeholder || "Search transactions..."} />;
};

export default TransactionSearch;
