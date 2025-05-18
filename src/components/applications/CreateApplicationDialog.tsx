
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ApplicationForm from "@/components/applications/ApplicationForm";

interface CreateApplicationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<boolean>;
  isSubmitting: boolean;
}

const CreateApplicationDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: CreateApplicationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateApplicationDialog;
