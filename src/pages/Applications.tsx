
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, RefreshCcw } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { getApplicationColumns } from "@/components/applications/ApplicationColumns";
import ApplicationForm from "@/components/applications/ApplicationForm";
import { useApplications } from "@/hooks/useApplications";
import { Application } from "@/lib/api";
import { toast } from "sonner";
import StatusDialog from "@/components/applications/StatusDialog";
import { useApplicationToggle } from "@/hooks/useApplicationToggle";
import { usePagination } from "@/hooks/usePagination";

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
    selectedAppId,
    newStatus,
    handleToggleStatus,
    openStatusDialog
  } = useApplicationToggle(fetchApps);
  
  // Add pagination hook
  const {
    currentPage,
    totalPages,
    setCurrentPage,
    setTotalPages,
  } = usePagination();

  // Calculate total pages when applications change
  React.useEffect(() => {
    const ITEMS_PER_PAGE = 10;
    setTotalPages(Math.max(1, Math.ceil(applications.length / ITEMS_PER_PAGE)));
  }, [applications, setTotalPages]);
  
  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<Application | null>(null);

  const handleDeleteConfirm = async () => {
    try {
      if (!applicationToDelete) return;
      
      const { success } = await fetch('https://yviivxtgzmethbbtzwbv.supabase.co/functions/v1/delete-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: applicationToDelete.id })
      }).then(res => res.json());
      
      if (success) {
        toast.success(`${applicationToDelete.name} successfully deleted`);
        fetchApps(); // Refresh the list
      } else {
        toast.error("Failed to delete application");
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("An error occurred while deleting the application");
    } finally {
      setIsDeleteDialogOpen(false);
      setApplicationToDelete(null);
    }
  };

  const handleDeleteApplication = (app: Application) => {
    setApplicationToDelete(app);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleStatusClick = (app: Application) => {
    openStatusDialog(app.id, !app.is_active);
  };

  const columns = getApplicationColumns({
    onEditApplication: setEditingApp,
    onDeleteApplication: handleDeleteApplication,
    onToggleStatus: handleToggleStatusClick,
  });

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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                New Application
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Register New Application</DialogTitle>
                <DialogDescription>
                  Fill out this form to register a new M-Pesa application.
                  {localStorage.getItem("apiDomain") ? (
                    <span className="block mt-2 text-xs">Using API: {localStorage.getItem("apiDomain")} (with Edge Function fallback)</span>
                  ) : (
                    <span className="block mt-2 text-xs">Using Edge Function: https://yviivxtgzmethbbtzwbv.supabase.co/functions/v1/register-app</span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <ApplicationForm 
                onSubmit={handleCreateApplication} 
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
              onPageChange: setCurrentPage
            }}
            itemsPerPage={10}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingApp && (
        <Dialog open={!!editingApp} onOpenChange={(open) => !open && setEditingApp(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Application</DialogTitle>
              <DialogDescription>
                Update the details for {editingApp.name}
                {localStorage.getItem("apiDomain") && (
                  <span className="block mt-2 text-xs">API updates will be attempted with fallback to Edge Function</span>
                )}
              </DialogDescription>
            </DialogHeader>
            <ApplicationForm 
              onSubmit={handleUpdateApplication}
              defaultValues={editingApp}
              isEditing
              isSubmitting={isSubmitting}
              appCredentials={{
                app_id: editingApp.app_id,
                app_secret: editingApp.app_secret
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {applicationToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setApplicationToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
