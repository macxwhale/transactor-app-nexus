
import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
} from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: {
    id: string;
    header: string;
    cell: (item: T) => React.ReactNode;
  }[];
  searchPlaceholder?: string;
  onSearch?: (searchTerm: string) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems?: number; // New prop to display total items count
    onPageChange: (page: number) => void;
  };
  isLoading?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = "Search...",
  onSearch,
  pagination,
  isLoading = false,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [localLoading, setLocalLoading] = useState(isLoading);
  
  // Use local loading state to prevent flicker
  useEffect(() => {
    if (isLoading) {
      setLocalLoading(true);
    } else {
      // Add a small delay before showing loaded content
      // to reduce perceived flickering
      const timeout = setTimeout(() => {
        setLocalLoading(false);
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (onSearch) {
      // Add debounce to avoid constant re-fetching while typing
      onSearch(value);
    }
  };

  return (
    <div className="space-y-4">
      {onSearch && (
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8"
          />
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {localLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <div>Loading data...</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, i) => (
                <TableRow key={i}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>{column.cell(item)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {pagination.totalItems ? (
              <>
                Page {pagination.currentPage} of {pagination.totalPages || 1} 
                <span className="ml-1">
                  ({pagination.totalItems} total records)
                </span>
              </>
            ) : (
              <>Page {pagination.currentPage} of {pagination.totalPages || 1}</>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1 || localLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages || localLoading}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
