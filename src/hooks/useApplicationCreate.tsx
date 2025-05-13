
import { useState } from "react";
import { toast } from "sonner";
import { ApplicationFormValues } from "@/components/applications/ApplicationForm";
import { 
  registerAppWithAPI,
  registerAppWithEdgeFunction
} from "@/services/applicationApiService";
import { checkApplicationExists } from "@/services/applicationSupabaseService";

export function useApplicationCreate(fetchApps: () => Promise<void>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form state when the dialog closes
  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Reset submission state when dialog closes
      setIsSubmitting(false);
    }
  };

  const handleCreateApplication = async (data: ApplicationFormValues) => {
    // Prevent multiple submissions
    if (isSubmitting) return false;
    setIsSubmitting(true);

    try {
      console.log("Creating application with data:", data);
      
      // Check if application with the same name already exists
      const exists = await checkApplicationExists(data.name);
      if (exists) {
        toast.error(`Application with name "${data.name}" already exists`);
        setIsSubmitting(false);
        return false;
      }
      
      // Try API registration first
      let registrationResult = await registerAppWithAPI(data);
      
      // If API registration fails, try Edge Function
      if (!registrationResult.success) {
        console.log("Direct API registration failed, trying Edge Function");
        registrationResult = await registerAppWithEdgeFunction(data);
        
        if (registrationResult.success) {
          // If Edge Function call succeeded, refresh the app list and close dialog
          await fetchApps();
          setIsDialogOpen(false);
          toast.success("Application registered via Edge Function!");
          return true;
        }
      } else if (registrationResult.success) {
        // If API registration succeeded, refresh the app list and close dialog
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
    setIsDialogOpen: handleDialogChange,
    handleCreateApplication,
    isSubmitting
  };
}
