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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateApplication = async (data: ApplicationFormValues) => {
    if (isSubmitting) return false;
    setIsSubmitting(true);

    try {
      console.log("Creating application with data:", data);
      
      // Try API registration first
      let registrationResult = await registerAppWithAPI(data);
      
      // If API registration fails, try Edge Function
      if (!registrationResult.success) {
        console.log("Direct API registration failed, trying Edge Function");
        registrationResult = await registerAppWithEdgeFunction(data);
        
        // Early return if Edge Function succeeded
        if (registrationResult.success) {
          const success = await saveApplicationToSupabase(registrationResult.apiResponse, data);
          if (!success) return false;
          
          await fetchApps();
          setIsDialogOpen(false);
          toast.success("Application registered via Edge Function!");
          return true;
        }
      }
      
      // Handle API success case
      if (registrationResult.success && registrationResult.apiResponse) {
        const success = await saveApplicationToSupabase(registrationResult.apiResponse, data);
        if (!success) return false;
        
        await fetchApps();
        setIsDialogOpen(false);
        toast.success("Application registered successfully");
        return true;
      }
      
      toast.error("Failed to register application with both methods");
      return false;
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    handleCreateApplication,
    isSubmitting
  };
}