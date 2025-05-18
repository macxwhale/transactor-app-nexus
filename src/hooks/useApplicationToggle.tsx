
import { useState } from "react";
import { toast } from "sonner";
import { 
  toggleStatusWithEdgeFunction
} from "@/services/applicationApiService";

export function useApplicationToggle(fetchApps: () => Promise<void>) {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState(false);

  const handleToggleStatus = async () => {
    if (!selectedAppId) return false;
    
    try {
      // Always use the Edge Function since the API is unreliable
      const result = await toggleStatusWithEdgeFunction(selectedAppId, newStatus);
      
      if (result.success) {
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
