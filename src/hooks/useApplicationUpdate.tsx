
import { useState } from "react";
import { toast } from "sonner";
import { ApplicationFormValues } from "@/components/applications/ApplicationForm";
import { Application } from "@/lib/api";
import { updateApplicationInSupabase } from "@/services/applicationSupabaseService";

export function useApplicationUpdate(fetchApps: () => Promise<void>) {
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateApplication = async (data: ApplicationFormValues) => {
    if (!editingApp || isSubmitting) return false;
    setIsSubmitting(true);

    try {
      console.log("Updating application:", editingApp.id, data);
      
      const success = await updateApplicationInSupabase(editingApp.id, data);
      
      if (success) {
        await fetchApps();
        setEditingApp(null);
        toast.success("Application updated successfully");
        return true;
      } else {
        toast.error("Failed to update application");
        return false;
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update application");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    editingApp,
    setEditingApp,
    handleUpdateApplication,
    isSubmitting
  };
}
