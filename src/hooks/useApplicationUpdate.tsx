
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Application } from "@/lib/api";
import { ApplicationFormValues } from "@/components/applications/ApplicationForm";
import { updateAppWithAPI, updateAppWithEdgeFunction } from "@/services/applicationApiService";
import { updateApplicationInSupabase, checkDuplicateApplicationName } from "@/services/applicationSupabaseService";

export function useApplicationUpdate(fetchApps: () => Promise<void>) {
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateApplication = async (data: ApplicationFormValues) => {
    if (!editingApp || isSubmitting) return false;
    
    setIsSubmitting(true);
    
    try {
      const appId = editingApp.id;
      
      // Check if another app with the same name exists (but not this app)
      const isDuplicate = await checkDuplicateApplicationName(data.name, appId);
      if (isDuplicate) {
        toast({
          title: "Update Failed",
          description: `Another application with name "${data.name}" already exists`,
          variant: "destructive"
        });
        return false;
      }

      // Try to update with API first
      let updateResult = await updateAppWithAPI(appId, data);
      
      // If API update fails, try Edge Function
      if (!updateResult.success) {
        console.log("API update failed, trying Edge Function");
        updateResult = await updateAppWithEdgeFunction(appId, data);
        
        // If Edge Function update succeeded
        if (updateResult.success) {
          await fetchApps();
          setEditingApp(null);
          toast({
            title: "Success",
            description: "Application updated via Edge Function"
          });
          return true;
        }
        
        // If Edge Function also failed, try direct Supabase update
        if (!updateResult.success) {
          console.log("Edge Function update failed, trying direct Supabase update");
          const supabaseResult = await updateApplicationInSupabase(appId, data);
          
          if (supabaseResult.success) {
            await fetchApps();
            setEditingApp(null);
            toast({
              title: "Success",
              description: "Application updated successfully via Supabase"
            });
            return true;
          } else {
            toast({
              title: "Update Failed",
              description: supabaseResult.message || "Failed to update application",
              variant: "destructive"
            });
            return false;
          }
        }
      } else {
        // API update succeeded
        await fetchApps();
        setEditingApp(null);
        toast({
          title: "Success",
          description: "Application updated successfully"
        });
        return true;
      }
      
      toast({
        title: "Update Failed",
        description: "Failed to update application using all available methods",
        variant: "destructive"
      });
      return false;
    } catch (error) {
      console.error("Update failed:", error);
      toast({
        title: "Update Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
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
