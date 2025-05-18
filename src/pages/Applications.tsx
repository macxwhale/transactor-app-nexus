
import React from "react";
import { useApplications } from "@/hooks/useApplications";
import ApplicationsTable from "@/components/applications/ApplicationsTable";
import DeleteApplicationDialog from "@/components/applications/DeleteApplicationDialog";
import EditApplicationDialog from "@/components/applications/EditApplicationDialog";
import CreateApplicationDialog from "@/components/applications/CreateApplicationDialog";
import StatusDialog from "@/components/applications/StatusDialog";
import ApplicationsHeader from "@/components/applications/ApplicationsHeader";

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
    openDeleteDialog,
    currentPage,
    totalPages,
    setCurrentPage,
    allApplicationsCount
  } = useApplications();

  return (
    <div className="space-y-6">
      <ApplicationsHeader 
        fetchApps={fetchApps} 
        isLoading={isLoading}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        handleCreateApplication={handleCreateApplication}
        isSubmitting={isSubmitting}
        totalApplications={allApplicationsCount}
      />

      <ApplicationsTable 
        applications={applications}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onEditApplication={setEditingApp}
        onDeleteApplication={openDeleteDialog}
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

      <CreateApplicationDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateApplication}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Applications;
