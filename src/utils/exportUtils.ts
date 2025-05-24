
import { Transaction, Application } from "@/lib/api";

export type ExportFormat = "csv" | "json" | "xlsx";

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  includeHeaders?: boolean;
  selectedFields?: string[];
}

class ExportManager {
  // Export transactions to various formats
  exportTransactions(transactions: Transaction[], options: ExportOptions) {
    const { format, filename = `transactions_${new Date().toISOString().split('T')[0]}` } = options;
    
    switch (format) {
      case "csv":
        this.exportToCSV(transactions, filename, this.getTransactionHeaders(), this.formatTransactionForExport);
        break;
      case "json":
        this.exportToJSON(transactions, filename);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  // Export applications to various formats
  exportApplications(applications: Application[], options: ExportOptions) {
    const { format, filename = `applications_${new Date().toISOString().split('T')[0]}` } = options;
    
    switch (format) {
      case "csv":
        this.exportToCSV(applications, filename, this.getApplicationHeaders(), this.formatApplicationForExport);
        break;
      case "json":
        this.exportToJSON(applications, filename);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private exportToCSV<T>(
    data: T[], 
    filename: string, 
    headers: string[], 
    formatter: (item: T) => string[]
  ) {
    const csvContent = [
      headers.join(","),
      ...data.map(item => formatter(item).map(this.escapeCsvValue).join(","))
    ].join("\n");

    this.downloadFile(csvContent, `${filename}.csv`, "text/csv");
  }

  private exportToJSON<T>(data: T[], filename: string) {
    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(jsonContent, `${filename}.json`, "application/json");
  }

  private downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private escapeCsvValue(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return "";
    const stringValue = String(value);
    if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }

  private getTransactionHeaders(): string[] {
    return [
      "ID",
      "Receipt Number",
      "Phone Number",
      "Amount",
      "Status",
      "Transaction Date",
      "Application Name",
      "Account Reference",
      "Description",
      "Created At"
    ];
  }

  private getApplicationHeaders(): string[] {
    return [
      "ID",
      "Name",
      "Business Short Code",
      "App ID",
      "Status",
      "Created At",
      "Updated At"
    ];
  }

  private formatTransactionForExport(transaction: Transaction): string[] {
    return [
      transaction.id,
      transaction.mpesa_receipt_number || "",
      transaction.phone_number || "",
      transaction.amount?.toString() || "0",
      transaction.status || "",
      transaction.transaction_date || "",
      transaction.application_name || "",
      transaction.account_reference || "",
      transaction.transaction_desc || "",
      transaction.created_at || ""
    ];
  }

  private formatApplicationForExport(application: Application): string[] {
    return [
      application.id,
      application.name,
      application.business_short_code,
      application.app_id || "",
      application.is_active ? "Active" : "Inactive",
      application.created_at || "",
      application.updated_at || ""
    ];
  }
}

export const exportManager = new ExportManager();
