
import React from "react";
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

interface StatusDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  newStatus: boolean;
}

const StatusDialog = ({ isOpen, onOpenChange, onConfirm, newStatus }: StatusDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {newStatus ? "Activate" : "Deactivate"} Application
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {newStatus ? "activate" : "deactivate"} this application?
            {!newStatus && " The application will no longer process any transactions."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={newStatus ? "bg-success text-success-foreground hover:bg-success/90" : ""}
          >
            {newStatus ? "Activate" : "Deactivate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StatusDialog;
