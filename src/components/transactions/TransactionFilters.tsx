
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Application } from "@/lib/api";

interface FiltersState {
  status: string;
  applicationId: string;
  startDate: string;
  endDate: string;
}

interface TransactionFiltersProps {
  filters: FiltersState;
  applications: Application[];
  onFilterChange: (filters: FiltersState) => void;
}

export function TransactionFilters({
  filters,
  applications,
  onFilterChange,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="w-full md:w-1/4">
        <label className="text-sm font-medium mb-2 block">Status</label>
        <Select
          value={filters.status}
          onValueChange={(value) => {
            onFilterChange({ ...filters, status: value });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-1/4">
        <label className="text-sm font-medium mb-2 block">Application</label>
        <Select
          value={filters.applicationId}
          onValueChange={(value) => {
            onFilterChange({ ...filters, applicationId: value });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="All applications" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All applications</SelectItem>
            {applications.map((app) => (
              <SelectItem key={app.id} value={app.id.toString()}>
                {app.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-1/4">
        <label className="text-sm font-medium mb-2 block">Start Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
            >
              {filters.startDate ? (
                format(new Date(filters.startDate), "PPP")
              ) : (
                <span className="text-muted-foreground">Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.startDate ? new Date(filters.startDate) : undefined}
              onSelect={(date) => {
                onFilterChange({
                  ...filters,
                  startDate: date ? format(date, "yyyy-MM-dd") : "",
                });
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full md:w-1/4">
        <label className="text-sm font-medium mb-2 block">End Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
            >
              {filters.endDate ? (
                format(new Date(filters.endDate), "PPP")
              ) : (
                <span className="text-muted-foreground">Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.endDate ? new Date(filters.endDate) : undefined}
              onSelect={(date) => {
                onFilterChange({
                  ...filters,
                  endDate: date ? format(date, "yyyy-MM-dd") : "",
                });
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
