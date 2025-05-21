
import React from "react";
import SearchInput from "@/components/ui/search-input";

interface ApplicationSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

const ApplicationSearch = (props: ApplicationSearchProps) => {
  return <SearchInput {...props} placeholder={props.placeholder || "Search applications..."} />;
};

export default ApplicationSearch;
