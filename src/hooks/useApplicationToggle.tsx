
import { useState } from "react";
import { toast } from "sonner";
import { 
  toggleStatusWithAPI,
  toggleStatusWithEdgeFunction
} from "@/services/applicationApiService";
import { updateApplicationStatusInSupabase } from "@/services/applicationSupabaseService";

export function useApplicationToggle(fetchApps: () => Promise<void>) {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState(false);

  const handleToggleStatus = async () => {
    if (!selectedAppId) return false;
    
    try {
      // Update the status in Supabase directly
      const supabaseSuccess = await updateApplicationStatusInSupabase(selectedAppId, newStatus);
      if (!supabaseSuccess) {
        return false;
      }

      // Additionally, try to update status with the API if apiDomain is configured
      const apiDomain = localStorage.getItem("apiDomain");
      if (apiDomain) {
        // Try API update first
        const apiResult = await toggleStatusWithAPI(selectedAppId, newStatus);
        
        // If API update fails, try Edge Function as fallback
        if (!apiResult.success) {
          await toggleStatusWithEdgeFunction(selectedAppId, newStatus);
        }
      }
      
      // Refresh the applications list
      await fetchApps();
      
      setIsStatusDialogOpen(false);
      toast.success(`Application ${newStatus ? 'activated' : 'deactivated'} successfully`);
      return true;
    } catch (error) {
      console.error("Failed to toggle application status:", error);
      toast.error("Failed to toggle application status");
      return false;
    }
  };

  const openStatusDialog = (id: string, status: boolean) => {
    setSelectedAppId(id);
    setNewStatus(status);
    setIsStatusDialogOpen(true);
  };

  return {
    isStatusDialogOpen,
    setIsStatusDialogOpen,
    selectedAppId,
    newStatus,
    setNewStatus,
    handleToggleStatus,
    openStatusDialog
  };
}
