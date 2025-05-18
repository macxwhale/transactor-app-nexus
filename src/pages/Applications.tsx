
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useApplications } from "@/hooks/useApplications";
import ApplicationsTable from "@/components/applications/ApplicationsTable";
import DeleteApplicationDialog from "@/components/applications/DeleteApplicationDialog";
import EditApplicationDialog from "@/components/applications/EditApplicationDialog";
import CreateApplicationDialog from "@/components/applications/CreateApplicationDialog";
import StatusDialog from "@/components/applications/StatusDialog";

const Applications = () => {
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
    handleDeleteApplication,
    isSubmitting,
    isStatusDialogOpen,
    setIsStatusDialogOpen,
    newStatus,
    handleToggleStatus,
    openStatusDialog,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    applicationToDelete,
    currentPage,
    totalPages,
    setCurrentPage
  } = useApplications();

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
        onDeleteApplication={(app) => openStatusDialog(app.id, !app.is_active)}
        onToggleStatus={(app) => openStatusDialog(app.id, !app.is_active)}
      />

      <EditApplicationDialog 
        editingApp={editingApp}
        isSubmitting={isSubmitting}
        onClose={() => setEditingApp(null)}
        onSubmit={handleUpdateApplication}
      />

      <DeleteApplicationDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        application={applicationToDelete}
        onDeleteComplete={handleDeleteApplication}
      />

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
