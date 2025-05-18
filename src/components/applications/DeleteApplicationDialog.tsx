
import React from "react";
import { Application } from "@/lib/api";
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
import { toast } from "sonner";

interface DeleteApplicationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  application: Application | null;
  onDeleteComplete: () => Promise<void>;
}

const DeleteApplicationDialog = ({
  isOpen,
  onOpenChange,
  application,
  onDeleteComplete,
}: DeleteApplicationDialogProps) => {
  const handleDeleteConfirm = async () => {
    try {
      if (!application) return;
      
      const { success } = await fetch('https://yviivxtgzmethbbtzwbv.supabase.co/functions/v1/delete-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: application.id })
      }).then(res => res.json());
      
      if (success) {
        toast.success(`${application.name} successfully deleted`);
        await onDeleteComplete();
      } else {
        toast.error("Failed to delete application");
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("An error occurred while deleting the application");
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Application</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {application?.name}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteApplicationDialog;
