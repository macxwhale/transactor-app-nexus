
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge, StatusType } from "@/components/ui/StatusBadge";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Download, RefreshCcw } from "lucide-react";
import { Transaction, fetchTransactions, Application } from "@/lib/api";
import { generateMockApplications, generateMockTransactions, formatCurrency, formatDate } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    applicationId: "",
    startDate: "",
    endDate: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would call the API
      // const apps = await fetchApplications();
      // const response = await fetchTransactions(currentPage, {
      //   search: searchTerm,
      //   startDate: filters.startDate,
      //   endDate: filters.endDate,
      //   status: filters.status,
      //   applicationId: filters.applicationId ? parseInt(filters.applicationId) : undefined,
      // });

      // For demo purposes, we'll use mock data
      const apps = generateMockApplications(10);
      setApplications(apps);
      
      let mockTransactions = generateMockTransactions(100, apps);
      
      // Apply filters
      if (filters.status) {
        mockTransactions = mockTransactions.filter(tx => tx.status === filters.status);
      }
      
      if (filters.applicationId) {
        mockTransactions = mockTransactions.filter(tx => tx.application_id === parseInt(filters.applicationId));
      }
      
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        mockTransactions = mockTransactions.filter(tx => new Date(tx.transaction_date) >= startDate);
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999); // End of day
        mockTransactions = mockTransactions.filter(tx => new Date(tx.transaction_date) <= endDate);
      }
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        mockTransactions = mockTransactions.filter(tx => 
          tx.mpesa_receipt_number.toLowerCase().includes(term) || 
          tx.phone_number.toLowerCase().includes(term)
        );
      }
      
      // Pagination
      const perPage = 10;
      const totalItems = mockTransactions.length;
      const totalPgs = Math.ceil(totalItems / perPage);
      
      setTotalPages(totalPgs);
      
      // Get current page items
      const startIndex = (currentPage - 1) * perPage;
      const paginatedTransactions = mockTransactions.slice(startIndex, startIndex + perPage);
      
      setTransactions(paginatedTransactions);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, filters]);

  const handleExport = () => {
    toast.success("Export started. Your file will be ready for download shortly.");
    // In a real app, this would trigger an API call to generate and download a report
  };

  const columns = [
    {
      id: "receipt",
      header: "Receipt No.",
      cell: (tx: Transaction) => (
        <div>
          <div className="font-medium">{tx.mpesa_receipt_number}</div>
          <div className="text-sm text-muted-foreground">
            {tx.phone_number}
          </div>
        </div>
      ),
    },
    {
      id: "amount",
      header: "Amount",
      cell: (tx: Transaction) => (
        <div className="font-medium">{formatCurrency(tx.amount)}</div>
      ),
    },
    {
      id: "date",
      header: "Date",
      cell: (tx: Transaction) => formatDate(tx.transaction_date),
    },
    {
      id: "application",
      header: "Application",
      cell: (tx: Transaction) => tx.application_name || `App ID: ${tx.application_id}`,
    },
    {
      id: "status",
      header: "Status",
      cell: (tx: Transaction) => <StatusBadge status={tx.status as StatusType} />,
    },
    {
      id: "actions",
      header: "",
      cell: (tx: Transaction) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTx(tx)}
          >
            View Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => {
              setCurrentPage(1);
              fetchData();
            }}
            disabled={isLoading}
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="gap-1"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            View and filter all your M-Pesa transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/4">
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => {
                  setFilters({ ...filters, status: value });
                  setCurrentPage(1);
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
                  setFilters({ ...filters, applicationId: value });
                  setCurrentPage(1);
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
                      setFilters({
                        ...filters,
                        startDate: date ? format(date, "yyyy-MM-dd") : "",
                      });
                      setCurrentPage(1);
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
                      setFilters({
                        ...filters,
                        endDate: date ? format(date, "yyyy-MM-dd") : "",
                      });
                      setCurrentPage(1);
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DataTable
            data={transactions}
            columns={columns}
            searchPlaceholder="Search by receipt number or phone..."
            onSearch={(term) => {
              setSearchTerm(term);
              setCurrentPage(1);
            }}
            pagination={{
              currentPage,
              totalPages,
              onPageChange: setCurrentPage,
            }}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      {selectedTx && (
        <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Receipt Number</p>
                  <p className="font-medium">{selectedTx.mpesa_receipt_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium">{selectedTx.phone_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">{formatCurrency(selectedTx.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={selectedTx.status as StatusType} className="mt-1" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transaction Date</p>
                  <p className="font-medium">{formatDate(selectedTx.transaction_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Application</p>
                  <p className="font-medium">{selectedTx.application_name || `App ID: ${selectedTx.application_id}`}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">{formatDate(selectedTx.created_at)}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Transactions;
