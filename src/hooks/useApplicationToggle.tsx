
import { useState } from "react";
import { toast } from "sonner";
import { 
  toggleStatusWithAPI,
  toggleStatusWithEdgeFunction
} from "@/services/applicationApiService";

export function useApplicationToggle(fetchApps: () => Promise<void>) {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState(false);

  const handleToggleStatus = async () => {
    if (!selectedAppId) return false;
    
    try {
      // Try to update status with the API if apiDomain is configured
      const apiDomain = localStorage.getItem("apiDomain");
      let success = false;
      
      if (apiDomain) {
        // Try API update first
        const apiResult = await toggleStatusWithAPI(selectedAppId, newStatus);
        
        // If API update succeeds
        if (apiResult.success) {
          success = true;
        } else {
          // If API update fails, try Edge Function as fallback
          const edgeResult = await toggleStatusWithEdgeFunction(selectedAppId, newStatus);
          if (edgeResult.success) {
            success = true;
          }
        }
      } else {
        // No API domain configured, use Edge Function directly
        const edgeResult = await toggleStatusWithEdgeFunction(selectedAppId, newStatus);
        if (edgeResult.success) {
          success = true;
        }
      }
      
      if (success) {
        // Refresh the applications list
        await fetchApps();
        
        setIsStatusDialogOpen(false);
        toast.success(`Application ${newStatus ? 'activated' : 'deactivated'} successfully`);
        return true;
      } else {
        toast.error("Failed to toggle application status");
        return false;
      }
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
