
import { useState } from "react";
import { toast } from "sonner";
import { ApplicationFormValues } from "@/components/applications/ApplicationForm";
import { 
  registerAppWithAPI,
  registerAppWithEdgeFunction
} from "@/services/applicationApiService";
import { saveApplicationToSupabase } from "@/services/applicationSupabaseService";

export function useApplicationCreate(fetchApps: () => Promise<void>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateApplication = async (data: ApplicationFormValues) => {
    try {
      console.log("Creating application with data:", data);
      
      // Try API registration first
      let registrationResult = await registerAppWithAPI(data);
      
      // If API registration fails, try Edge Function
      if (!registrationResult.success) {
        console.log("Direct API registration failed, trying Edge Function");
        registrationResult = await registerAppWithEdgeFunction(data);
      }
      
      if (registrationResult.success && registrationResult.apiResponse) {
        // If either API or Edge Function was successful, save to Supabase
        const success = await saveApplicationToSupabase(registrationResult.apiResponse, data);
        if (!success) {
          return false;
        }
      } else {
        toast.error("Failed to register application with both direct API and Edge Function");
        return false;
      }
      
      // Refresh the applications list
      await fetchApps();
      
      setIsDialogOpen(false);
      toast.success("Application registered successfully");
      return true;
    } catch (error) {
      console.error("Failed to register application:", error);
      toast.error("Failed to register application");
      return false;
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    handleCreateApplication
  };
}
