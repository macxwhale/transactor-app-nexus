
import { useState } from "react";
import { toast } from "sonner";
import { Application } from "@/lib/api";
import { ApplicationFormValues } from "@/components/applications/ApplicationForm";
import { 
  updateAppWithAPI,
  updateAppWithEdgeFunction
} from "@/services/applicationApiService";
import { updateApplicationInSupabase } from "@/services/applicationSupabaseService";

export function useApplicationUpdate(fetchApps: () => Promise<void>) {
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  const handleUpdateApplication = async (data: ApplicationFormValues) => {
    if (!editingApp) return false;
    
    try {
      // Update the application in Supabase directly
      const supabaseSuccess = await updateApplicationInSupabase(editingApp.id, data);
      if (!supabaseSuccess) {
        return false;
      }

      // Additionally, try to update with the API if apiDomain is configured
      const apiDomain = localStorage.getItem("apiDomain");
      if (apiDomain) {
        // Try API update first
        const apiResult = await updateAppWithAPI(editingApp.id, data);
        
        // If API update fails, try Edge Function as fallback
        if (!apiResult.success) {
          await updateAppWithEdgeFunction(editingApp.id, data);
        }
      }
      
      // Refresh the applications list
      await fetchApps();
      
      setEditingApp(null);
      toast.success("Application updated successfully");
      return true;
    } catch (error) {
      console.error("Failed to update application:", error);
      toast.error("Failed to update application");
      return false;
    }
  };

  return {
    editingApp,
    setEditingApp,
    handleUpdateApplication
  };
}
