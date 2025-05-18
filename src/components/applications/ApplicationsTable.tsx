
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { getApplicationColumns } from "@/components/applications/ApplicationColumns";
import { Application } from "@/lib/api";

interface ApplicationsTableProps {
  applications: Application[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEditApplication: (app: Application) => void;
  onDeleteApplication: (app: Application) => void;
  onToggleStatus: (app: Application) => void;
}

const ApplicationsTable = ({
  applications,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onEditApplication,
  onDeleteApplication,
  onToggleStatus
}: ApplicationsTableProps) => {
  const columns = getApplicationColumns({
    onEditApplication,
    onDeleteApplication,
    onToggleStatus,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered Applications</CardTitle>
        <CardDescription>
          Manage your M-Pesa applications and settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={applications}
          columns={columns}
          isLoading={isLoading}
          pagination={{
            currentPage,
            totalPages,
            onPageChange
          }}
        />
      </CardContent>
    </Card>
  );
};

export default ApplicationsTable;
