
import React from "react";
import { Application } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ApplicationForm from "@/components/applications/ApplicationForm";
import { ApplicationFormValues } from "@/components/applications/ApplicationForm";

interface EditApplicationDialogProps {
  editingApp: Application | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicationFormValues) => Promise<boolean>;
}

const EditApplicationDialog = ({
  editingApp,
  isSubmitting,
  onClose,
  onSubmit,
}: EditApplicationDialogProps) => {
  if (!editingApp) return null;

  return (
    <Dialog open={!!editingApp} onOpenChange={(open) => !open && onClose()}>
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
          onSubmit={onSubmit}
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
  );
};

export default EditApplicationDialog;
