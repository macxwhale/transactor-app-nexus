import React, { useState, useEffect, useMemo } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface DataTableProps<T> {
  data: T[];
  columns: {
    id: string;
    header: string;
    cell: (item: T) => React.ReactNode;
  }[];
  isLoading?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
}: DataTableProps<T>) {
  const [localLoading, setLocalLoading] = useState(isLoading);
  
  // Keep track of the previous data to prevent unnecessary renders
  const [prevData, setPrevData] = useState<T[]>([]);
  
  // Memoize columns to prevent unnecessary re-renders
  const memoizedColumns = useMemo(() => columns, [columns]);
  
  // Use local loading state to prevent flicker
  useEffect(() => {
    if (isLoading) {
      setLocalLoading(true);
    } else {
      // Only update data when not loading and data has changed
      if (data !== prevData) {
        setPrevData(data);
      }
      
      // Add a small delay before showing loaded content
      // to reduce perceived flickering
      const timeout = setTimeout(() => {
        setLocalLoading(false);
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [isLoading, data]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {memoizedColumns.map((column) => (
              <TableHead key={column.id}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {localLoading ? (
            <TableRow>
              <TableCell colSpan={memoizedColumns.length} className="h-48 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <div>Loading data...</div>
                </div>
              </TableCell>
            </TableRow>
          ) : prevData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={memoizedColumns.length} className="h-48 text-center">
                No results found
              </TableCell>
            </TableRow>
          ) : (
            prevData.map((item, i) => (
              <TableRow key={i}>
                {memoizedColumns.map((column) => (
                  <TableCell key={column.id}>{column.cell(item)}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
