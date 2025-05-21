
import React from "react";
import { Filter } from "lucide-react";
import { Application } from "@/lib/api";
import TransactionSearch from "./TransactionSearch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TransactionFilters {
  status: string;
  applicationId: string;
  startDate: string;
  endDate: string;
}

interface TransactionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  applications: Application[];
  onResetFilters: () => void;
}

export function TransactionFilters({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  applications,
  onResetFilters
}: TransactionFiltersProps) {
  const updateFilter = (key: keyof TransactionFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Transaction List</h3>
          <p className="text-sm text-muted-foreground">Search and view transactions</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <TransactionSearch 
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 gap-1">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Filter Transactions</h4>
              
              <div className="space-y-2">
                <label className="text-sm">Status</label>
                <Select value={filters.status} onValueChange={(val) => updateFilter("status", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm">Application</label>
                <Select value={filters.applicationId} onValueChange={(val) => updateFilter("applicationId", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All applications" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All applications</SelectItem>
                    {applications.map(app => (
                      <SelectItem key={app.id} value={app.id}>{app.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="text-sm">Start Date</label>
                  <Input 
                    type="date" 
                    value={filters.startDate} 
                    onChange={(e) => updateFilter("startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">End Date</label>
                  <Input 
                    type="date" 
                    value={filters.endDate} 
                    onChange={(e) => updateFilter("endDate", e.target.value)} 
                  />
                </div>
              </div>
              
              <Button variant="outline" size="sm" onClick={onResetFilters} className="w-full mt-2">
                Reset Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
