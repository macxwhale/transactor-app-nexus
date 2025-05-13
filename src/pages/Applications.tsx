
import React from "react";
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
import { Plus, RefreshCcw } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { getApplicationColumns } from "@/components/applications/ApplicationColumns";
import ApplicationForm from "@/components/applications/ApplicationForm";
import StatusDialog from "@/components/applications/StatusDialog";
import { useApplications } from "@/hooks/useApplications";

const Applications = () => {
  const {
    applications,
    isLoading,
    editingApp,
    isStatusDialogOpen,
    newStatus,
    isDialogOpen,
    setSearchTerm,
    setIsDialogOpen,
    setEditingApp,
    setIsStatusDialogOpen,
    fetchApps,
    handleCreateApplication,
    handleUpdateApplication,
    handleToggleStatus,
    openStatusDialog
  } = useApplications();

  const columns = getApplicationColumns({
    onEditApplication: setEditingApp,
    onToggleStatus: openStatusDialog,
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
              <ApplicationForm onSubmit={handleCreateApplication} />
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
            searchPlaceholder="Search applications..."
            onSearch={setSearchTerm}
            isLoading={isLoading}
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
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Status Toggle Dialog */}
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
