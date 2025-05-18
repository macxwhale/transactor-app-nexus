
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useApplications } from "@/hooks/useApplications";
import { Application } from "@/lib/api";
import { useApplicationToggle } from "@/hooks/useApplicationToggle";
import { usePagination } from "@/hooks/usePagination";
import ApplicationsTable from "@/components/applications/ApplicationsTable";
import DeleteApplicationDialog from "@/components/applications/DeleteApplicationDialog";
import EditApplicationDialog from "@/components/applications/EditApplicationDialog";
import CreateApplicationDialog from "@/components/applications/CreateApplicationDialog";
import StatusDialog from "@/components/applications/StatusDialog";

const Applications = () => {
  // Use existing hooks
  const {
    applications,
    isLoading,
    editingApp,
    isDialogOpen,
    setIsDialogOpen,
    setEditingApp,
    fetchApps,
    handleCreateApplication,
    handleUpdateApplication,
    isSubmitting
  } = useApplications();
  
  const {
    isStatusDialogOpen,
    setIsStatusDialogOpen,
    newStatus,
    handleToggleStatus,
    openStatusDialog
  } = useApplicationToggle(fetchApps);
  
  // Add pagination hook
  const { currentPage, totalPages, setCurrentPage, setTotalPages } = usePagination();

  // Calculate total pages when applications change
  React.useEffect(() => {
    const ITEMS_PER_PAGE = 10;
    setTotalPages(Math.max(1, Math.ceil(applications.length / ITEMS_PER_PAGE)));
  }, [applications, setTotalPages]);
  
  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<Application | null>(null);

  const handleToggleStatusClick = (app: Application) => {
    openStatusDialog(app.id, !app.is_active);
  };

  const handleDeleteApplication = (app: Application) => {
    setApplicationToDelete(app);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={fetchApps}
            disabled={isLoading}
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          
          <CreateApplicationDialog 
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={handleCreateApplication}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      <ApplicationsTable 
        applications={applications}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onEditApplication={setEditingApp}
        onDeleteApplication={handleDeleteApplication}
        onToggleStatus={handleToggleStatusClick}
      />

      {/* Edit Dialog */}
      <EditApplicationDialog 
        editingApp={editingApp}
        isSubmitting={isSubmitting}
        onClose={() => setEditingApp(null)}
        onSubmit={handleUpdateApplication}
      />

      {/* Delete confirmation dialog */}
      <DeleteApplicationDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        application={applicationToDelete}
        onDeleteComplete={fetchApps}
      />

      {/* Status toggle dialog */}
      <StatusDialog 
        isOpen={isStatusDialogOpen} 
        onOpenChange={setIsStatusDialogOpen}
        onConfirm={handleToggleStatus}
        newStatus={newStatus}
      />
    </div>
  );
};

export default Applications;
