
import { useState } from "react";
import { toast } from "sonner";
import { Application } from "@/lib/api";
import { ApplicationFormValues } from "@/components/applications/ApplicationForm";
import { updateAppWithAPI, updateAppWithEdgeFunction } from "@/services/applicationApiService";
import { updateApplicationInSupabase } from "@/services/applicationSupabaseService";

export function useApplicationUpdate(fetchApps: () => Promise<void>) {
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateApplication = async (data: ApplicationFormValues) => {
    if (!editingApp || isSubmitting) return false;
    
    setIsSubmitting(true);
    
    try {
      const appId = editingApp.id;
      
      // Try to update with API first
      let updateResult = await updateAppWithAPI(appId, data);
      
      // If API update fails, try Edge Function
      if (!updateResult.success) {
        console.log("API update failed, trying Edge Function");
        updateResult = await updateAppWithEdgeFunction(appId, data);
        
        // If Edge Function update succeeded and already saved to DB
        if (updateResult.success) {
          // Safely check if alreadySaved property exists and is true
          if (updateResult.alreadySaved === true) {
            console.log("Edge Function has already updated the application in database");
            await fetchApps();
            setEditingApp(null);
            toast.success("Application updated via Edge Function");
            return true;
          } else {
            // Edge Function succeeded but didn't save to DB, so we need to save it
            const success = await updateApplicationInSupabase(appId, data);
            if (!success) {
              setIsSubmitting(false);
              return false;
            }
          }
          
          await fetchApps();
          setEditingApp(null);
          toast.success("Application updated via Edge Function");
          return true;
        }
      } else {
        // API update succeeded, now update in Supabase
        const success = await updateApplicationInSupabase(appId, data);
        if (!success) {
          setIsSubmitting(false);
          return false;
        }
        
        await fetchApps();
        setEditingApp(null);
        toast.success("Application updated successfully");
        return true;
      }
      
      toast.error("Failed to update application");
      return false;
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Update failed");
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
