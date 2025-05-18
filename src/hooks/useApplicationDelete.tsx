
import { useState } from "react";
import { Application } from "@/lib/api";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useApplicationDelete(fetchApps: () => Promise<void>) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<Application | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteDialog = (app: Application) => {
    setApplicationToDelete(app);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteApplication = async () => {
    if (!applicationToDelete) return false;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationToDelete.id);
      
      if (error) throw error;
      
      await fetchApps();
      toast.success("Application deleted successfully");
      setIsDeleteDialogOpen(false);
      return true;
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete application");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    applicationToDelete,
    isDeleting,
    openDeleteDialog,
    handleDeleteApplication
  };
}
