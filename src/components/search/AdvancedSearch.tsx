
import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface SearchFilter {
  field: string;
  operator: string;
  value: string;
  label: string;
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilter[]) => void;
  onClear: () => void;
  searchFields: Array<{ value: string; label: string }>;
  className?: string;
}

export function AdvancedSearch({ 
  onSearch, 
  onClear, 
  searchFields,
  className 
}: AdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentFilter, setCurrentFilter] = useState({
    field: "",
    operator: "contains",
    value: ""
  });

  const operators = [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "starts_with", label: "Starts with" },
    { value: "ends_with", label: "Ends with" },
    { value: "greater_than", label: "Greater than" },
    { value: "less_than", label: "Less than" }
  ];

  const handleAddFilter = () => {
    if (currentFilter.field && currentFilter.value) {
      const fieldLabel = searchFields.find(f => f.value === currentFilter.field)?.label || currentFilter.field;
      const operatorLabel = operators.find(o => o.value === currentFilter.operator)?.label || currentFilter.operator;
      
      const newFilter: SearchFilter = {
        ...currentFilter,
        label: `${fieldLabel} ${operatorLabel.toLowerCase()} "${currentFilter.value}"`
      };
      
      setFilters([...filters, newFilter]);
      setCurrentFilter({ field: "", operator: "contains", value: "" });
    }
  };

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleSearch = () => {
    onSearch(searchQuery, filters);
  };

  const handleClear = () => {
    setSearchQuery("");
    setFilters([]);
    setCurrentFilter({ field: "", operator: "contains", value: "" });
    onClear();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Advanced Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter search query..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Active Filters */}
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {filter.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleRemoveFilter(index)}
                />
              </Badge>
            ))}
          </div>
        )}

        {/* Filter Builder */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-4 bg-muted rounded-lg">
            <Select
              value={currentFilter.field}
              onValueChange={(value) => setCurrentFilter({ ...currentFilter, field: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {searchFields.map((field) => (
                  <SelectItem key={field.value} value={field.value}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={currentFilter.operator}
              onValueChange={(value) => setCurrentFilter({ ...currentFilter, operator: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                {operators.map((operator) => (
                  <SelectItem key={operator.value} value={operator.value}>
                    {operator.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Enter value"
              value={currentFilter.value}
              onChange={(e) => setCurrentFilter({ ...currentFilter, value: e.target.value })}
            />

            <Button onClick={handleAddFilter} variant="outline">
              Add Filter
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleSearch} className="flex-1">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button onClick={handleClear} variant="outline">
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
